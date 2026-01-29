import { NextRequest, NextResponse } from 'next/server';
import { sendVerificationEmail, generateOTP } from '@/lib/email-service';

// Store OTPs temporarily (in production, use Redis or database)
const otpStore = new Map<string, { otp: string; expires: number; name: string }>();

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json();
    
    if (!email || !name) {
      return NextResponse.json(
        { error: 'E-Mail und Name sind erforderlich' },
        { status: 400 }
      );
    }

    const otp = generateOTP();
    const expires = Date.now() + 10 * 60 * 1000; // 10 minutes

    // Store OTP
    otpStore.set(email.toLowerCase(), { otp, expires, name });

    // Send email
    await sendVerificationEmail(email, otp, name);

    return NextResponse.json({ 
      success: true, 
      message: 'Verifizierungscode wurde gesendet' 
    });
  } catch (error) {
    console.error('Error sending OTP:', error);
    return NextResponse.json(
      { error: 'Fehler beim Senden des Verifizierungscodes' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { email, otp } = await request.json();
    
    if (!email || !otp) {
      return NextResponse.json(
        { error: 'E-Mail und Code sind erforderlich' },
        { status: 400 }
      );
    }

    const stored = otpStore.get(email.toLowerCase());
    
    if (!stored) {
      return NextResponse.json(
        { error: 'Kein Verifizierungscode gefunden. Bitte fordern Sie einen neuen an.' },
        { status: 400 }
      );
    }

    if (Date.now() > stored.expires) {
      otpStore.delete(email.toLowerCase());
      return NextResponse.json(
        { error: 'Der Verifizierungscode ist abgelaufen. Bitte fordern Sie einen neuen an.' },
        { status: 400 }
      );
    }

    if (stored.otp !== otp) {
      return NextResponse.json(
        { error: 'Ungültiger Verifizierungscode' },
        { status: 400 }
      );
    }

    // OTP is valid - remove it
    otpStore.delete(email.toLowerCase());

    return NextResponse.json({ 
      success: true, 
      verified: true,
      message: 'E-Mail erfolgreich verifiziert' 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    return NextResponse.json(
      { error: 'Fehler bei der Verifizierung' },
      { status: 500 }
    );
  }
}
