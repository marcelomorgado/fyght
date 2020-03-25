import React, { useState } from "react";
import { Button } from "antd";
import { useFyghtState } from "../../../state";
import { CreateFyghterForm } from "../CreateFyghterForm";

type Props = {
  disabled: boolean;
};

export const CreateFyghterButton: React.FC<Props> = ({ disabled }: Props) => {
  const [isVisible, setVisible] = useState(false);

  const [, { createFyghter }] = useFyghtState();

  const onCreate = async ({ name }: { name: string }): Promise<void> => {
    createFyghter(name);
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
        disabled={disabled}
      >
        Create
      </Button>
      <CreateFyghterForm
        visible={isVisible}
        onCancel={(): void => {
          setVisible(false);
        }}
        onCreate={onCreate}
      />
    </div>
  );
};
