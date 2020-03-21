import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../context";

// interface Values {}

interface FyghterRenamingFormProps {
  visible: boolean;
  // TODO: To use Values type above
  // See more: https://github.com/ant-design/ant-design/issues/21195
  onSave: (values: {}) => void;
  onCancel: () => void;
  name: string;
}

const FyghterRenamingForm: React.FC<FyghterRenamingFormProps> = ({ visible, onCancel, onSave, name }) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Rename fyghter"
      okText="Save"
      onCancel={onCancel}
      onOk={async (): Promise<void> => {
        const values = await form.validateFields();
        form.resetFields();
        onSave(values);
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{
          name,
        }}
      >
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

export const FyghterRenamingModal: React.FC = () => {
  const [isVisible, setVisible] = useState(false);

  const {
    renameMyFyghter,
    setErrorMessage,
    state: { myFyghter },
  } = useFyghtContext();

  const onSave = async ({ name }: { name: string }): Promise<void> => {
    try {
      renameMyFyghter(name);
      setVisible(false);
    } catch (e) {
      setErrorMessage("Unexpected error when creating Fyghter.");
    }
  };

  const isLoading = !myFyghter || !myFyghter.id ? true : false;

  return (
    <div>
      <Button
        type="primary"
        block={true}
        onClick={(): void => {
          setVisible(true);
        }}
        loading={isLoading}
      >
        Rename
      </Button>
      <FyghterRenamingForm
        name={myFyghter.name}
        visible={isVisible}
        onCancel={(): void => {
          setVisible(false);
        }}
        onSave={onSave}
      />
    </div>
  );
};
