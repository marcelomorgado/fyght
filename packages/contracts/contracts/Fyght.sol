pragma solidity 0.6.1;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Fyght is ERC721 {
    using SafeMath for uint256;

    event NewFighter(uint256 fighterId, string name);

    struct Fighter {
        uint256 id;
        string name;
        string skin;
        uint32 xp;
    }

    Fighter[] public fighters;

    mapping(uint256 => address) public fighterToOwner;
    mapping(address => uint256) ownerFighterCount;

    function createFighter(string memory _name) public {
        require(ownerFighterCount[msg.sender] == 0);
        uint256 id = fighters.length;
        fighters.push(Fighter(id, _name, "naked", 1));
        fighterToOwner[id] = msg.sender;
        ownerFighterCount[msg.sender]++;
        emit NewFighter(id, _name);
    }

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
        } else if (fighter.xp == 40) {
            fighter.skin = "monk";
        } else if (fighter.xp == 50) {
            fighter.skin = "ninja";
        } else if (fighter.xp == 80) {
            fighter.skin = "no_one";
        } else if (fighter.xp == 100) {
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
            require(fighters[_fighterId].xp >= 100);
        }

        fighters[_fighterId].skin = _newSkin;
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

        uint256 aPoints = (attacker.xp * 3) / 5;
        uint256 tPoints = (target.xp * 3) / 5;

        return ((aPoints * 100) / (aPoints + tPoints)) + 5;
    }

    /*
    const winProbability = myFyghter.xp / (myFyghter.xp + enemy.xp);
    const random = Math.random();
    */
    function attack(uint256 _fighterId, uint256 _targetId) external onlyOwnerOf(_fighterId) {
        Fighter storage myFighter = fighters[_fighterId];
        Fighter storage enemyFighter = fighters[_targetId];
        uint256 rand = randMod(100);
        uint256 attackVictoryProbability = _calculateAttackerProbability(_fighterId, _targetId);
        if (rand <= attackVictoryProbability) {
            myFighter.xp++;
            _checkForSkinUpdate(_fighterId);
            emit Attack(_fighterId, _targetId, _fighterId);
        } else {
            enemyFighter.xp++;
            _checkForSkinUpdate(_targetId);
            emit Attack(_fighterId, _targetId, _targetId);
        }
    }

}
