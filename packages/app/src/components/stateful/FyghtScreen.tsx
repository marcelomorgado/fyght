import React from "react";
import MyFyghter from "../presentational/MyFyghter";

export const FyghtScreen = () => {
  return (
    <div>
      <MyFyghter
        fygher={{
          id: 1,
          name: "Marcelo",
          skin: "naked",
          xp: 1,
          qi: 2,
          winCount: 3,
          lossCount: 4,
        }}
      />
    </div>
  );
};

export default FyghtScreen;
