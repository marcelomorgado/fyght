pragma solidity 0.6.1;

import "./FighterFactory.sol";

contract FighterHelper is FighterFactory {
    uint256 public trainingFee = 0.005 ether;

    modifier onlyOwnerOf(uint256 _fighterId) {
        require(msg.sender == fighterToOwner[_fighterId]);
        _;
    }

    function _checkForSkinUpdate(uint256 _fighterId) internal {
        Fighter storage fighter = fighters[_fighterId];
        if (fighter.xp == 10) {
            fighter.skin = "normal_guy";
        } else if (fighter.xp == 15) {
            fighter.skin = "karate_kid";
        } else if (fighter.xp == 25) {
            fighter.skin = "japonese";
        } else if ((fighter.xp == 30 && fighter.qi >= 30) || fighter.xp == 40) {
            fighter.skin = "monk";
        } else if (fighter.xp == 50) {
            fighter.skin = "ninja";
        } else if (fighter.xp == 80) {
            fighter.skin = "no_one";
        } else if (fighter.xp == 100 && fighter.qi == 100) {
            fighter.skin = "master";
        }
    }

    function changeSkin(uint256 _fighterId, string calldata _newSkin) external {
        require(fighters[_fighterId].xp >= 80);

        bytes32 newSkinHash = keccak256(abi.encodePacked(_newSkin));
        require(
            newSkinHash == keccak256("naked") ||
                newSkinHash == keccak256("normal_guy") ||
                newSkinHash == keccak256("karate_kid") ||
                newSkinHash == keccak256("japonese") ||
                newSkinHash == keccak256("monk") ||
                newSkinHash == keccak256("ninja") ||
                newSkinHash == keccak256("no_one") ||
                newSkinHash == keccak256("daemon") ||
                newSkinHash == keccak256("master")
        );

        if (newSkinHash == keccak256("master")) {
            require(fighters[_fighterId].xp >= 100 && fighters[_fighterId].qi >= 100);
        }

        fighters[_fighterId].skin = _newSkin;
    }

    function setXpTrainingFee(uint256 _fee) external {
        trainingFee = _fee;
    }

    function training(uint256 _fighterId) external payable {
        uint256 price = fighters[_fighterId].qi * trainingFee;
        require(msg.value == price);
        fighters[_fighterId].qi++;
        _checkForSkinUpdate(_fighterId);
    }

    function renameFighter(uint256 _fighterId, string calldata _newName) external onlyOwnerOf(_fighterId) {
        fighters[_fighterId].name = _newName;
    }

    function getFightersByOwner(address _owner) external view returns (uint256[] memory) {
        uint256[] memory result = new uint256[](ownerFighterCount[_owner]);
        uint256 counter = 0;
        for (uint256 i = 0; i < fighters.length; i++) {
            if (fighterToOwner[i] == _owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    function getFightersCount() external view returns (uint256) {
        return fighters.length;
    }

}
