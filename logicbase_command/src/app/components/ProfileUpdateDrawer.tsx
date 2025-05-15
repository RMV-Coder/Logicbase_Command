

import React from 'react';
import type { Dayjs } from 'dayjs';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
// import dayjs from 'dayjs';
// const { RangePicker } = DatePicker;
const { Option } = Select;
interface ProfileData {
    first_name?: string,
    last_name?: string,
    name?: string;
    email: string;
    birthdate: Dayjs;
    company_name: string;
    designation: string;
    registered_at?: Dayjs;
    // profile_image: string;
    gender: string;
    contact_number: string;
}
interface ProfileFormData {
    email: string;
    birthdate: Dayjs;
    company_name: string;
    designation: string;
    gender: string;
    contact_number: string;
    first_name:string;
    last_name:string;
}
interface ProfileUpdateDrawerFormProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onPrimaryClick: (values:ProfileData) => void;
    data: ProfileData|null
};

const ProfileUpdateDrawerForm: React.FC<ProfileUpdateDrawerFormProps> = ({open, loading, data, onClose, onPrimaryClick}) => {
    const [form] = Form.useForm();
    const onPrimaryClick_ = () => {
        // onPrimaryClick(values)
        form.validateFields().then((values) => {
            const formattedValues: ProfileData = {
              ...values,
              birthdate: values.birthdate.format('YYYY-MM-DD'),
            };
            console.log("Received values from form: ", formattedValues);
            onPrimaryClick(formattedValues as ProfileFormData);
        });
    };


  return (
    <>
      <Drawer
        title="Update Profile"
        width={720}
        onClose={onClose}
        open={open}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button onClick={onClose}>Cancel</Button>
            <Button onClick={onPrimaryClick_} type="primary" loading={loading}>
              Save
            </Button>
          </Space>
        }
      >
        <Form layout="vertical" form={form} size={'large'} onFinish={onPrimaryClick_} requiredMark={"optional"} initialValues={data!}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="name"
                label="Name"
                rules={[{ required: true, message: 'Please enter project name' }]}
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
            </Col>
            <Col span={12}>
              <Form.Item
                name="email"
                label="Email"
                rules={[{ required: true }]}
              >
                <Input placeholder="Company email"/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col span={12}>
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
            </Col>
            <Col span={12}>
            <Form.Item
                name="birthdate"
                label="Birthdate"
                rules={[{ required: true, message: 'Please select your birthdate!' }]}
            >
                <DatePicker needConfirm/>
            </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="company_name"
                label="Company"
                rules={[{ required: true, message: 'Please select your company!' }]}
            >
                <Select placeholder="Select your company">
                <Option value="Logicbase Interactive">Logicbase Interactive</Option>
                <Option value="MoneyCache">MoneyCache</Option>
                </Select>
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
                name="designation"
                label="Designation"
                rules={[{ required: true, message: 'e.g. Manager, President, Secretary' }]}
            >
                <Input placeholder="Select your designation"/>
            </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
            <Form.Item
                name="contact_number"
                label="Contact Number"
                rules={[{required: true, message: 'Please input your contact number.'},
                {min: 10, max:12, message: 'Invalid contact number'}]}
                hasFeedback
                >
                <Input placeholder='09123456789' />
            </Form.Item>
            </Col>
          </Row>
          {/* <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="approver"
                label="Approver"
                rules={[{ required: true, message: 'Please choose the approver' }]}
              >
                <Select placeholder="Please choose the approver">
                  <Option value="jack">Jack Ma</Option>
                  <Option value="tom">Tom Liu</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="dateTime"
                label="DateTime"
                rules={[{ required: true, message: 'Please choose the dateTime' }]}
              >
                <DatePicker.RangePicker
                  style={{ width: '100%' }}
                  getPopupContainer={(trigger) => trigger.parentElement!}
                />
              </Form.Item>
            </Col>
          </Row> */}
          {/* <Row gutter={16}>
            <Col span={24}>
              <Form.Item
                name="description"
                label="Description"
                rules={[
                  {
                    required: true,
                    message: 'please enter url description',
                  },
                ]}
              >
                <Input.TextArea rows={4} placeholder="please enter url description" />
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      </Drawer>
    </>
  );
};

export default ProfileUpdateDrawerForm;
