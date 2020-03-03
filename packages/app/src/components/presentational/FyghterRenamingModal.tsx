import React, { useContext, useState } from "react";
import { Button, Modal, Form, Input } from "antd";
import FyghtContext from "../../FyghtContext";

// TODO: To use the correct type
// See more: https://github.com/ant-design/ant-design/issues/19773#issuecomment-562487419
const FyghterRenamingForm: any = Form.create({ name: "form_in_modal" })(
  class extends React.Component<any> {
    render() {
      const { visible, onCancel, onCreate, form } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Rename fyghter"
          okText="Save"
          onCancel={onCancel}
          onOk={onCreate}
        >
          <Form layout="vertical">
            <Form.Item label="Name">
              {getFieldDecorator("name", {
                rules: [
                  {
                    required: true,
                    message: "Please input the name of the fyghter!",
                  },
                ],
              })(<Input />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

export const FyghterRenamingModal = () => {
  const [isVisible, setVisible] = useState(false);
  const [formRef, setFormRef] = useState(null);
  const { dispatch } = useContext(FyghtContext);

  const showModal = () => {
    setVisible(true);
  };

  const handleCancel = () => {
    setVisible(false);
  };

  const handleCreate = () => {
    const { form } = formRef.props;
    form.validateFields((err: Error, values: any) => {
      if (err) {
        return;
      }

      const { name } = values;

      dispatch({ type: "RENAME", payload: { name } });

      form.resetFields();
      setVisible(false);
    });
  };

  const saveFormRef = (formRef: any) => {
    setFormRef(formRef);
  };

  return (
    <div>
      <Button type="primary" block={true} onClick={showModal}>
        Rename
      </Button>
      <FyghterRenamingForm
        wrappedComponentRef={saveFormRef}
        visible={isVisible}
        onCancel={handleCancel}
        onCreate={handleCreate}
      />
    </div>
  );
};
