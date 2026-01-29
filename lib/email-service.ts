import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {
    apiKey: connectionSettings.settings.api_key, 
    fromEmail: connectionSettings.settings.from_email
  };
}

export async function getResendClient() {
  const { apiKey, fromEmail } = await getCredentials();
  return {
    client: new Resend(apiKey),
    fromEmail
  };
}

export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendVerificationEmail(toEmail: string, otp: string, userName: string) {
  const { client, fromEmail } = await getResendClient();
  
  const result = await client.emails.send({
    from: fromEmail || 'noreply@geruestbauer24.eu',
    to: toEmail,
    subject: 'Ihr Verifizierungscode - Gerüstbauer24',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
        <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          <div style="background: white; border-radius: 16px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            <div style="text-align: center; margin-bottom: 32px;">
              <h1 style="color: #1e293b; font-size: 24px; margin: 0;">
                Gerüstbauer<span style="color: #2563eb;">24</span>
              </h1>
            </div>
            
            <h2 style="color: #1e293b; font-size: 20px; margin-bottom: 16px;">
              Hallo ${userName},
            </h2>
            
            <p style="color: #64748b; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
              Vielen Dank für Ihre Registrierung bei Gerüstbauer24. Bitte verwenden Sie den folgenden Code, um Ihre E-Mail-Adresse zu bestätigen:
            </p>
            
            <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); border-radius: 12px; padding: 24px; text-align: center; margin-bottom: 24px;">
              <span style="font-size: 32px; font-weight: bold; color: white; letter-spacing: 8px;">
                ${otp}
              </span>
            </div>
            
            <p style="color: #64748b; font-size: 14px; line-height: 1.6; margin-bottom: 8px;">
              Dieser Code ist <strong>10 Minuten</strong> gültig.
            </p>
            
            <p style="color: #94a3b8; font-size: 12px; line-height: 1.6; margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
              Falls Sie diese Registrierung nicht angefordert haben, können Sie diese E-Mail ignorieren.
            </p>
          </div>
          
          <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
            © ${new Date().getFullYear()} Gerüstbauer24. Alle Rechte vorbehalten.
          </p>
        </div>
      </body>
      </html>
    `
  });
  
  return result;
}
