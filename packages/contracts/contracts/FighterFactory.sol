pragma solidity 0.6.1;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract FighterFactory {
    using SafeMath for uint256;

    event NewFighter(uint256 fighterId, string name);

    struct Fighter {
        uint256 id;
        string name;
        string skin;
        uint32 xp;
        uint32 qi;
        uint16 winCount;
        uint16 lossCount;
    }

    Fighter[] public fighters;

    mapping(uint256 => address) public fighterToOwner;
    mapping(address => uint256) ownerFighterCount;

    function createFighter(string memory _name) public {
        require(ownerFighterCount[msg.sender] == 0);
        uint256 id = fighters.length;
        fighters.push(Fighter(id, _name, "naked", 1, 1, 0, 0));
        fighterToOwner[id] = msg.sender;
        ownerFighterCount[msg.sender]++;
        emit NewFighter(id, _name);
    }

}
