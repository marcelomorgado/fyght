function fighterToObject(fighter) {
  const fighterObj = {
    id: fighter[0].toNumber(),
    name: fighter[1].toString(),
    skin: fighter[2].toString(),
    xp: fighter[3].toNumber(),
  };

  return fighterObj;
}

function getPossibleSkins(xp, qi) {
  if (xp < 10) return ["naked"];
  if (xp >= 10 && xp < 15) return ["normal_guy"];
  if (xp >= 15 && xp < 25) return ["karate_kid"];
  if (xp >= 25 && xp < 40) return ["japonese"];
  if (xp >= 40 && xp < 50) return ["monk"];
  if (xp >= 50 && xp < 80) return ["ninja"];
  if (xp >= 80 && qi < 100) {
    return ["naked", "normal_guy", "karate_kid", "japonese", "monk", "ninja", "no_one", "daemon"];
  }
  if (xp >= 100 && qi >= 100) {
    return ["naked", "normal_guy", "karate_kid", "japonese", "monk", "ninja", "no_one", "daemon", "master"];
  }
  throw Error("Error");
}

module.exports = {
  fighterToObject,
  getPossibleSkins,
};
