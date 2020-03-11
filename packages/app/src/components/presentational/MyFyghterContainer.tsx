import React, { useEffect, useState } from "react";
import { Row, Col, Divider } from "antd";
import { MyFyghter } from "./MyFyghter";
import { useFyghtContext } from "../../store";
import { FyghterCreationModal } from "./FyghterCreationModal";

export const MyFyghterContainer = () => {
  const [isLoading, setLoading] = useState(true);

  const {
    state: { myFyghter },
    loadMyFyghter,
  } = useFyghtContext();

  useEffect(() => {
    const init = async () => {
      loadMyFyghter();
      setLoading(false);
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // TODO: Move down
  if (isLoading) {
    return <>{`Loading...`}</>;
  }

  return (
    <>
      <Divider
        orientation="left"
        style={{ color: "#333", fontWeight: "normal" }}
      >
        My Fyghter
      </Divider>
      <Row gutter={[16, 24]}>
        <Col span={24}>
          {myFyghter === null ? (
            <>
              {`You have to create your fyghter!`}
              <FyghterCreationModal />
            </>
          ) : (
            <MyFyghter fyghter={myFyghter} />
          )}
        </Col>
      </Row>
    </>
  );
};
