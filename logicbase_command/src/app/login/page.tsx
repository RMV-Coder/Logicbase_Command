// app/register/page.tsx
'use client'
import { Suspense,  } from 'react'
import { Spin, Layout } from 'antd'
import Nav from '../components/NavBar'
import LoginForm from '../components/LoginForm';
const { Footer } = Layout;


function LandingPageLoginForm() {
    return (
        <Layout style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <Nav/>
            <LoginForm/>
            <Footer className="text-center">Logicbase Command {new Date().getFullYear()} Developed by Raymond Valdepeñas</Footer>
        </Layout>
    )
}
export default function LandingPage() {
  return (
    <Suspense fallback={<Spin size="large" className="w-full mt-8" />}>
      <LandingPageLoginForm />
    </Suspense>
  )
}