/* eslint-disable react/prop-types */
import React, { useContext, useState } from "react";
import { Button, Modal, Form, Radio } from "antd";
import { skins } from "../../helpers";
import { SkinAvatar } from "./SkinAvatar";
import FyghtContext from "../../FyghtContext";

interface Values {
  skin: string;
}

interface FyghterChangeSkinFormProps {
  visible: boolean;
  // TODO: To use Values type above
  onCreate: (values: any) => void;
  onCancel: () => void;
}

const FyghterChangeSkinForm: React.FC<FyghterChangeSkinFormProps> = ({
  visible,
  onCancel,
  onCreate,
}) => {
  const [form] = Form.useForm();

  return (
    <Modal
      visible={visible}
      title="Change skin"
      okText="Save"
      cancelText="Cancel"
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
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        // TODO: Get from state
        initialValues={{ skin: "naked" }}
      >
        <Form.Item name="skin" label="">
          <Radio.Group>
            {skins.map(({ skin }, i: number) => (
              <Radio key={i} value={skin}>
                <SkinAvatar size="small" skin={skin} />
              </Radio>
            ))}
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export const FyghterChangeSkinModal = () => {
  const [isVisible, setVisible] = useState(false);

  //const { dispatch } = useContext(FyghtContext);

  const onSave = (values: any) => {
    console.log("Received values of form: ", values);
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
        Change skin
      </Button>
      <FyghterChangeSkinForm
        visible={isVisible}
        onCancel={() => {
          setVisible(false);
        }}
        onCreate={onSave}
      />
    </div>
  );
};
