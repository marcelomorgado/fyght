/* eslint-disable react/prop-types */
import React, { useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import { useFyghtContext } from "../../store";
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

  const {
    state: {
      metamask: { contract: fyghters },
    },
    setMyFyghter,
  } = useFyghtContext();

  const onSave = async ({ name }: { name: string }): Promise<void> => {
    try {
      const tx: ContractTransaction = await fyghters.create(name);
      await tx.wait();

      // TODO: Get event from transaction
      const filter = fyghters.filters.NewFyghter(null, null, null);
      fyghters.on(filter, async (owner: string, id: number, name: string) => {
        const myFyghter = await fyghters.fyghters(id);
        console.log(myFyghter);
        setMyFyghter(myFyghter);
      });
    } catch (e) {
      console.log(e);
      // Revert message
      //console.log(e.data.message);
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
        Create
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