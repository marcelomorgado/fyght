import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../store";

// interface Values {}

interface FyghterRenamingFormProps {
  visible: boolean;
  // TODO: To use Values type above
  // See more: https://github.com/ant-design/ant-design/issues/21195
  onSave: (values: any) => void;
  onCancel: () => void;
}

const FyghterRenamingForm: React.FC<FyghterRenamingFormProps> = ({
  visible,
  onCancel,
  onSave,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Rename fyghter"
      okText="Save"
      onCancel={onCancel}
      onOk={async (): Promise<void> => {
        try {
          const values = await form.validateFields();
          form.resetFields();
          onSave(values);
        } catch (info) {
          console.log("Validate Failed:", info);
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

export const FyghterRenamingModal = () => {
  const [isVisible, setVisible] = useState(false);

  const { renameMyFyghter } = useFyghtContext();

  const onSave = async ({ name }: { name: string }): Promise<void> => {
    renameMyFyghter(name);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        block={true}
        onClick={(): void => {
          setVisible(true);
        }}
      >
        Rename
      </Button>
      <FyghterRenamingForm
        visible={isVisible}
        onCancel={(): void => {
          setVisible(false);
        }}
        onSave={onSave}
      />
    </div>
  );
};
