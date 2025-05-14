// /app/api/projects/[id]/kanban/route.ts (PUT)
import { NextResponse } from 'next/server';
import pool from '@/app/lib/Database/db';
import { RowDataPacket } from 'mysql2';
import { z } from 'zod';
const TaskSchema = z.object({
    id: z.string(),
    content: z.string(),
  });
  
  const ColumnSchema = z.object({
    id: z.string(),
    title: z.string(),
    taskIds: z.array(z.string()),
  });
  
  const KanbanSchema = z.object({
    tasks: z.record(TaskSchema),
    columns: z.record(ColumnSchema),
    columnOrder: z.array(z.string()),
  });
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json(); // expects { kanban: {...} }
    console.log("Body: ", body);
    // Convert kanban from JSON string to object
const parsedKanbanData = JSON.parse(body.kanban);
    const parsed = KanbanSchema.safeParse(parsedKanbanData.kanbanData);
    if (!parsed.success) {
      return NextResponse.json({ error: 'Invalid Kanban format', details: parsed.error }, { status: 400 });
    }
    console.log("Parsed: ", parsedKanbanData.kanbanData);
    const connection = await pool.getConnection();

    try {
      // Fetch current config
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT project_config FROM projects WHERE project_id = ?',
        [params.id]
      );

      if (!rows.length) {
        return NextResponse.json({ error: 'Project not found' }, { status: 404 });
      }

        let config = rows[0].project_config;
        if (typeof config === 'string') {
        config = JSON.parse(config);
        }
        config.kanban = parsedKanbanData.kanbanData; 
      await connection.query(
        'UPDATE projects SET project_config = ? WHERE project_id = ?',
        [JSON.stringify(config), params.id]
      );

      return NextResponse.json({ message: 'Kanban updated' });
    } finally {
      connection.release();
    }
  } catch (err) {
    console.error('Error updating kanban config:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
  ) {
    try {
      const connection = await pool.getConnection();
      try {
        const [rows] = await connection.query<RowDataPacket[]>(
          `
          SELECT project_config FROM projects WHERE project_id = ?`,
          [params.id]
        );
        console.log("Rows: ", rows);
  
        if (!rows.length) {
          return NextResponse.json({ error: 'Project not found' }, { status: 404 });
        }
  
        let config = rows[0].project_config;
        if (typeof config === 'string') {
            config = JSON.parse(config);
        }
        // ✅ If no kanban exists, initialize default
        if (!config.kanban) {
            console.log("No kanban found, initializing default");
            config.kanban = {
                tasks: {
                    'initial-task': {
                    id: 'initial-task',
                    content: 'Initial Project Meeting',
                    },
                },
                columns: {
                    'todo': {
                    id: 'todo',
                    title: 'To Do',
                    taskIds: ['initial-task'],
                    },
                },
                columnOrder: ['todo'],
            };
            await connection.query(
                'UPDATE projects SET project_config = ? WHERE project_id = ?',
                [JSON.stringify(config), params.id]
            );
        }
        return NextResponse.json({ kanban: config.kanban});
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
        const { status } = await req.json();
        const connection = await pool.getConnection();
        try {
        await connection.query<RowDataPacket[]>(
          `
          UPDATE projects SET project_status = ? WHERE project_id = ?`,
          [status, params.id]
        );
        return NextResponse.json({ message: 'Project status updated' });
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error('Error fetching kanban config:', err);
      return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
  }