import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../context";

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

export const FyghterCreationModal: React.FC = () => {
  const [isVisible, setVisible] = useState(false);

  const { createFyghter, setErrorMessage } = useFyghtContext();

  const onCreate = async ({ name }: { name: string }): Promise<void> => {
    try {
      createFyghter(name);
      setVisible(false);
    } catch (e) {
      setErrorMessage("Unexpected error when creating Fyghter.");
    }
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
        onCreate={onCreate}
      />
    </div>
  );
};
