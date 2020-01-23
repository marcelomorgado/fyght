import React from "react";
import { Button, Modal, Form, Radio } from "antd";
import { skins } from "../../helpers";
import { SkinAvatar } from "./SkinAvatar";

const FyghterChangeSkinForm = Form.create({ name: "form_in_modal" })(
  class extends React.Component<any> {
    render() {
      const { visible, onCancel, onCreate, onChange } = this.props;
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
              <Radio.Group onChange={() => {}} value={undefined}>
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
    }
  }
);

export default class FyghterChangeSkinModal extends React.Component {
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
          Change skin
        </Button>
        <FyghterChangeSkinForm
          wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onCreate={this.handleCreate}
        />
      </div>
    );
  }
}
