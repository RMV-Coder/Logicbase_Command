// app/admin/qr/page.tsx
'use client'
import { useState, useEffect } from 'react';

import { Button, Form, Modal, Input, Layout, Space, QRCode } from 'antd';
import AlertDialog from '@/app/components/DialogueComponent';
import Nav from '../../components/NavBar';
import VerifyAdminDialog from '@/app/components/VerifyAdminDialog';
// import { useQRCode } from 'next-qrcode';
import { DateTime } from "luxon";
const { Content, Footer } = Layout;
interface FormValues {
    email: string
}
interface ResponseValues {
    qrUrl: string;
    token: string
}
export default function QRGenerator() {
    // const { SVG } = useQRCode();
    const [qr, setQr] = useState<string>('')
    const [form] = Form.useForm();
    const [isEmail, setIsEmail] = useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false)
    const [showDialog, setShowDialog] = useState<boolean>(false)
    const [showVerifyDialog, setShowVerifyDialog] = useState<boolean>(false)
    // const [dialogMessage, setDialogMessage] = useState<string>('')
    const [isAdmin, setIsAdmin] = useState<boolean>(false);
    useEffect(()=>{
        if(!isAdmin){
            setShowVerifyDialog(true)
        }
    }, [])
    const generateQR = async (email?:string) => {
        const res = await fetch('/api/generate-qr',{
            method: 'POST',
            // headers: {
            //     'Content-Type': 'application/json',
            // },
            body:  JSON.stringify({ role:'admin', email })

        })
        if (!res.ok) {
            console.error('Failed to generate QR code')
            return
        }
        const  {qrUrl, token} : ResponseValues  = await res.json()
        // if(qrUrl) {
            console.log('QR URL:', qrUrl)
            setQr(qrUrl)
            if(isEmail){
                return token
            }
        // }
    }

    const sendEmail = async (values: FormValues) => {
        setLoading(true);
        const token = await generateQR(values.email);
        const res = await fetch('/api/send-email', {
            method: 'POST',
            body: JSON.stringify({ email: values.email, qr: token }),
        })
        if (!res.ok) {
            console.error('Failed to send email')
            return
        }
        const result = await res.json()
        console.log('Email sent:', result)
        if(result.message==='Registration link sent via email successfully'){
            setIsEmail(false)
            setQr('')
            setShowDialog(true)
        }
        setLoading(false)
    }


  return (
    <>
    <Layout style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
        {/* <Header className="bg-white shadow-sm">
            <h1 className="text-2xl font-bold">Logicbase Command | Admin</h1>
        </Header> */}
        <Nav/>
        <Content className="p-4" style={{flex:1, gap: '1rem', display: 'flex', flexDirection: 'column'}}>
            <div className="bg-white p-4 rounded shadow-sm">
                <h2 className="text-xl font-semibold mb-4">Generate QR Code for Employee Registration</h2>
                <p>Click the button below to generate a QR code for employee registration.</p>
            </div>
            <Space>
                <Button onClick={() => generateQR()}>Generate Employee QR</Button>
                <Button onClick={()=>setIsEmail(true)}>Send Registration Link via Email</Button>
            
            </Space>
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
            <Modal open={qr!==''&& !isEmail} onCancel={() => setQr('')} onOk={() => setQr('')}>
                {/* <div dangerouslySetInnerHTML={{ __html: qr || '' }} /> */}
                <p>Scan this QR to register a new employee (expires in {DateTime.now().plus({ hours: 1 }).toFormat('DD hh:mm a')})</p>
                <QRCode
                    style={{margin: 'auto'}}
                    type='svg'
                    value={qr}
                    size={400}
                    // options={{
                    //     margin: 2,
                    //     width: 200,
                    //     color: {
                    //     dark: '#010599FF',
                    //     light: '#FFBF60FF',
                    //     },
                    // }}
                    />
            </Modal>
            <VerifyAdminDialog open={showVerifyDialog} onClose={()=>setShowVerifyDialog(false)} isVerified={setIsAdmin}/>
            <AlertDialog title="Email Sent" content="Registration link sent via email successfully! Please ask your employee to check their email." open={showDialog} onClose={() => {setQr(''); setIsEmail(false); setShowDialog(false)}} primaryButtonText="Okay" onPrimaryClick={() => {setQr(''); setIsEmail(false); setShowDialog(false)}}/>
        </Content>
        <Footer className="text-center">Logicbase Command ©{new Date().getFullYear()} Developed by Raymond Valdepeñas</Footer>
    </Layout>
      
    </>
  )
}