import React from "react";
// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import images from "../../assets/img/*.png";
import { AvatarSize } from "../../constants";

type Props = {
  skin: string;
  size: string;
};

export const SkinAvatar = ({ skin, size }: Props) => {
  let px = null;

  if (size === AvatarSize.SMALL) px = 100;
  if (size === AvatarSize.MEDIUM) px = 160;

  return <img alt={skin} src={images[skin]} width={px} />;
};
