import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useFyghtContext } from "../../store";

// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import gifs from "../../assets/img/*.gif";
import { BigNumber } from "ethers";

interface ChallengeViewProps {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const ChallengeView: React.FC<ChallengeViewProps> = ({ visible, onCancel, onOk }) => {
  return (
    <Modal width={370} visible={visible} title="Attacking in progress..." okText="OK" onCancel={onCancel} onOk={onOk}>
      <img alt="loading..." src={gifs["loading"]} width={320} />
    </Modal>
  );
};

type Props = {
  enemyId: BigNumber;
};

export const ChallengeModal: React.FC<Props> = ({ enemyId }: Props) => {
  const [isVisible, setVisible] = useState(false);

  const { challengeAnEnemy } = useFyghtContext();

  // TODO: Review UX interaction
  const onAttack = async (): void => {
    setVisible(true);
    await challengeAnEnemy(enemyId);
    setVisible(false);
  };

  return (
    <div>
      <Button type="primary" block={true} onClick={onAttack}>
        Challenge!
      </Button>
      <ChallengeView
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
