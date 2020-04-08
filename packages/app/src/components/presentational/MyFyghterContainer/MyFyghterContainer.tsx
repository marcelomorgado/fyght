import React, { useEffect, useState } from "react";
import { Row, Col, Divider, Alert } from "antd";
import { MyFyghter } from "../MyFyghter";
import { useFyghtState } from "../../../state";
import { CreateFyghterButton } from "../CreateFyghterButton";

export const MyFyghterContainer: React.FC = () => {
  const [isLoading, setLoading] = useState(true);

  const [
    {
      myFyghter,
      metamask: { account, networkId, provider },
    },
    { fetchMyFyghter },
  ] = useFyghtState();

  useEffect(() => {
    const init = async (): Promise<void> => {
      fetchMyFyghter();
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, networkId, provider]);

  const hasFyghter = !isLoading && myFyghter !== null;

  let warningMessage = null;
  if (!account) {
    warningMessage = "You have to sign in first!";
  } else if (!hasFyghter) {
    warningMessage = "You have to create your fyghter!";
  }

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        My Fyghter
      </Divider>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          {isLoading ? (
            <>{`Loading...`}</>
          ) : !hasFyghter ? (
            <CreateFyghterButton disabled={!account} />
          ) : (
            <MyFyghter fyghter={myFyghter} />
          )}
          {warningMessage ? (
            <>
              <p></p>
              <Alert message={warningMessage} type="warning" />
            </>
          ) : (
            <></>
          )}
        </Col>
      </Row>
    </>
  );
};
