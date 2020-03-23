import React from "react";
import { Modal, Form, Input } from "antd";

// interface Values {}

interface Props {
  visible: boolean;
  // TODO: To use Values type above
  // See more: https://github.com/ant-design/ant-design/issues/21195
  onCreate: (values: {}) => void;
  onCancel: () => void;
}

export const CreateFyghterForm: React.FC<Props> = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a fyghter"
      okText="Save"
      onCancel={onCancel}
      onOk={async (): Promise<void> => {
        const values = await form.validateFields();
        form.resetFields();
        onCreate(values);
      }}
    >
      <Form form={form} layout="vertical" name="form_in_modal">
        <Form.Item
          name="name"
          label="Name"
          rules={[
            {
              required: true,
              message: "Please input the name of the fyghter!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};
