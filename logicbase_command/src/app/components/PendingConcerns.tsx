// components/ChatPreviewComponent.tsx
import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import {  Typography, Box, Button, Card, CardContent, CardActions } from '@mui/material';
import { Divider, Drawer, Form, Input, Select, DatePicker, message } from 'antd';
import type { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;
interface ConcernsData {
  concern_id: number;
  full_name: string;
  subject: string;
  message: string;
  contact_number: string;
  email: string;
  created_at: Dayjs;
  preferred_start: Dayjs;
  preferred_end: Dayjs;
  status: string;
  user_id: string;
}
interface ConcernsProps {
  data: ConcernsData[],
  user_id?: string
  refetch: () => void
}
interface FormFields {
  concern_id: number;
  full_name: string;
  subject: string;
  email: string;
  status: string;
  email_reply: string;
  response_type: string;
  consultation: string[];
}

const PendingConcernsCard: React.FC<ConcernsProps> = ({data, user_id, refetch}) => {
  const [openDrawer, setOpenDrawer] = useState(false);
  const [selectedConcern, setSelectedConcern] = useState<ConcernsData | null>(null);
  const [form] = Form.useForm();
  console.log("Data received::", data);
  const editConcern = (concern_id: number, concernData: ConcernsData) => {
    setSelectedConcern(concernData);
    form.setFieldsValue({
      concern_id: concern_id,
      full_name: concernData.full_name,
      subject: concernData.subject,
      email: concernData.email,
      status: concernData.status,
      response_type: '',
      email_reply: '',
      consultation: [],
    });
    setOpenDrawer(true);
  };
  const onFinish = async (values:FormFields) => {
    console.log('Submitted values:', values);
    try {
      const response = await fetch(`/api/update-concern`, {
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({...values, user_id}),
      });
      const data = await response.json()
      if (!response.ok){
        message.error(data.error);
        throw new Error('Failed to update concerns data');
      }
      message.success("Concern updated successfully!");
    } catch (error) {
      console.error(error);
    } finally {
      setOpenDrawer(false);
      setSelectedConcern(null);
      refetch();
      form.resetFields();
    }
  };
  const getDisabledRange: RangePickerProps['disabledDate'] = (current) => {
    if (!selectedConcern) return false;
    const start = dayjs(selectedConcern.preferred_start).startOf('day');
    const end = dayjs(selectedConcern.preferred_end).endOf('day');
    return current && (current < start || current > end);
  };
  return (
    // <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', mb: 2 }}>
      <>
      <Box sx={{ display: 'flex', mr: 2, flex:1 }}>
        
          <Card sx={{p: 3, flex:1, minWidth:'35%', maxWidth:'100%', maxHeight:'72vh', display:'flex', flexDirection:'column'}}>
            <CardContent sx={{flex:1, display:'flex', flexDirection:'column'}}>
                    <Typography variant="h5" sx={{ mb: 2 }}>
                      Pending Concerns
                    </Typography>
                    <Box sx={{flex:1, overflowY:'auto'}}>
                    {data?.length > 0 ? ( data.map((dataItem) => (
                      <>
                      <Card sx={{borderLeftWidth:3, borderLeftColor: dataItem.status==='Open'?'red':dataItem.status==='In progress'?'blue':'gray' }}>
                      <CardContent key={dataItem.concern_id}>
                        <Typography variant="h6">{dataItem.subject}</Typography>
                        <Typography variant="body1">By:      {dataItem.full_name}</Typography>
                        <Typography variant="body1">Details: {dataItem.message}</Typography>
                        <Divider/>
                        <Typography variant="body1">Email:   {dataItem.email}</Typography>
                        <Typography variant="body1">Contact Number: {dataItem.contact_number}</Typography>
                        <Typography variant="body1">Preferred Meeting Consultation Date: {dayjs(dataItem.preferred_start).format('MMM D, YYYY')} - {dayjs(dataItem.preferred_end).format('MMM D, YYYY')}</Typography>
                        <Typography variant="body1">Created at: {dayjs(dataItem.created_at).format('MMM D, YYYY')}</Typography>
                      </CardContent>
                      <CardActions>
                          <Button size="small" onClick={() => editConcern(dataItem.concern_id, dataItem)}>Respond</Button>
                          {/* <Button size="small">View</Button> */}
                      </CardActions>
                      </Card>
                      </>
                    ))):
                      <Card>
                        <CardContent>
                          <Typography variant="h6">{"No Pending Concerns"}</Typography>
                        </CardContent>
                      </Card>}
                    </Box>
                </CardContent>
          </Card>          
        
      </Box>
      <Drawer
      title="Respond to Concern"
      width={400}
      onClose={() => setOpenDrawer(false)}
      open={openDrawer}
    >
      <Form layout="vertical" form={form} onFinish={onFinish}>
        <Form.Item name="concern_id" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="full_name" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="subject" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="email" noStyle>
          <Input type="hidden" />
        </Form.Item>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select placeholder="Select status">
            <Select.Option value="Open">Open</Select.Option>
            <Select.Option value="In Progress">In Progress</Select.Option>
            <Select.Option value="Closed">Closed</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item name="email_reply" label="Email Reply (optional)">
          <Input.TextArea rows={3} placeholder="Type email reply here..." />
        </Form.Item>
        <Form.Item name="response_type" label="Response Type" rules={[{ required: true }]}>
          <Select placeholder="Select response type">
            <Select.Option value="Phone Call">Phone Call</Select.Option>
            <Select.Option value="Video Meeting (Google Meet)">{'Video Meeting (Google Meet)'}</Select.Option>
            <Select.Option value="On-site/Office meeting">{'On-site/Office Meeting'}</Select.Option>
          </Select>
        </Form.Item>

        {selectedConcern?.preferred_start && selectedConcern?.preferred_end && (
          <Form.Item name="consultation" label="Consultation Schedule">
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              disabledDate={getDisabledRange}
            />
          </Form.Item>
        )}

        <Form.Item>
          <Button type="submit" variant="contained" fullWidth>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Drawer>
    </>
  );
};

export default PendingConcernsCard;
