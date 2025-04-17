// app/admin/qr/page.tsx
'use client'
import { useState } from 'react'
import { Button, Form, Modal, Input } from 'antd'
import { useQRCode } from 'next-qrcode';
import { DateTime } from "luxon";
interface FormValues {
    email: string
}
export default function QRGenerator() {
    const { SVG } = useQRCode();
    const [qr, setQr] = useState<string>('')
    const [form] = Form.useForm();
    const [isEmail, setIsEmail] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const generateQR = async () => {
        const res = await fetch('/api/generate-qr')
        if (!res.ok) {
            console.error('Failed to generate QR code')
            return
        }
        const  qrUrl  = await res.json()
        // if(qrUrl) {
            console.log('QR URL:', qrUrl)
            setQr(qrUrl)
            if(isEmail){
                return qrUrl
            }
        // }
    }

    const sendEmail = async (values: FormValues) => {
        setLoading(true);
        const qrURL = await generateQR();
        const res = await fetch('/api/send-email', {
            method: 'POST',
            body: JSON.stringify({ email: values.email, qr: qrURL }),
        })
        if (!res.ok) {
            console.error('Failed to send email')
            return
        }
        const result = await res.json()
        console.log('Email sent:', result)
        setLoading(false)
    }


  return (
    <>
      <Button onClick={generateQR}>Generate Employee QR</Button>
      <Button onClick={()=>setIsEmail(true)}>Send Registration Link via Email</Button>
      <Modal open={isEmail} onCancel={() => setIsEmail(false)} title="Send Registration Link via Email">
        <Form onFinish={sendEmail}
        form={form}
        // size='large'
        name='emailForm'>
            <Form.Item label="Email" name="email" rules={[{ required: true, message: "Please input employee's email" }]}>
                <Input type="email" placeholder="Enter employee's email address" />
            </Form.Item>
            <Form.Item>
                <Button type="primary" htmlType="submit" loading={loading}>Send Email</Button>
            </Form.Item>
        </Form>
      </Modal>
      <Modal open={qr!==''&& !isEmail} onCancel={() => setQr('')}>
        {/* <div dangerouslySetInnerHTML={{ __html: qr || '' }} /> */}
        <p>Scan this QR to register new employees (expires in {DateTime.now().plus({ hours: 1 }).toFormat('DD hh:mm a')})</p>
        <SVG
            text={qr}
            options={{
                margin: 2,
                width: 200,
                color: {
                dark: '#010599FF',
                light: '#FFBF60FF',
                },
            }}
            />
      </Modal>
    </>
  )
}