import React from "react";
import { Button, Modal } from "antd";

const EnamyAttackView: any = class extends React.Component<any> {
  render() {
    const { visible, onCancel, onOk } = this.props;
    return (
      <Modal
        visible={visible}
        title="Attack an enemy"
        okText="OK"
        onCancel={onCancel}
        onOk={onOk}
      >
        <p>attacking...</p>
      </Modal>
    );
  }
};

export class AttackModal extends React.Component {
  state = {
    visible: false,
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  handleOk = () => {
    this.setState({ visible: false });
  };

  render() {
    return (
      <div>
        <Button type="primary" block={true} onClick={this.showModal}>
          Attack
        </Button>
        <EnamyAttackView
          visible={this.state.visible}
          onCancel={this.handleCancel}
          onOk={this.handleOk}
        />
      </div>
    );
  }
}
