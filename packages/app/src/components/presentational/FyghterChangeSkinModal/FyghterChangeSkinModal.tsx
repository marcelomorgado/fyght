import React, { useState } from "react";
import { Button, Modal, Form, Radio, Row, Alert } from "antd";
import { skins } from "../../../helpers";
import { SkinAvatar } from "../SkinAvatar";
import { useFyghtState } from "../../../state";
import { AvatarSize } from "../../../constants";

// interface Values {
//   skin: string;
// }

interface FyghterChangeSkinFormProps {
  visible: boolean;
  // TODO: To use Values type above
  // See more: https://github.com/ant-design/ant-design/issues/21195
  onSave: (values: {}) => void;
  onCancel: () => void;
  errorMessage: string;
}

const FyghterChangeSkinForm: React.FC<FyghterChangeSkinFormProps> = ({ visible, onCancel, onSave, errorMessage }) => {
  const [form] = Form.useForm();
  const [
    {
      myFyghter: { skin: currentSkin },
    },
  ] = useFyghtState();

  return (
    <Modal
      visible={visible}
      title="Change skin"
      okText="Save"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={async (): Promise<void> => {
        const values = await form.validateFields();
        form.resetFields();
        onSave(values);
      }}
    >
      {errorMessage ? <Alert message={errorMessage} type="error" /> : <></>}
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ skin: currentSkin }}
        style={{ marginTop: 30 }}
      >
        <Form.Item name="skin" label="">
          <Radio.Group>
            <Row gutter={[16, 24]} justify="center">
              {skins.map(({ skin }, i: number) => (
                <Radio key={i} value={skin}>
                  <SkinAvatar size={AvatarSize.SMALL} skin={skin} />
                </Radio>
              ))}
            </Row>
          </Radio.Group>
        </Form.Item>
      </Form>
    </Modal>
  );
};

type Props = {
  isLoading: boolean;
};

// TODO: Rename component
export const FyghterChangeSkinModal: React.FC<Props> = ({ isLoading }: Props) => {
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
      <FyghterChangeSkinForm
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