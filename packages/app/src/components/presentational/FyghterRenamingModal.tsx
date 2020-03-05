/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../FyghtContext";

interface Values {}

interface FyghterRenamingFormProps {
  visible: boolean;
  // TODO: To use Values type above
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const FyghterRenamingForm: React.FC<FyghterRenamingFormProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Rename fyghter"
      okText="Save"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then(values => {
            form.resetFields();
            onCreate(values);
          })
          .catch(info => {
            console.log("Validate Failed:", info);
          });
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

  const onSave = ({ name }: { name: string }) => {
    renameMyFyghter(name);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        block={true}
        onClick={() => {
          setVisible(true);
        }}
      >
        Rename
      </Button>
      <FyghterRenamingForm
        visible={isVisible}
        onCancel={() => {
          setVisible(false);
        }}
        onCreate={onSave}
      />
    </div>
  );
};
