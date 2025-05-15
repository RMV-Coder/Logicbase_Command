// /api/get/chats/${userId}/route.ts
import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/lib/Database/db";
import { RowDataPacket } from "mysql2";

interface ChatParticipant {
    userId: number;
    name: string;
    avatarUrl: string | null;
}

interface Chat {
    chatId: number;
    chatToken: string;
    recentMessage: string | null;
    recentTime: string | null;
    participants: ChatParticipant[];
    messages: { sender: string; content: string; timestamp: string }[];
}

interface ChatQueryRow {
    chat_id: number;
    chat_token: string;
    recent_message: string | null;
    recent_time: string | null;
    member_id: number;
    first_name: string;
    last_name: string;
    profile_image: string | null;
}

export async function GET(req: NextRequest, {params}: {params: {userId: string}}) {
    try {
        const { userId } = params;
        const connection = await pool.getConnection();
        console.log("User ID:", userId);
        try {
            const query = `
                SELECT
                    c.chat_id,
                    c.chat_token,
                    MAX(m.message_text) AS recent_message,
                    MAX(m.message_timestamp) AS recent_time,
                    u.user_id AS member_id,
                    u.first_name,
                    u.last_name,
                    u.profile_image
                FROM chats c
                JOIN chat_members cm ON cm.chat_id = c.chat_id
                JOIN chat_members cm2 ON cm2.chat_id = c.chat_id
                JOIN users u ON u.user_id = cm2.user_id
                LEFT JOIN chat_message m ON m.message_chat_id = c.chat_id
                WHERE cm.user_id = ?
                GROUP BY c.chat_id, c.chat_token, u.user_id, u.first_name, u.last_name, u.profile_image
                ORDER BY MAX(m.message_timestamp) DESC
            `;
            const [rows] = await connection.query<RowDataPacket[]>(
                query,
                [userId]
            );
            const chatMap: Record<number, Chat> = {};
            (rows as ChatQueryRow[]).forEach((row) => {
                const chatId = row.chat_id;
                if (!chatMap[chatId]) {
                    chatMap[chatId] = {
                        chatId,
                        chatToken: row.chat_token,
                        recentMessage: row.recent_message,
                        recentTime: row.recent_time,
                        participants: [],
                        messages: [], // Initialize messages as an empty array
                    };
                }

                chatMap[chatId].participants.push({
                    userId: row.member_id,
                    name: `${row.first_name} ${row.last_name}`,
                    avatarUrl: row.profile_image,
                });
            });

            const chats: Chat[] = Object.values(chatMap);
            return NextResponse.json({chats, message:"Chat Data Retrieved Successfully"}, {status: 200});
        } finally {
            if(connection) connection.release();
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
}