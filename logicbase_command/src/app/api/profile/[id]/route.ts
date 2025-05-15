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
            CONCAT(u.first_name, ' ', u.last_name) AS Name,
            u.email as Email,
            u.company_name as Company,
            u.designation as Designation,
            u.birthdate as Birthdate,
            u.contact_number as 'Contact Number',
            u.gender as Gender
            FROM users u WHERE u.user_id = ?`,
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
      console.error('Error fetching kanban config:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
export async function POST(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
        const { email, birthdate, company_name, designation, gender, contact_number, first_name, last_name, profile_image } = await req.json();
        const connection = await pool.getConnection();
        try {
            if(profile_image){
                await connection.query(
                    `
                    UPDATE users
                    SET profile_image = ?
                    WHERE user_id = ?
                    `,
                    [ profile_image, params.id]
                );
                return NextResponse.json({ message: 'Profile picture updated successfully' });
            } else{
                await connection.query(
                    `
                    UPDATE users
                    SET email = ?, birthdate = ?, company_name = ?, designation = ?, gender = ?, contact_number = ?, first_name = ?, last_name = ?
                    WHERE user_id = ?
                    `,
                    [ email, birthdate, company_name, designation, gender, contact_number, first_name, last_name, params.id]
                );
                return NextResponse.json({ message: 'Profile updated successfully' });
            }
        } finally {
            connection.release();
        }
    } catch (err) {
      console.error('Error fetching kanban config:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
