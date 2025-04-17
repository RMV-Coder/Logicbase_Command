import { SignJWT } from 'jose'
import { NextResponse } from 'next/server'

const secret = new TextEncoder().encode(process.env.JWT_SECRET!)
console.log('Secret:', secret)
export async function POST(req: Request) {
  const { email, role } = await req.json()
  console.log('Email:', email)
  console.log('Role:', role)
    const token = await new SignJWT({ role: role, email: email })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret)

  const qrUrl = `${process.env.NEXTAUTH_URL}/register?token=${token}`
  console.log('QR URL:', qrUrl)
  return NextResponse.json({qrUrl, token});
}