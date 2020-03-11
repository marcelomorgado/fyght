/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../store";
import { fyghters } from "../../contracts";
import { ContractTransaction } from "ethers";

interface Values {}

interface FyghterCreationFormProps {
  visible: boolean;
  // TODO: To use Values type above
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const FyghterCreationForm: React.FC<FyghterCreationFormProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
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
          console.log(`values = ${values}`);
          form.resetFields();
          onCreate(values);
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

export const FyghterCreationModal = () => {
  const [isVisible, setVisible] = useState(false);
  const [creationTransaction, setCreationTransaction] = useState(null);

  const { renameMyFyghter } = useFyghtContext();

  const onSave = ({ name }: { name: string }): void => {
    const c = async () => {
      const tx: ContractTransaction = await fyghters.create(name);
      setCreationTransaction(tx);
      setVisible(false);
    };
    c();
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
      <FyghterCreationForm
        visible={isVisible}
        onCancel={() => {
          setVisible(false);
        }}
        onCreate={onSave}
      />
    </div>
  );
};
