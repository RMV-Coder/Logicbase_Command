import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import dayjs from "dayjs";
import sendMail from '@/hooks/mailer';
interface FormFields {
    concern_id: number;
    full_name: string;
    subject: string;
    status: string;
    email: string;
    email_reply: string;
    response_type: string;
    consultation: string[];
    user_id: string;
  }
export async function POST(req: Request) {
  try {
    const { concern_id, full_name, subject, status, response_type, email, email_reply, consultation, user_id } : FormFields = await req.json();
    const formattedDates = consultation?.map((date) => dayjs(date).format());
    const connection = await pool.getConnection();

    try {
        await connection.query(
            "UPDATE concerns SET status = ? WHERE concern_id = ?", 
            [status, concern_id]
        ) as [ResultSetHeader, FieldPacket[]];
        await connection.query(`
            INSERT INTO activity_log (user_id, action, entity, start, end, created_at) VALUES (?, ?, ?, ?, ?)`,
            [user_id, response_type, 'client', formattedDates[0], formattedDates[1], new Date()]
        ) as [ResultSetHeader, FieldPacket[]];
        const email_message = {
            from: process.env.WEB_APP_EMAIL,
            to: email,
            subject: `Response to ${subject}`,
            text: `Hello ${full_name}, here's a response to your inquiry.`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, sans-serif; background-color: #f9f9f9; padding: 40px; color: #1a1a1a;">
                    <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 32px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <h2 style="margin-top: 0; font-weight: 600; color: #0f172a;">Hi ${full_name},</h2>
                    <p style="font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
                        ${email_reply}
                        <br>
                        <br>
                        ${response_type}
                        <br>
                        Consultation: ${formattedDates[0]} to ${formattedDates[1]}
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
