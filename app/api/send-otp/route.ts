import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail, generateOTP } from '@/lib/email-service';
import { rateLimit, getClientIP } from '@/lib/rate-limit';

const otpStore = new Map<string, { otp: string; expires: number; name: string }>();

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders() });
}

export async function POST(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`otp-send:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 5,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Zu viele Anfragen. Bitte warten Sie einen Moment.',
          retryAfter: Math.ceil(rateLimitResult.resetIn / 1000)
        },
        { 
          status: 429,
          headers: {
            ...corsHeaders(),
            'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000)),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
          }
        }
      );
    }

    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'E-Mail und Name sind erforderlich' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Ungültige E-Mail-Adresse' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const sanitizedName = name.replace(/<[^>]*>/g, '').slice(0, 100);
    const sanitizedEmail = email.toLowerCase().trim();

    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000;

    otpStore.set(sanitizedEmail, { otp, expires, name: sanitizedName });

    await sendVerificationEmail(sanitizedEmail, otp, sanitizedName);

    return NextResponse.json(
      { 
        success: true, 
        message: 'Verifizierungscode wurde gesendet' 
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden des Verifizierungscodes' },
      { status: 500, headers: corsHeaders() }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const clientIP = getClientIP(request);
    const rateLimitResult = rateLimit(`otp-verify:${clientIP}`, {
      windowMs: 60000,
      maxRequests: 10,
    });

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { 
          error: 'Zu viele Versuche. Bitte warten Sie einen Moment.',
          retryAfter: Math.ceil(rateLimitResult.resetIn / 1000)
        },
        { 
          status: 429,
          headers: {
            ...corsHeaders(),
            'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000)),
          }
        }
      );
    }

    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'E-Mail und Code sind erforderlich' },
        { status: 400, headers: corsHeaders() }
      );
    }

    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedOtp = otp.replace(/\D/g, '').slice(0, 6);

    const stored = otpStore.get(sanitizedEmail);
    
    if (!stored) {
      return NextResponse.json(
        { error: 'Kein Verifizierungscode gefunden. Bitte fordern Sie einen neuen an.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(sanitizedEmail);
      return NextResponse.json(
        { error: 'Der Verifizierungscode ist abgelaufen. Bitte fordern Sie einen neuen an.' },
        { status: 400, headers: corsHeaders() }
      );
    }

    if (stored.otp !== sanitizedOtp) {
      return NextResponse.json(
        { error: 'Ungültiger Verifizierungscode' },
        { status: 400, headers: corsHeaders() }
      );
    }

    otpStore.delete(sanitizedEmail);

    return NextResponse.json(
      { 
        success: true, 
        verified: true,
        message: 'E-Mail erfolgreich verifiziert' 
      },
      { headers: corsHeaders() }
    );
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Verifizierung' },
      { status: 500, headers: corsHeaders() }
    );
  }
}
