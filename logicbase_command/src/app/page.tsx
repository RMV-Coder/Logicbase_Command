// app/register/page.tsx
'use client'
import { Suspense, useState } from 'react'
import { Snackbar, Alert, Box } from '@mui/material';
import { Button, Form, Input, Spin, Layout, Card, Checkbox, Typography, Select, DatePicker } from 'antd'
import type { DatePickerProps } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import Nav from './components/NavBar'
// import { useRouter } from "next/navigation";
const { Content, Footer } = Layout;
const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { RangePicker } = DatePicker;

interface InquiryFormValues {
  full_name?: string,
  email?: string,
  contact_number?: string,
  company?: string,
  subject?: string,
  preferred_date?: [Dayjs, Dayjs],
  message?: string,
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
function LandingPageLoginForm() {
  const [ loading, setLoading ] = useState<boolean>(false);
  const [form] = Form.useForm();
  // const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  // const [open, setOpen] = useState<boolean>(false);
  const [isMeeting, setIsMeeting] = useState<boolean>(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  // const router = useRouter();


  const getYearMonth = (date: Dayjs) => date.year() * 12 + date.month();
  const disabled7DaysDate: DatePickerProps['disabledDate'] = (current, { from, type }) => {
    if (from) {
      const minDate = from.add(-1, 'days');
      const maxDate = from.add(6, 'days');
  
      switch (type) {
        case 'year':
          return current.year() < minDate.year() || current.year() > maxDate.year();
  
        case 'month':
          return (
            getYearMonth(current) < getYearMonth(minDate) ||
            getYearMonth(current) > getYearMonth(maxDate)
          );
  
        default:
          return Math.abs(current.diff(from.add(3, 'days'), 'days')) >= 4;
      }
    }
  
    return current.add(1, 'days') < dayjs().endOf('day');//i want to use current if startDate is null otherwise the startDate
  };
  const handleSubmit = async(values: InquiryFormValues) => {
    try{
      setLoading(true);
      const response = await fetch('/api/send-inquiry', {
          method: 'POST',
          body: JSON.stringify({ ...values })
      })
      const data = await response.json();
      
      if(!response.ok){
          setSnackbarMessage(data.error);
          throw new Error("Failed to send inquiry");
      }
      setSnackbarMessage(data.message);
      setSnackbarSeverity('success');
    } catch (error) {
      console.error(error);
      setSnackbarSeverity('error')
    } finally {
      setLoading(false);
      setSnackbarOpen(true);
      form.resetFields();
    }
  };

    return (
        <Layout style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
            <Nav/>
            <Content className="p-4" style={{flex:1, gap: '1rem', display: 'flex', flexDirection: 'column'}}>
              <Box sx={{ p:3, mt: 2, display: 'flex', justifyContent: 'center' }}>
                <Title>How can we help?</Title>
              </Box>
              <Card style={{width: '100%', maxWidth: '700px', margin: 'auto', marginTop: '1rem', padding: '1rem'}}>
                <Form onFinish={handleSubmit}
                  form={form}
                  labelCol={{ span: 8 }}
                  wrapperCol={{ span: 16 }}
                  style={{ maxWidth: 600 }}
                  initialValues={{ remember: true }}
                >
                  <Form.Item name="full_name" label='Full Name' rules={[{ required: true }]}>
                    <Input placeholder="Enter your name"/>
                  </Form.Item>
                  <Form.Item
                    name="contact_number"
                    label="Contact Number"
                    rules={[{required: true, message: 'Please input your contact number that we can call you back.'},
                    {min: 10, max:12, message: 'Invalid contact number'}]}
                    hasFeedback
                  >
                    <Input placeholder='09123456789' />
                  </Form.Item>
                  <Form.Item name="email" label='Email Address' rules={[{ required: true }, { type: 'email', message: 'Please enter a valid Email address'}]}>
                    <Input placeholder="Enter your email"/>
                  </Form.Item>
                  <Form.Item name="company" label='Company the Inquiry is For' rules={[{ required: true }]}>
                    <Select placeholder="To whom the inquiry is for?">
                      <Option value="Logicbase Interactive">Logicbase Interactive</Option>
                      <Option value="MoneyCache">MoneyCache</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="subject" label='Subject' rules={[{ required: true }]}>
                    <Input placeholder="Subject - What is the inquiry about?"/>
                  </Form.Item>
                  <Form.Item {...tailLayout} name="book_meeting" valuePropName="book_meeting" label={null}>
                    <Checkbox checked={isMeeting} onChange={(e)=>setIsMeeting(e.target.checked)}>Book an online meeting</Checkbox>
                  </Form.Item>
                  {isMeeting && <Form.Item name="preferred_date"  label="Preferred Date">
                    <RangePicker disabledDate={disabled7DaysDate} style={{width:'100%'}}
                    // onChange={(dates) => {
                    //   if(dates && dates.length === 2){
                    //     setStartDate(dates[0]);
                    //   }
                    // }}
                    />
                  </Form.Item>}
                  <Form.Item name="message" label="Message">
                    <TextArea
                      // value={value}
                      // onChange={(e) => setValue(e.target.value)}
                      placeholder="Message here..."
                      autoSize={{ minRows: 4, maxRows: 7 }}
                    />
                  </Form.Item>
                  <Form.Item {...tailLayout} label={null}>
                    <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
                  </Form.Item>
                </Form>
              </Card>
            </Content>
            <Snackbar anchorOrigin={{ vertical: 'top', horizontal:'center' }} open={snackbarOpen} autoHideDuration={6000} onClose={() => setSnackbarOpen(false)}>
                  <Alert onClose={() => setSnackbarOpen(false)} severity={snackbarSeverity} sx={{ width: '100%' }}>
                      {snackbarMessage}
                  </Alert>
            </Snackbar>
              
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