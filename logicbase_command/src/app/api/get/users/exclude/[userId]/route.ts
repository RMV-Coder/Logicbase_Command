import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/lib/Database/db";
import { RowDataPacket } from "mysql2";
interface User {
  user_id: number;
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
        const [users] = await connection.query<RowDataPacket[]>(
            `
        SELECT
          u.user_id,
          u.first_name,
          u.last_name,
          u.profile_image
        FROM users u
        WHERE u.user_id != ?
        AND u.user_id NOT IN (
          SELECT cm2.user_id
          FROM chats c
          JOIN chat_members cm1 ON cm1.chat_id = c.chat_id AND cm1.user_id = ?
          JOIN chat_members cm2 ON cm2.chat_id = c.chat_id AND cm2.user_id != ?
        )
        `,
        [userId, userId, userId]
        );
        const formattedUsers: User[] = (users || []).map((user) => ({
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        profile_image: user.profile_image,
      }));
        return NextResponse.json({users: formattedUsers, message:"Users fetched successfully"}, {status: 200});
    } finally {
        if(connection) connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
