import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useFyghtContext } from "../../store";

// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import gifs from "../../assets/img/*.gif";
import { BigNumber } from "ethers/utils";

interface EnamyAttackViewProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const EnamyAttackView: React.FC<EnamyAttackViewProps> = ({
  visible,
  onCancel,
  onOk,
}) => {
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
};

type Props = {
  enemyId: BigNumber;
};

export const AttackModal: React.FC<Props> = ({ enemyId }: Props) => {
  const [isVisible, setVisible] = useState(false);

  const { attackAnEnemy } = useFyghtContext();

  // TODO: Review UX interaction
  const onAttack = (): void => {
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
        onCancel={(): void => {
          setVisible(false);
        }}
        onOk={(): void => {
          setVisible(false);
        }}
      />
    </div>
  );
};
