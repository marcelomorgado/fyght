pragma solidity 0.6.2;

import "../Fyghters.sol";

contract FyghtersMock is Fyghters {
    constructor(Dai _dai) public Fyghters(_dai) {}

    function deterministicChallenge(uint256 _myFyghterId, uint256 _enemyId, uint256 _winnerId, uint256 _winProbability)
        external
    {
        processChallengeResult(_myFyghterId, _enemyId, _winnerId, _winProbability);
    }

    // TODO: Move to updateXp
    function changeFyghterXp(uint256 _fyghterId, uint256 _xp) public {
        fyghters[_fyghterId].xp = _xp;
    }

    // TODO: Move to updateBalance
    function changeFyghterBalance(uint256 _fyghterId, uint256 _balance) public {
        fyghters[_fyghterId].balance = _balance;
    }
}
