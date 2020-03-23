import React, { useState } from "react";
import { Button } from "antd";
import { useFyghtState } from "../../../state";
import { ChangeSkinForm } from "./ChangeSkinForm";

type Props = {
  isLoading: boolean;
};

export const ChangeSkinButton: React.FC<Props> = ({ isLoading }: Props) => {
  const [isVisible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const [, { changeMyFyghterSkin }] = useFyghtState();

  const onSave = async ({ skin }: { skin: string }): Promise<void> => {
    changeMyFyghterSkin(skin);
    setVisible(false);
  };

  return (
    <div>
      <Button
        type="primary"
        block={true}
        onClick={(): void => {
          setVisible(true);
        }}
        loading={isLoading}
      >
        Change skin
      </Button>
      <ChangeSkinForm
        visible={isVisible}
        onCancel={(): void => {
          setVisible(false);
          setErrorMessage(null);
        }}
        onSave={onSave}
        errorMessage={errorMessage}
      />
    </div>
  );
};
