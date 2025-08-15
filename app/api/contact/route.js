import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Validate required fields
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Portfolio Contact <${process.env.FROM_EMAIL || 'onboarding@resend.dev'}>`,
      to: [process.env.TO_EMAIL || 'ida.adiputra@outlook.com'],
      subject: `Portfolio Contact: ${subject}`,
      replyTo: email,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Contact Message</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f7;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
            
            <!-- Header -->
            <div style="background-color: #1d1d1f; padding: 32px 40px; text-align: center;">
              <div style="display: inline-block; width: 48px; height: 48px; background-color: #007aff; border-radius: 12px; margin-bottom: 16px; position: relative;">
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); color: white; font-size: 24px; font-weight: 600;">✉</div>
              </div>
              <h1 style="color: #f5f5f7; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: -0.5px;">
                New Contact Message
              </h1>
              <p style="color: #a1a1a6; margin: 8px 0 0 0; font-size: 15px; font-weight: 400;">
                Portfolio Inquiry
              </p>
            </div>

            <!-- Content -->
            <div style="padding: 40px;">
              
              <!-- Contact Info Card -->
              <div style="background-color: #f9f9f9; border-radius: 16px; padding: 32px; margin-bottom: 32px; border: 1px solid #e5e5e7;">
                <div style="display: flex; align-items: center; margin-bottom: 24px;">
                  <div style="width: 40px; height: 40px; background-color: #007aff; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                    <span style="color: white; font-size: 18px; font-weight: 600;">👤</span>
                  </div>
                  <h2 style="margin: 0; color: #1d1d1f; font-size: 20px; font-weight: 600;">${name}</h2>
                </div>
                
                <div style="space-y: 16px;">
                  <div style="margin-bottom: 16px;">
                    <div style="color: #86868b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">EMAIL</div>
                    <a href="mailto:${email}" style="color: #007aff; text-decoration: none; font-size: 16px; font-weight: 500;">${email}</a>
                  </div>
                  
                  <div>
                    <div style="color: #86868b; font-size: 13px; font-weight: 500; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">SUBJECT</div>
                    <div style="color: #1d1d1f; font-size: 16px; font-weight: 500;">${subject}</div>
                  </div>
                </div>
              </div>

              <!-- Message Card -->
              <div style="background-color: #ffffff; border-radius: 16px; padding: 32px; border: 1px solid #e5e5e7; margin-bottom: 32px;">
                <div style="display: flex; align-items: center; margin-bottom: 20px;">
                  <div style="width: 40px; height: 40px; background-color: #34c759; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-right: 16px;">
                    <span style="color: white; font-size: 18px;">💬</span>
                  </div>
                  <h3 style="margin: 0; color: #1d1d1f; font-size: 18px; font-weight: 600;">Message</h3>
                </div>
                
                <div style="color: #424245; font-size: 16px; line-height: 1.6; white-space: pre-wrap; padding: 20px; background-color: #f9f9f9; border-radius: 12px; border-left: 4px solid #007aff;">
                  ${message}
                </div>
              </div>

              <!-- Action Card -->
              <div style="background-color: #007aff; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
                <div style="color: white; font-size: 16px; font-weight: 500; margin-bottom: 8px;">
                  Ready to respond?
                </div>
                <div style="color: rgba(255, 255, 255, 0.8); font-size: 14px;">
                  Simply reply to this email to contact ${name} directly
                </div>
              </div>

            </div>

            <!-- Footer -->
            <div style="background-color: #f9f9f9; padding: 24px 40px; text-align: center; border-top: 1px solid #e5e5e7;">
              <div style="color: #86868b; font-size: 13px; margin-bottom: 8px;">
                Received on ${new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
              <div style="color: #86868b; font-size: 12px;">
                Sent via Portfolio Contact Form
              </div>
            </div>

          </div>
        </body>
        </html>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email' },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)
    return NextResponse.json(
      { message: 'Email sent successfully', id: data.id },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    )
  }
}