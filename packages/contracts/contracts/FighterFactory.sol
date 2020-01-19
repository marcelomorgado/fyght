pragma solidity 0.5.16;

import "./Ownable.sol";
import "./SafeMath.sol";

contract FighterFactory is Ownable {

  using SafeMath for uint256;

  event NewFighter(uint fighterId, string name);

  struct Fighter {
    uint id;
    string name;
    string skin;
    uint32 xp;
    uint32 qi;
    uint16 winCount;
    uint16 lossCount;
  }

  Fighter[] public fighters;

  mapping (uint => address) public fighterToOwner;
  mapping (address => uint) ownerFighterCount;

  function createFighter(string memory _name) public {
    require(ownerFighterCount[msg.sender] == 0);
    uint id = fighters.length;
    fighters.push(Fighter(id, _name, 'naked', 1, 1, 0, 0));
    fighterToOwner[id] = msg.sender;
    ownerFighterCount[msg.sender]++;
    emit NewFighter(id, _name);
  }

}
