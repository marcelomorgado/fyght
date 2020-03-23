import React, { useState } from "react";
import { Button } from "antd";
import { useFyghtState } from "../../../state";
import { CreateFyghterForm } from "./CreateFyghterForm";

export const CreateFyghterButton: React.FC = () => {
  const [isVisible, setVisible] = useState(false);

  const [, { createFyghter }] = useFyghtState();

  const onCreate = async ({ name }: { name: string }): Promise<void> => {
    createFyghter(name);
    setVisible(false);
  };

  return (
    <div>
      {`You have to create your fyghter!`}
      <Button
        type="primary"
        block={true}
        onClick={(): void => {
          setVisible(true);
        }}
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
