import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
const { users } = require('./placeholder_data.ts');

// Email transporter configuration
const transporter = nodemailer.createTransport({
  host: 'mail.silkroutepress.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  logger: false,
  debug: false,
});

export async function GET() {
  try {
    const emailPromises = users.map(user => {
      return transporter.sendMail({
        from: `"Silk Route Press" <${process.env.EMAIL_USER}>`,
        to: user.email,
        subject: 'Important Update from Silk Route Press',
        text: `Hello ${user.name},\n\nThis is a notification from Silk Route Press.\n\nOur new reader is now live! You can now access all your purchased books on our website.\n\nPlease visit https://srp-pdf-viewer.vercel.app/ and use ${user.email} as your username and ${user.password} as your password to log in.\n\nBest regards,\nSilk Route Press\n`,
        html: `<p>Hello ${user.name},</p>
               <p>This is a notification from Silk Route Press.</p>
               <p>Our new ebook reader is now live! You can now access all your purchased books on our ebook reader website. This new product is a browser based website reading experience rather than an app.</p>
               <p>Please visit <a href="https://srp-pdf-viewer.vercel.app/">https://srp-pdf-viewer.vercel.app/</a> and use <strong>${user.email}</strong> as your username and <strong>${user.password}</strong> as your password to log in.</p>
               <p>You can also access the ebook reader directly through the Silk Route Press website at <a href="https://www.silkroutepress.com/">https://www.silkroutepress.com/</a>.</p>
               <p>It is possible that our e-reader website may be blocked by some anti-virus software. If this occurs please just white-list the site in your browser/anti-virus software or with your IT administrators.</p>
               <p>If you have any questions or need assistance, please contact us at <a href="mailto:ebooks.admin@silkroutepress.com">
               <p>Sincerely,<br>Silk Route Press</p>`,
      });
    });

    await Promise.all(emailPromises);

    return NextResponse.json({ message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending emails:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
