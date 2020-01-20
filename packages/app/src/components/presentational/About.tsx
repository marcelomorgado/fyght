import React from "react";
import { Card } from "antd";

export const About = () => {
  return (
    <Card hoverable type="inner" title="About & Rules">
      <p>Your journey to became a master starts now.</p>
      <p>
        Train with your master and challenge another players to see who is the
        best.
      </p>
      <p>After each victory, your fighter gains +1 XP and become stronger.</p>
    </Card>
  );
};

export default About;
