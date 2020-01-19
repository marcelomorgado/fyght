import React from "react";
// import skinImage from "../../assets/img/naked.png";

type Props = {
  fygher: {
    id: number;
    skin: string;
    name: string;
    xp: number;
    qi: number;
    winCount: number;
    lossCount: number;
  };
};

export const MyFyghter = ({
  fygher: { skin, name, xp, qi, winCount, lossCount },
}: Props) => {
  const skinImage = "../../assets/img/${skin}.png";

  return (
    <div className="card fighter-id-fighterId">
      <div className="card-header ">
        <button
          className="btn-clipboard btnRename"
          title=""
          data-original-title=""
        >
          <img src="../../assets/img/pencil.png" />
        </button>
        <button
          className="btn-clipboard btnChangeSkin"
          title=""
          data-original-title=""
        >
          <img src="../../assets/img/no_one.png" />
        </button>
      </div>
      <img className="card-img-top" src={skinImage} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h6 className="card-subtitle mb-2 text-muted">
          XP: {xp} / Qi: {qi}
        </h6>
        <p className="card-text">
          {winCount} wins / {lossCount} losses
        </p>
        <p></p>
      </div>
    </div>
  );
};

export default MyFyghter;
