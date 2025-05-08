import { NextResponse } from "next/server";
import pool from "@/lib/Database/db";
import { RowDataPacket } from "mysql2";

export async function GET() {
  try {
    const connection = await pool.getConnection();

    try {
        // Get user ID
        const [projectRows] = await connection.query<RowDataPacket[]>(
            "SELECT * FROM projects ORDER BY project_id DESC",
            []
        );
        return NextResponse.json({projectRows}, {status: 200});
    } finally {
        if(connection) connection.release();
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
