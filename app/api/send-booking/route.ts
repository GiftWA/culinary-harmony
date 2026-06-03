import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, phone, occasion, event_date, guests, message } = body;

  try {
    await resend.emails.send({
      from: 'Culinary Harmony <onboarding@resend.dev>',
      to: ['giftwasili27@gmail.com', 'lawsonphiri28@gmail.com'],
      subject: `New Booking Request - ${occasion} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0a0a0a; color: #fafaf8; padding: 40px; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #d4a017; font-size: 28px; margin: 0;">Culinary Harmony</h1>
            <p style="color: #888; margin: 5px 0;">New Booking Request Received</p>
          </div>
          
          <div style="background: #111; padding: 24px; border-radius: 6px; border-left: 4px solid #d4a017; margin-bottom: 20px;">
            <h2 style="color: #d4a017; margin: 0 0 20px 0; font-size: 18px;">Booking Details</h2>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 10px 0; color: #888; width: 40%;">Name</td>
                <td style="padding: 10px 0; color: #fafaf8; font-weight: bold;">${name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 10px 0; color: #888;">Email</td>
                <td style="padding: 10px 0; color: #fafaf8;">${email}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 10px 0; color: #888;">Phone / WhatsApp</td>
                <td style="padding: 10px 0; color: #fafaf8;">${phone}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 10px 0; color: #888;">Occasion</td>
                <td style="padding: 10px 0; color: #d4a017; font-weight: bold;">${occasion}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 10px 0; color: #888;">Event Date</td>
                <td style="padding: 10px 0; color: #fafaf8;">${new Date(event_date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</td>
              </tr>
              <tr style="border-bottom: 1px solid #222;">
                <td style="padding: 10px 0; color: #888;">Number of Guests</td>
                <td style="padding: 10px 0; color: #fafaf8;">${guests} people</td>
              </tr>
              ${message ? `
              <tr>
                <td style="padding: 10px 0; color: #888;">Message</td>
                <td style="padding: 10px 0; color: #fafaf8;">${message}</td>
              </tr>` : ''}
            </table>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="mailto:${email}" style="background: #d4a017; color: #0a0a0a; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; margin-right: 10px;">Reply to Client</a>
            <a href="tel:${phone}" style="background: #111; color: #d4a017; padding: 12px 30px; text-decoration: none; font-weight: bold; border-radius: 4px; border: 1px solid #d4a017;">Call Client</a>
          </div>

          <p style="color: #444; text-align: center; margin-top: 30px; font-size: 12px;">
            This email was sent from the Culinary Harmony booking system · Blantyre, Malawi
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
}