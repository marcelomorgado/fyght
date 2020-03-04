import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useFyghtContext } from "../../FyghtContext";

// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import gifs from "../../assets/img/*.gif";

const EnamyAttackView: any = class extends React.Component<any> {
  render() {
    const { visible, onCancel, onOk } = this.props;
    return (
      <Modal
        width={370}
        visible={visible}
        title="Attacking in progress..."
        okText="OK"
        onCancel={onCancel}
        onOk={onOk}
      >
        <img alt="loading..." src={gifs["loading"]} width={320} />
      </Modal>
    );
  }
};

type Props = {
  enemyId: number;
};

export const AttackModal = ({ enemyId }: Props) => {
  const [isVisible, setVisible] = useState(false);

  const { attackAnEnemy } = useFyghtContext();

  const onAttack = () => {
    setVisible(true);
    const secondsToGo = 2;
    setTimeout(() => {
      attackAnEnemy(enemyId);
      setVisible(false);
    }, secondsToGo * 1000);
  };

  return (
    <div>
      <Button type="primary" block={true} onClick={onAttack}>
        Attack
      </Button>
      <EnamyAttackView
        visible={isVisible}
        onCancel={() => {
          setVisible(false);
        }}
        onOk={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};
