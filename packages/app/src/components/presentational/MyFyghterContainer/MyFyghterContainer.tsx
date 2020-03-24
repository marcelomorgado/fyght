import React, { useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";
import { MyFyghter } from "../MyFyghter";
import { useFyghtState } from "../../../state";
import { CreateFyghterButton } from "../CreateFyghterButton";

export const MyFyghterContainer: React.FC = () => {
  const [isLoading, setLoading] = useState(true);

  const [
    {
      myFyghter,
      metamask: { account, networkId },
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
  }, [account, networkId]);

  const hasFyghter = !isLoading && myFyghter !== null;

  return (
    <>
      <Divider orientation="left" style={{ color: "#333", fontWeight: "normal" }}>
        My Fyghter
      </Divider>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          {isLoading ? <>{`Loading...`}</> : !hasFyghter ? <CreateFyghterButton /> : <MyFyghter fyghter={myFyghter} />}
        </Col>
      </Row>
    </>
  );
};
