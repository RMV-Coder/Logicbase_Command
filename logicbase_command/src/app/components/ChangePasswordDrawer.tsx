

import React from 'react';
import { Button, Col, Drawer, Form, Input, Row } from 'antd';

interface PassFormData {
    current_password: string;
    new_password: string;
    confirm_new_password: string;
}
interface ProfileUpdateDrawerFormProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onPrimaryClick: (values:PassFormData) => void;
};

const ChangePasswordDrawer: React.FC<ProfileUpdateDrawerFormProps> = ({open, loading, onClose, onPrimaryClick}) => {
    const [form] = Form.useForm();

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
        // extra={
        //   <Space>
        //     <Button onClick={onClose}>Cancel</Button>
        //   </Space>
        // }
      >
        <Form layout="vertical" form={form} size={'large'} onFinish={onPrimaryClick} requiredMark={"optional"}>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="current_password"
                        label="Current Password"
                        rules={[{ required: true, message: 'Please enter your current password' }]}
                    >
                        <Input.Password/>
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="new_password"
                        label="New Password"
                        rules={[{required: true, message: 'Please input your new password!',},
                        {min: 6, message: 'Password must be at least 6 characters long!'}]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="confirm_new"
                        label="Confirm New Password"
                        dependencies={['new_password']}
                        hasFeedback
                        rules={[{required: true, message: 'Please confirm your new password!',},
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                            if (!value || getFieldValue('new_password') === value) {
                                return Promise.resolve();
                            }
                            return Promise.reject(new Error('The new password that you entered do not match!'));
                            },
                        }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>
                </Col>
            </Row>
            <Row gutter={16}>
                <Col span={24}>
                    <Form.Item
                        name="submit"
                        label={null}
                    >
                        <Button type='primary' htmlType="submit" loading={loading}>Update Password</Button>
                    </Form.Item>
                </Col>
            </Row>
        </Form>
      </Drawer>
    </>
  );
};

export default ChangePasswordDrawer;
