// /api/create/chat/route.ts
import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { v4 as uuidv4 } from "uuid";

interface Chat {
  chat_id: number;
  chat_token: string;
  chat_config: {
    participants: number[];
  };
}
export async function POST(req: Request) {
  try {
    const { sender_id, receiver_id } = await req.json();

    if (!sender_id || !receiver_id) {
      return NextResponse.json({ error: "Missing sender or receiver ID" }, { status: 400 });
    }

    // ✅ Sort participants so [1, 2] and [2, 1] are treated the same
    const participants = [sender_id, receiver_id].sort((a, b) => a - b);

    const connection = await pool.getConnection();
    try {
      // ✅ Check if chat already exists with the same participants
      const [existingChats]: [Chat[], FieldPacket[]] = await connection.query(
        `
        SELECT chat_id FROM chats
        WHERE JSON_CONTAINS(chat_config->'$.participants', JSON_ARRAY(?))
          AND JSON_CONTAINS(chat_config->'$.participants', JSON_ARRAY(?))
        LIMIT 1
        `,
        [participants[0], participants[1]]
      ) as [Chat[], FieldPacket[]];

      if (existingChats.length > 0) {
        return NextResponse.json({ chatId: existingChats[0].chat_id, message: "Chat already exists" }, { status: 200 });
      }

      // ✅ Create new chat
      const chat_token = uuidv4();
      const chat_config = {
        participants,
        created_at: new Date().toISOString(),
      };

      const [result] = await connection.query<ResultSetHeader>(
        `
        INSERT INTO chats (chat_token, chat_config)
        VALUES (?, ?)
        `,
        [chat_token, JSON.stringify(chat_config)]
      );

      const newChatId = result.insertId;

      // ✅ Add participants to the chat_members table
      await connection.execute(
        `
        INSERT INTO chat_members (chat_id, user_id)
        VALUES (?, ?), (?, ?)
        `,
        [newChatId, sender_id, newChatId, receiver_id]
      );

      return NextResponse.json({ chatId: newChatId, chatToken: chat_token, message: "New chat created" }, { status: 201 });

    } catch (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: "Database error" }, { status: 500 });
    } finally {
      connection.release();
    }
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}