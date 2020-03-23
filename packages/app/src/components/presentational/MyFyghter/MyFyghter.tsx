import React from "react";
import { Card } from "antd";
import { RenameFyghterButton } from "../RenameFyghterButton";
import { ChangeSkinButton } from "../ChangeSkinButton";
import { SkinAvatar } from "../SkinAvatar";
import { AvatarSize } from "../../../constants";
import { MyFyghterBalance } from "./MyFyghterBalance";
import { DepositButton } from "../DepositButton";
import { WithdrawAllButton } from "../WithdrawAllButton";

type Props = {
  fyghter: Fyghter;
};

export const MyFyghter: React.FC<Props> = ({ fyghter: { id: fyghterId, skin, name, xp, balance } }: Props) => {
  const isLoading = !fyghterId ? true : false;

  return (
    <Card type="inner" title={name} hoverable={true}>
      <SkinAvatar skin={skin} size={AvatarSize.MEDIUM} />
      <p></p>
      <p>{`XP: ${xp}`}</p>
      <p>
        {`Balance: `}
        <MyFyghterBalance value={balance} />
      </p>
      <RenameFyghterButton isLoading={isLoading} />
      <p></p>
      <ChangeSkinButton isLoading={isLoading} />
      <p></p>
      <DepositButton fyghterId={fyghterId} isLoading={isLoading} />
      <p></p>
      <WithdrawAllButton fyghterId={fyghterId} isLoading={isLoading} />
    </Card>
  );
};
