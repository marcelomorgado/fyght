import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../store";

// interface Values {}

interface FyghterCreationFormProps {
  visible: boolean;
  // TODO: To use Values type above
  // See more: https://github.com/ant-design/ant-design/issues/21195
  onCreate: (values: {}) => void;
  onCancel: () => void;
}

const FyghterCreationForm: React.FC<FyghterCreationFormProps> = ({ visible, onCancel, onCreate }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a fyghter"
      okText="Save"
      onCancel={onCancel}
      onOk={async (): Promise<void> => {
        try {
          const values = await form.validateFields();
          form.resetFields();
          onCreate(values);
        } catch (e) {
          // TODO: Handle error
        }
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

export const FyghterCreationModal: React.FC = () => {
  const [isVisible, setVisible] = useState(false);

  const { createFyghter } = useFyghtContext();

  const onSave = async ({ name }: { name: string }): Promise<void> => {
    createFyghter(name);
    setVisible(false);
  };

  return (
    <div>
      {`You have to create your fyghter!`}
      <Button
        type="primary"
        block={true}
        onClick={(): void => {
          setVisible(true);
        }}
      >
        Create
      </Button>
      <FyghterCreationForm
        visible={isVisible}
        onCancel={(): void => {
          setVisible(false);
        }}
        onCreate={onSave}
      />
    </div>
  );
};
