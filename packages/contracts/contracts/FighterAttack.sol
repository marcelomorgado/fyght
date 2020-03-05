pragma solidity 0.6.1;

import "./FighterHelper.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract FighterAttack is FighterHelper, ERC721 {
    uint256 randNonce = 0;

    event Attack(uint256 attackerId, uint256 targetId, uint256 winnerId);

    function randMod(uint256 _modulus) internal returns (uint256) {
        randNonce++;
        return uint256(keccak256(abi.encodePacked(now, msg.sender, randNonce))) % _modulus;
    }

    function calculateAttackerProbability(uint256 _fighterId, uint256 _targetId) external view returns (uint256) {
        return _calculateAttackerProbability(_fighterId, _targetId);
    }

    function _calculateAttackerProbability(uint256 _fighterId, uint256 _targetId) internal view returns (uint256) {
        Fighter memory attacker = fighters[_fighterId];
        Fighter memory target = fighters[_targetId];

        uint256 aPoints = (attacker.xp * 3 + attacker.qi * 2) / 5;
        uint256 tPoints = (target.xp * 3 + target.qi * 2) / 5;

        return ((aPoints * 100) / (aPoints + tPoints)) + 5;
    }

    function attack(uint256 _fighterId, uint256 _targetId) external onlyOwnerOf(_fighterId) {
        Fighter storage myFighter = fighters[_fighterId];
        Fighter storage enemyFighter = fighters[_targetId];
        uint256 rand = randMod(100);
        uint256 attackVictoryProbability = _calculateAttackerProbability(_fighterId, _targetId);
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
