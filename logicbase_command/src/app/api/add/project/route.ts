import { NextResponse } from "next/server";
import pool from "@/app/lib/Database/db";
import { FieldPacket, ResultSetHeader } from "mysql2";
import { DateTime } from "luxon";
interface ProjectFormValues {
    project_name: string,
    project_details: string
    project_due: string,
    project_type: string,
}
export async function POST(req: Request
  //,{ params }: { params: { id: string } }
) {
  try {
    const { project_name, project_details, project_due, project_type}:ProjectFormValues = await req.json();
    const mysql_date = DateTime.fromISO(project_due).setZone('Asia/Manila').toFormat('yyyy-LL-dd');
    if (!project_name || !project_details || !project_due || !project_type) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }
    const project_config = JSON.stringify({
      project_type
    });
    // ✅ Check database connection
    const connection = await pool.getConnection();
    try{
      console.log('Will insert project');
      const query = `
      INSERT INTO projects (project_name, project_details, project_due, project_config) VALUES (?, ?, ?, ?)
      `;
      const values=[project_name, project_details, mysql_date, project_config];

      await connection.query(
        query,
        values
      ) as [ResultSetHeader, FieldPacket[]];
      console.log('Inserted project');
      const response = NextResponse.json({message: "Project added successfully!"},{ status: 201 });
      return response;
    } catch(error){
      throw new Error (`Database error: ${error}`);
    } finally {
      if(connection) connection.release();
    }
    
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
