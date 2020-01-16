pragma solidity 0.5.12;

import "./FighterFactory.sol";

contract FighterHelper is FighterFactory {

  uint public trainingFee = 0.005 ether;

  modifier onlyOwnerOf(uint _fighterId) {
    require(msg.sender == fighterToOwner[_fighterId]);
    _;
  }

  function withdraw() external onlyOwner {
    owner.transfer(address(this).balance);
  }

  function _checkForSkinUpdate(uint _fighterId) internal {
    Fighter storage fighter = fighters[_fighterId];
    if(fighter.xp == 10) {
      fighter.skin = 'normal_guy';
    }
    else if(fighter.xp == 15) {
      fighter.skin = 'karate_kid';
    }
    else if(fighter.xp == 25) {
      fighter.skin = 'japonese';
    }
    else if(fighter.xp == 30 && fighter.qi >= 30 || fighter.xp == 40) {
      fighter.skin = 'monk';
    }
    else if(fighter.xp == 50) {
      fighter.skin = 'ninja';
    }
    else if(fighter.xp == 80) {
      fighter.skin = 'no_one';
    }
    else if(fighter.xp == 100 && fighter.qi == 100) {
      fighter.skin = 'master';
    }
  }

  function changeSkin(uint _fighterId, string calldata _newSkin) external {
    require(fighters[_fighterId].xp >= 80);

    bytes32 newSkinHash = keccak256(abi.encodePacked(_newSkin));
    require(
      newSkinHash == keccak256('naked') ||
      newSkinHash == keccak256('normal_guy') ||
      newSkinHash == keccak256('karate_kid') ||
      newSkinHash == keccak256('japonese') ||
      newSkinHash == keccak256('monk') ||
      newSkinHash == keccak256('ninja') ||
      newSkinHash == keccak256('no_one') ||
      newSkinHash == keccak256('daemon') ||
      newSkinHash == keccak256('master')
    );

    if(newSkinHash == keccak256('master')) {
      require(fighters[_fighterId].xp >= 100 && fighters[_fighterId].qi >= 100);
    }
    
    fighters[_fighterId].skin = _newSkin;
  }

  function setXpTrainingFee(uint _fee) external onlyOwner {
    trainingFee = _fee;
  }

  function training(uint _fighterId) external payable {
    uint price = fighters[_fighterId].qi * trainingFee;
    require(msg.value == price);
    fighters[_fighterId].qi++;
    _checkForSkinUpdate(_fighterId);
  }

  function renameFighter(uint _fighterId, string calldata _newName) external onlyOwnerOf(_fighterId) {
    fighters[_fighterId].name = _newName;
  }

  function getFightersByOwner(address _owner) external view returns(uint[] memory) {
    uint[] memory result = new uint[](ownerFighterCount[_owner]);
    uint counter = 0;
    for (uint i = 0; i < fighters.length; i++) {
      if (fighterToOwner[i] == _owner) {
        result[counter] = i;
        counter++;
      }
    }
    return result;
  }

  function getFightersCount() external view returns(uint) {
    return fighters.length;
  }


}
