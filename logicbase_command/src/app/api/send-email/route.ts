import sendMail from '@/hooks/mailer';
import { SignJWT } from 'jose'
import { NextRequest, NextResponse } from 'next/server';

function generateSixDigitCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
async function generateResetPasswordToken(code:string){
    const tokenExpiry = '15m';
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    const token = await new SignJWT({ code: code })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime(tokenExpiry)
        .sign(secret)
    return token;
}
export async function POST(req: NextRequest){
    try {
        const { email, qr } = await req.json();
        if(qr){
            const qrUrl = `${process.env.NEXTAUTH_URL}/register?token=${qr}`
            const message = {
                from: process.env.WEB_APP_EMAIL,
                to: email,
                subject: 'Create an Account with Logicbase Command App',
                text: `Click the link below to create an account`,
                html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px;">
                    <p>Dear User,</p>
                    <p>You have been sent a registration link to create an account for Logicbase Command App. Please click the link below to proceed with the registration process:</p>
                    <a href="${qrUrl}" target="_blank" style="font-size: 24px; font-weight: bold; color: #233570;" >Create Account</a> 
                    <p>This link is valid for 1 hour. If you think this is a mistake, please ignore this email.</p>
                    <br>
                    <p>Thank you,</p>
                    <p>Logicbase Command App</p>
                </div>`
            };
        
            const response = await sendMail(email, message.subject, message.text, message.html);
            if (response.success) {
                console.log('Registration link sent via email successfully');
                return NextResponse.json({ message: 'Registration link sent via email successfully' }, { status: 200 });
            } else {
                console.error('Error sending email:', response.error);
                return NextResponse.json({ error: response.error }, { status: 400 });
            }
        } else {
            const code:string = generateSixDigitCode();
            const resetToken = generateResetPasswordToken(code);
            const message = {
                from: process.env.WEB_APP_EMAIL,
                to: email,
                subject: 'Password Reset Request',
                text: `Use the code below to reset your password: ${code}`,
                html: `
                <div style="font-family: Arial, sans-serif; font-size: 16px;">
                    <p>Dear user,</p>
                    <p>We received a request to reset your password. Use the code below to reset your password:</p>
                    <p style="font-size: 24px; font-weight: bold; color: #ff0000;">${code}</p>
                    <p>This code is valid for 15 minutes. If you did not request a password reset, please ignore this email.</p>
                    <p>Thank you,</p>
                    <p>TCMC</p>
                </div>`
            };
        
            const response = await sendMail(email, message.subject, message.text, message.html);
            if (response.success) {
                console.log('Password reset email sent successfully');
                return NextResponse.json({ token: resetToken }, { status: 200 });
            } else {
                console.error('Error sending email:', response.error);
                return NextResponse.json({ error: response.error }, { status: 400 });
            }
        }
        
    } catch (error) {
        console.error('Error processing request', error);
        return NextResponse.json({error: error}, {status: 400});
    }
}