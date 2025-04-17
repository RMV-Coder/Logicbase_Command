// app/register/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Button, Form, Input, Alert, Spin } from 'antd'

function RegisterForm() {
  const [valid, setValid] = useState(false)
  const token = useSearchParams().get('token')

  useEffect(() => {
    fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify({ token })
    }).then(res => res.json())
      .then(data => setValid(data.valid))
  }, [token])

  if (!valid) return <Alert type="error" message="Invalid or expired registration link" />

  return (
    <Form onFinish={(values) => {
      fetch('/api/register', {
        method: 'POST',
        body: JSON.stringify({ ...values, token })
      })
    }}>
      <Form.Item name="email" rules={[{ required: true }]}>
        <Input placeholder="Company email" />
      </Form.Item>
      {/* Password + other fields */}
      <Button type="primary" htmlType="submit">Register</Button>
    </Form>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Spin size="large" className="w-full mt-8" />}>
      <RegisterForm />
    </Suspense>
  )
}