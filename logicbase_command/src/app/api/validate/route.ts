// app/api/validate/route.ts
import { jwtVerify } from 'jose'
import { NextResponse, NextRequest } from 'next/server'
export async function POST(req: NextRequest) {
    const { token } = await req.json()
    console.log('Token:', token)
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
    console.log('Secret:', secret)
    try {
        const { payload } = await jwtVerify(token, secret)
        console.log('Payload:', payload)
        return NextResponse.json({ valid: true, role: payload.role })
    } catch {
        return NextResponse.json({ valid: false }, { status: 401 })
    }
  }