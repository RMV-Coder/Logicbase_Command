// app/register/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import { Button, Form, Input, Alert, Spin, Layout, Select, Space } from 'antd'
const { Header, Content, Footer } = Layout;
const { Option } = Select
function RegisterForm() {
  const [valid, setValid] = useState(false)
  const [email, setEmail] = useState('')
  const [form] = Form.useForm()
  const token = useSearchParams().get('token')

  useEffect(() => {
    fetch('/api/validate', {
      method: 'POST',
      body: JSON.stringify({ token })
    }).then(res => res.json())
      .then(data => {setEmail(data.email); setValid(data.valid)})
  }, [token])

  if (!valid) return <Alert type="error" message="Invalid or expired registration link" />

  return (
        <Layout style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
        <Header className="bg-white shadow-sm">
            <h1 className="text-2xl font-bold">Logicbase Command | Register</h1>
        </Header>
        <Content className="p-4" style={{flex:1, gap: '1rem', display: 'flex', flexDirection: 'column'}}>
            
            <Form onFinish={(values) => {
                fetch('/api/register', {
                    method: 'POST',
                    body: JSON.stringify({ ...values, token })
                })
                }}
                initialValues={{email: email}}
                form={form}
                ><Form.Item
                label="Name"
                >
                  <Space.Compact>
                    <Form.Item
                    name="first_name"
                    rules={[{
                        required: true,
                        message: 'Please input first name!',
                      },
                    ]}
                    noStyle
                    >
                      <Input placeholder='First Name'/>
                    </Form.Item>
                    <Form.Item
                    name="last_name"
                    rules={[{
                        required: true,
                        message: 'Please input last name!',
                      },
                    ]}
                    noStyle
                    >
                      <Input placeholder='Last Name'/>
                    </Form.Item>
                  </Space.Compact>
                </Form.Item>
                <Form.Item name="email" rules={[{ required: true }]}>
                    <Input placeholder="Company email" />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={[{required: true, message: 'Please input your password!',},
                    {min: 6, message: 'Password must be at least 6 characters long!'}]}
                    hasFeedback
                >
                    <Input.Password />
                </Form.Item>

                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[{required: true, message: 'Please confirm your password!',},
                    ({ getFieldValue }) => ({
                        validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                        }
                        return Promise.reject(new Error('The new password that you entered do not match!'));
                        },
                    }),
                    ]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item
                    name="gender"
                    label="Gender"
                    rules={[{ required: true, message: 'Please select gender!' }]}
                >
                    <Select placeholder="Not specified">
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    </Select>
                </Form.Item>
                <Form.Item
                    name="designation"
                    label="Designation"
                    rules={[{ required: true, message: 'Please select your designation!' }]}
                >
                    <Select placeholder="Select your designation">
                    <Option value="Logicbase">Logicbase</Option>
                    <Option value="MoneyCache">MoneyCache</Option>
                    </Select>
                </Form.Item>
                {/* Password + other fields */}
                <Button type="primary" htmlType="submit">Register</Button>
            </Form>
        </Content>
        <Footer className="text-center">Logicbase Command ©{new Date().getFullYear()} Developed by Raymond Valdepeñas</Footer>
    </Layout>
      
    
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<Spin size="large" className="w-full mt-8" />}>
      <RegisterForm />
    </Suspense>
  )
}