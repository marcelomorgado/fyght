pragma solidity ^0.4.24;

import "./FighterHelper.sol";

contract FighterAttack is FighterHelper {
  uint randNonce = 0;

  event Attack(uint attackerId, uint targetId, uint winnerId);

  function randMod(uint _modulus) internal returns(uint) {
    randNonce++;
    return uint(keccak256(now, msg.sender, randNonce)) % _modulus;
  }

  function calculateAttackerProbability(uint _fighterId, uint _targetId) external view returns (uint) {
    return _calculateAttackerProbability(_fighterId, _targetId);
  }

  function _calculateAttackerProbability(uint _fighterId, uint _targetId) internal view returns (uint) {
    Fighter attacker = fighters[_fighterId];
    Fighter target = fighters[_targetId];

    uint aPoints = (attacker.xp*3 + attacker.qi*2)/5;
    uint tPoints = (target.xp*3 + target.qi*2)/5;

    return (aPoints*100/(aPoints+tPoints))+5;
  }

  function attack(uint _fighterId, uint _targetId) external onlyOwnerOf(_fighterId) {
    Fighter storage myFighter = fighters[_fighterId];
    Fighter storage enemyFighter = fighters[_targetId];
    uint rand = randMod(100);
    uint attackVictoryProbability = _calculateAttackerProbability(_fighterId, _targetId);
    if (rand <= attackVictoryProbability) {
      myFighter.winCount++;
      myFighter.xp++;
      enemyFighter.lossCount++;
      _checkForSkinUpdate(_fighterId);
      emit Attack(_fighterId, _targetId, _fighterId);
    } else {
      myFighter.lossCount++;
      enemyFighter.winCount++;
      enemyFighter.xp++;
      _checkForSkinUpdate(_targetId);
      emit Attack(_fighterId, _targetId, _targetId);
    }
  }
}
