import React from "react";

// Note: https://en.parceljs.org/module_resolution.html#glob-file-paths
import images from "../../assets/img/*.png";

type Props = {
  skin: string; // TODO: To enum
  size: string;
};

export const SkinAvatar = ({ skin, size }: Props) => {
  let px = null;

  if (size === "small") px = 100;
  if (size === "medium") px = 200;

  return <img alt={skin} src={images[skin]} width={px} />;
};
