// app/api/validate/route.ts
import { jwtVerify } from 'jose'
import { NextResponse, NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
    const { token } = await req.json()
    const secret = process.env.JWT_SECRET as unknown as Uint8Array;
    try {
      const { payload } = await jwtVerify(token, secret)
      return NextResponse.json({ valid: true, role: payload.role })
    } catch {
      return NextResponse.json({ valid: false }, { status: 401 })
    }
  }