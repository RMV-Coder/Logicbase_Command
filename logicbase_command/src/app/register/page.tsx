// app/register/page.tsx
'use client'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'
import type { DatePickerProps } from 'antd';
import { Snackbar, Alert } from '@mui/material';
import type { Dayjs } from 'dayjs';
import { Button, Form, Input, Spin, Layout, Select, Space, Card, Skeleton, DatePicker } from 'antd'
import Nav from '../components/NavBar';
import { useRouter } from "next/navigation";
const { Content, Footer } = Layout;
const { Option } = Select
interface RegisterFormValues {
    first_name: string,
    last_name: string,
    email: string,
    password: string,
    company: string,
    birthdate: string,
    designation: string,
    contact_number: string
}
function RegisterForm () {
  const [valid, setValid] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [emailPayload, setEmail] = useState('')
  const [allowEmail, setAllowEmail] = useState<boolean>(true)
  const [form] = Form.useForm()
  const token = useSearchParams().get('token')
  const router = useRouter();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const onChange: DatePickerProps<Dayjs[]>['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  useEffect(() => {
    const fetchValidation = async () => {
        setLoading(true)
        const response = await fetch('/api/validate', {
            method: 'POST',
            body: JSON.stringify({ token })
        })
        const data = await response.json();
        if(data.email){
            setEmail(data.email);
            setAllowEmail(false);
        }
        
        setValid(data.valid);
        setLoading(false)
        if (!data.valid && token === null){
            setSnackbarMessage('Missing Registration Token')
            setSnackbarSeverity('error')
            setSnackbarOpen(true)
            router.push("/");
        } else if(!data.valid && token !== null) {
            setSnackbarMessage('Invalid Registration Token')
            setSnackbarSeverity('error')
            setSnackbarOpen(true)
            router.push("/");
        } else if(data.valid && token !== null) {
            console.log('Valid token');
        }
    }
    fetchValidation()
  }, [token])
    const submitRegister = async(values: RegisterFormValues) => {            
        const response = await fetch('/api/register-user', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...values, token })
        })
        if(!response.ok){
            throw new Error("Failed to register user")
        }
        const result = await response.json();
        console.log(result.message);
        setSnackbarMessage(result.message)
        setSnackbarSeverity('success')
        setSnackbarOpen(true)
        router.push("/dashboard");
    }

    const tailLayout = {
        wrapperCol: { offset: 8, span: 16 },
    };
    return (
        <Layout style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <Nav/>
            <Content className="p-4" style={{flex:1, gap: '1rem', display: 'flex', flexDirection: 'column'}}>
                <Skeleton loading={loading}>
                    {valid && token !== null && 
                    <Card style={{width: '100%', maxWidth: '600px'}}>
            
                    <Form onFinish={submitRegister}
                        initialValues={{email: emailPayload}}
                        form={form}
                        labelCol={{ span: 8 }}
                        wrapperCol={{ span: 16 }}
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
                        <Form.Item name="email" label='Email' rules={[{ required: true }]}>
                            <Input placeholder="Company email" disabled={!allowEmail}/>
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
                            name="birthdate"
                            label="Birthdate"
                            rules={[{ required: true, message: 'Please select your birthdate!' }]}
                        >
                            <DatePicker onChange={onChange} needConfirm/>
                        </Form.Item>
                        <Form.Item
                            name="company"
                            label="Company"
                            rules={[{ required: true, message: 'Please select your company!' }]}
                        >
                            <Select placeholder="Select your company">
                            <Option value="Logicbase">Logicbase</Option>
                            <Option value="MoneyCache">MoneyCache</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="designation"
                            label="Designation"
                            rules={[{ required: true, message: 'e.g. Manager, President, Secretary' }]}
                        >
                            <Input placeholder="Select your designation"/>
                        </Form.Item>
                        <Form.Item {...tailLayout} label={null}>
                            <Button type="primary" htmlType="submit">Register</Button>
                        </Form.Item>
                    </Form>
                    </Card>
                    }
                </Skeleton>
            </Content>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
            <Footer className="text-center">Logicbase Command {new Date().getFullYear()} Developed by Raymond Valdepenas</Footer>
        </Layout>
    )
}



function App () {
  return (
    <Suspense fallback={<Spin size="large" className="w-full mt-8" />}>
      <RegisterForm/>
    </Suspense>
  )
}

export default App;