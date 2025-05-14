import { NextResponse } from "next/server";
import pool from "@/lib/Database/db";
import type { Dayjs } from 'dayjs';
import { FieldPacket } from "mysql2";
interface ConcernsData {
  concern_id: number;
  full_name: string;
  subject: string;
  message: string;
  date: string;
  preferred_start: Dayjs;
  preferred_end: Dayjs;
}
export async function POST(req: Request) {
  try {
    const { company_name, status } = await req.json()

    const connection = await pool.getConnection();

    try {
        const [rows] = await connection.query(
            "SELECT * FROM concerns WHERE company = ? AND status = ? ORDER BY concern_id DESC",
            [company_name, status]
        ) as [ConcernsData[], FieldPacket[]];
        return NextResponse.json({rows}, {status: 200});
    } finally {
        if(connection) connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
