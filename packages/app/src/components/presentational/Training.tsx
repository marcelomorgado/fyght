import React from "react";
import { Card, Button } from "antd";
import masterImage from "../../assets/img/master.png";

const { Meta } = Card;

type Props = {
  trainingCost: number;
};

export const Training = ({ trainingCost }: Props) => {
  return (
    <Card
      hoverable
      type="inner"
      cover={<img alt="example" src={masterImage} />}
      title="Train w/ Master"
    >
      <Meta
        style={{ textAlign: "center" }}
        title="Improve your Qi!"
        description=""
      />
      <p></p>
      <Button block={true} type="primary">
        +1 Qi &#926; {`${trainingCost}`}
      </Button>
    </Card>
  );
};

export default Training;
