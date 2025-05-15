import {NextResponse} from "next/server";
import dotenv from 'dotenv';
dotenv.config();
export async function POST(req: Request) {
    try {
      const { email } = await req.json()
      if (email !== process.env.ADMIN1_EMAIL || email !== process.env.ADMIN2_EMAIL){
        return NextResponse.json({ error: 'Not authorized' }, { status: 404 });
      } else {
        return NextResponse.json({ message: 'Authorized' }, { status: 200 });
      }
    } catch (error) {
      console.error(error);
      return NextResponse.json({ error: "Server error." }, { status: 500 });
    }
  }