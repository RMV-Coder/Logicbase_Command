import { NextResponse } from 'next/server';
import pool from '@/app/lib/Database/db';
import { RowDataPacket } from 'mysql2';
export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          `
            SELECT 
            profile_image
            FROM users WHERE user_id = ?`,
          [params.id]
        );
  
        if (!rows.length) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        return NextResponse.json({ profile: rows[0]});
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error('Error fetching user profile image:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}