import { NextResponse } from 'next/server';
import pool from '@/app/lib/Database/db';
import { RowDataPacket } from 'mysql2';
import bcrypt from "bcryptjs";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
        const { current_password, new_password } = await req.json();
        const connection = await pool.getConnection();
        try {
            
            const [userRows] = await connection.query<RowDataPacket[]>(
                "SELECT password FROM users WHERE user_id = ?",
                [params.id]
            );
            const isMatch = await bcrypt.compare(current_password, userRows[0].password);
            if (!isMatch) {
                return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
            }
            const hashedNewPassword = await bcrypt.hash(new_password, 10);
            await connection.query("UPDATE users SET password = ? WHERE user_id = ?", [hashedNewPassword, params.id]);
            
            return NextResponse.json({ message: 'Password updated successfully' });
            
        } finally {
            connection.release();
        }
    } catch (err) {
      console.error('Error updating password:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
