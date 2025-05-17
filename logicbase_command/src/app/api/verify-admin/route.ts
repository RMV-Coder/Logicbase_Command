import {NextResponse} from "next/server";
import dotenv from 'dotenv';
import pool from "@/lib/Database/db";
import { RowDataPacket } from "mysql2";
import bcrypt from "bcryptjs";
dotenv.config();
export async function POST(req: Request) {
    let connection = null;
    try {
      connection = await pool.getConnection();
      const { email, password } = await req.json();
      if (email === process.env.ADMIN1_EMAIL || email === process.env.ADMIN2_EMAIL){
        const [admin] = await connection.query<RowDataPacket[]>(
            `
            SELECT
              password
            FROM users 
            WHERE email = ?
            `, [email]);
        const isMatch = await bcrypt.compare(password, admin[0].password);
        if (!isMatch) {
          return NextResponse.json({ error: 'Not authorized' }, { status: 404 });
        } else {
          return NextResponse.json({ message: 'Authorized' }, { status: 200 });
        }
      } else {
        return NextResponse.json({ error: 'Not authorized' }, { status: 404 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
  }