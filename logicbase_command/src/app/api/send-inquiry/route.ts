import { NextResponse } from "next/server";
import pool from "@/lib/Database/db";
import { ResultSetHeader, FieldPacket } from "mysql2";
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import sendMail from '@/hooks/mailer';
interface InquiryFormValues {
  full_name?: string,
  email?: string,
  contact_number?: string,
  company?: string,
  subject?: string,
  preferred_date?: [Dayjs, Dayjs],
  message?: string,
};
export async function POST(req: Request) {
  try {
    const { full_name, email, contact_number, company, subject, preferred_date, message}:InquiryFormValues = await req.json();
    const connection = await pool.getConnection();
    
    
    try {
        if (!full_name || !email || !contact_number || !company || !subject || !preferred_date || !message) {
            return NextResponse.json({ error: "All fields are required." }, { status: 400 });
        }
        const formattedDates = preferred_date?.map((date) => dayjs(date).format('YYYY-MM-DD'));
        // Get user ID
        await connection.query(`
            INSERT INTO concerns (full_name, email, contact_number, company, subject, preferred_start, preferred_end, created_at, message) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [full_name, email, contact_number, company, subject, formattedDates[0], formattedDates[1], new Date() ,message]
        ) as [ResultSetHeader, FieldPacket[]];
        const email_message = {
            from: process.env.WEB_APP_EMAIL,
            to: email,
            subject: 'Inquiry Received',
            text: `Hello ${full_name}, we have received your inquiry.`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f9f9f9; padding: 40px; color: #1a1a1a;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <h2 style="margin-top: 0; font-weight: 600; color: #0f172a;">Hi ${full_name},</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        Thank you for reaching out to us. We've received your inquiry and will get back to you shortly.
                    </p>
                    <p style="font-size: 14px; color: #64748b;">— The Logicbase Team</p>
                    </div>
                    <div style="text-align: center; margin-top: 32px; font-size: 12px; color: #94a3b8;">
                    © ${new Date().getFullYear()} Logicbase Command App. All rights reserved.
                    </div>
                </div>
                `
        };
        const response = await sendMail(email, email_message.subject, email_message.text, email_message.html);
        if (response.success) {
            console.log('Email sent successfully');
            return NextResponse.json({message: 'Message sent successfully, You may check your email.'}, {status: 200});
        } else {
            console.error('Error sending email:', response.error);
            return NextResponse.json({message: 'Error sending message, please try again later.'}, {status: 500});
        }
    } finally {
        if(connection) connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
