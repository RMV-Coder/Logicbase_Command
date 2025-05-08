import { NextResponse, NextRequest } from "next/server";
import pool from "@/app/lib/Database/db";
import { RowDataPacket } from "mysql2";

export async function GET(req: NextRequest, {params}: {params: {userId: string}}) {
  try {
    const { userId } = params;
    const connection = await pool.getConnection();
    console.log("User ID:", userId);
    try {
        const [userRows] = await connection.query<RowDataPacket[]>(
            "SELECT * FROM users WHERE user_id != ? ORDER BY user_id ASC",
            [userId]
        );
        return NextResponse.json({users: userRows, message:"Chat Data Retrieved Successfully"}, {status: 200});
    } finally {
        if(connection) connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
