import nodemailer from 'nodemailer'

// إعداد transporter للبريد الإلكتروني
const createTransporter = () => {
  // في الإنتاج، استخدم خدمة بريد حقيقية مثل SendGrid, Mailgun, إلخ
  if (process.env.NODE_ENV === 'production') {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
  }
  
  // في التطوير، استخدم console.log أو خدمة تجريبية
  return {
    sendMail: async (options: any) => {
      console.log('📧 Email would be sent:', options)
      return { messageId: 'test-message-id' }
    }
  }
}

interface SendEmailOptions {
  to: string
  subject: string
  html: string
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  const transporter = createTransporter()
  
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"منصة سبق" <noreply@sabq.ai>',
      to,
      subject,
      html,
    })
    
    console.log('✅ Email sent:', info.messageId)
    return true
  } catch (error) {
    console.error('❌ Error sending email:', error)
    return false
  }
}

export function generatePasswordResetEmail(name: string, resetLink: string) {
  return {
    subject: 'إعادة تعيين كلمة المرور - منصة سبق',
    html: `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            direction: rtl;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
            border-bottom: 2px solid #eee;
            margin-bottom: 30px;
          }
          .header h1 {
            color: #2563eb;
            margin: 0;
            font-size: 28px;
          }
          .content {
            text-align: right;
          }
          .button {
            display: inline-block;
            padding: 12px 30px;
            background-color: #2563eb;
            color: white;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
            font-weight: bold;
          }
          .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
          }
          .warning {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            padding: 10px;
            border-radius: 5px;
            margin: 20px 0;
            color: #92400e;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>منصة سبق الذكية</h1>
          </div>
          <div class="content">
            <h2>مرحباً ${name || 'عزيزي المستخدم'}</h2>
            <p>تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك.</p>
            <p>لإعادة تعيين كلمة المرور، انقر على الزر أدناه:</p>
            
            <div style="text-align: center;">
              <a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a>
            </div>
            
            <div class="warning">
              <strong>تنبيه:</strong> هذا الرابط صالح لمدة ساعة واحدة فقط. إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد.
            </div>
            
            <p>إذا كان لديك مشاكل في النقر على الزر، يمكنك نسخ الرابط التالي ولصقه في المتصفح:</p>
            <p style="word-break: break-all; color: #2563eb;">${resetLink}</p>
          </div>
          <div class="footer">
            <p>مع تحيات فريق منصة سبق</p>
            <p>© 2025 منصة سبق الذكية. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }
} 