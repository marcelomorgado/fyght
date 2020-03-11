/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../store";
import { ContractTransaction } from "ethers";

interface Values {}

interface FyghterRenamingFormProps {
  visible: boolean;
  // TODO: To use Values type above
  onSave: (values: any) => void;
  onCancel: () => void;
}

const FyghterRenamingForm: React.FC<FyghterRenamingFormProps> = ({
  visible,
  onCancel,
  // TODO: Rename to onRenaming
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

  const {
    renameMyFyghter,
    state: {
      myFyghter: { id: myFyghterId },
      metamask: { contract: fyghters },
    },
  } = useFyghtContext();

  const onSave = async ({ name }: { name: string }): Promise<void> => {
    try {
      const tx: ContractTransaction = await fyghters.rename(myFyghterId, name);
      await tx.wait();

      // TODO: Wait for event to update store
      renameMyFyghter(name);
    } catch (e) {
      console.log(e);
    } finally {
      setVisible(false);
    }
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
        onSave={onSave}
      />
    </div>
  );
};
