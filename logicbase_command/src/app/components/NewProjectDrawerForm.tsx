import React from 'react';
import type { Dayjs } from 'dayjs';
import { Button, Col, DatePicker, Drawer, Form, Input, Row, Select, Space } from 'antd';
const { RangePicker } = DatePicker;
const { Option } = Select;
interface ProjectFormValues {
    project_name: string,
    project_details: string,
    project_link: string,
    project_duration: [Dayjs, Dayjs],
    project_type: string,
}
interface NewProjectDrawerFormProps {
    open: boolean;
    loading: boolean;
    onClose: () => void;
    onPrimaryClick: (values:ProjectFormValues) => void;
};

const ProjectDrawerForm: React.FC<NewProjectDrawerFormProps> = ({open, loading, onClose, onPrimaryClick}) => {
    const [form] = Form.useForm();
    const onPrimaryClick_ = () => {
        // onPrimaryClick(values)
        form.validateFields().then((values) => {
          const [start, end] = values.project_duration;
            const formattedValues: ProjectFormValues = {
              ...values,
              project_duration: [
                start.format('YYYY-MM-DD'),
                end.format('YYYY-MM-DD'),
              ],
            };
            console.log("Received valuse from form: ", formattedValues);
            onPrimaryClick(formattedValues as ProjectFormValues);
        });
    };


  return (
    <>
      <Drawer
        title="Create a new project"
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
        <Form layout="vertical" form={form} size={'large'} onFinish={onPrimaryClick_} requiredMark={"optional"}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="project_name"
                label="Project Name"
                rules={[{ required: true, message: 'Please enter project name' }]}
              >
                <Input placeholder="Please enter project name" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="project_duration"
                label="Project Duration"
                rules={[{ required: true, message: 'Please set the project duration' }]}
              >
                <RangePicker style={{ width: '100%' }} needConfirm/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
          <Col span={12}>
              <Form.Item
                name="project_type"
                label="Type"
                rules={[{ required: true, message: 'Please choose the type' }]}
              >
                <Select placeholder="Please choose the type">
                  <Option value="Private">Private</Option>
                  <Option value="Public">Public</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="project_link"
                label="Repository Link"
              >
                <Input placeholder="Please enter project link" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
                <Form.Item
                    name="project_details"
                    label="Details"
                    rules={[
                    {
                        required: true,
                        message: 'Please enter project description',
                    },
                    ]}
                >
                <Input.TextArea rows={4} placeholder="Please enter project details" />
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

export default ProjectDrawerForm;