import { NextResponse } from "next/server";
import pool from "@/lib/Database/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
export async function POST(req: Request) {
  try {
    const { user_id } = await req.json()

    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(
            'SELECT * FROM activity_log WHERE user_id = ? ORDER BY created_at DESC',
            [user_id]
        ) as [ResultSetHeader, FieldPacket[]];
        return NextResponse.json({rows}, {status: 200});
    } finally {
        if(connection) connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
