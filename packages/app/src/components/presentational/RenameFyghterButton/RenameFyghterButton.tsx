import React, { useState } from "react";
import { Button } from "antd";
import { useFyghtState } from "../../../state";
import { RenameFyghterForm } from "../RenameFyghterForm";

type Props = {
  isLoading: boolean;
};

export const RenameFyghterButton: React.FC<Props> = ({ isLoading }: Props) => {
  const [isVisible, setVisible] = useState(false);

  const [{ myFyghter }, { renameMyFyghter }] = useFyghtState();

  const onSave = async ({ name }: { name: string }): Promise<void> => {
    renameMyFyghter(name);
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
        Rename
      </Button>
      <RenameFyghterForm
        name={myFyghter.name}
        visible={isVisible}
        onCancel={(): void => {
          setVisible(false);
        }}
        onSave={onSave}
      />
    </div>
  );
};
