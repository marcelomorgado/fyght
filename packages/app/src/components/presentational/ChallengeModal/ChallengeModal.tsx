import React, { useState } from "react";
import { Button, Modal } from "antd";
import { useFyghtState } from "../../../state";

// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import gifs from "../../assets/img/*.gif";
import { BigNumber } from "ethers/utils";

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
  disabled: boolean;
};

export const ChallengeModal: React.FC<Props> = ({ enemyId, disabled }: Props) => {
  const [isVisible, setVisible] = useState(false);
  const [challengeRunning, setChallengeRunning] = useState(false);

  const [{ myFyghter }, { challengeAnEnemy }] = useFyghtState();

  const onAttack = (): void => {
    // setVisible(true);
    setChallengeRunning(true);
    challengeAnEnemy(enemyId, () => {
      // setVisible(false);
      setChallengeRunning(false);
    });
  };

  const buttonDisabled = disabled || !myFyghter || !myFyghter.id;

  return (
    <div>
      <Button
        type="primary"
        block={true}
        onClick={onAttack}
        loading={challengeRunning ? true : false}
        disabled={buttonDisabled}
      >
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
