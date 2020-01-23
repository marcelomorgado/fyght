import React from "react";
import { Button, Modal, Form, Input } from "antd";

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

export class FyghterRenamingModal extends React.Component {
  state = {
    visible: false,
  };
  formRef: any;

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleCreate = () => {
    const { form } = this.formRef.props;
    form.validateFields((err: Error, values: any) => {
      if (err) {
        return;
      }

      console.log("Received values of form: ", values);
      form.resetFields();
      this.setState({ visible: false });
    });
  };

  saveFormRef = (formRef: any) => {
    this.formRef = formRef;
  };

  render() {
    return (
      <div>
        <Button type="primary" block={true} onClick={this.showModal}>
          Rename
        </Button>
        <FyghterRenamingForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
