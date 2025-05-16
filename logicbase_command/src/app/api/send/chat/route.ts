// pages/api/send/chat.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from "@/app/lib/Database/db";
import { ResultSetHeader, FieldPacket } from "mysql2";
export async function POST(req: NextRequest) {
  if (req.method !== 'POST') return NextResponse.json({ error: 'Method not allowed' }, {status:405});

  const { message_text, message_sender_id, message_chat_id } = await req.json();

  if (!message_text || !message_sender_id || !message_chat_id) {
    return NextResponse.json({ error: 'Missing required fields' }, {status: 400});
  }
  const connection = await pool.getConnection();
  try {
    const timestamp = new Date();
    const [result] = await connection.query(
      `INSERT INTO chat_message (message_text, message_timestamp, message_sender_id, message_chat_id)
       VALUES (?, ?, ?, ?)`,
      [message_text, timestamp, message_sender_id, message_chat_id]
    ) as [ResultSetHeader, FieldPacket[]];

    return NextResponse.json({ message: 'Message sent', message_id: result.insertId }, {status: 200});
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  } finally {
    if(connection) connection.release();
  }
}
