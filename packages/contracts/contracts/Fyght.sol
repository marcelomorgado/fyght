pragma solidity 0.6.1;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Fyght is ERC721 {
    using SafeMath for uint256;

    uint8 constant ALL_SKINS_MIN_XP = 80;
    uint8 constant MASTER_MIN_XP = 100;
    string constant MASTER_SKIN = "master";

    uint256 constant ONE = 1 * 10**18;

    event NewFighter(uint256 id, string name);
    event Attack(uint256 attackerId, uint256 targetId, uint256 winnerId);
    event SkinChanged(uint256 id, string newSkin);
    event FyghterRenamed(uint256 id, string newName);

    struct Fighter {
        uint256 id;
        string name;
        string skin;
        uint256 xp;
    }

    struct Skin {
        string skin;
        uint8 xpNeeded;
    }

    Fighter[] public fighters;
    Skin[] public skins;

    modifier onlyOwnerOf(uint256 _fighterId) {
        require(msg.sender == ownerOf(_fighterId), "This operaction only can be done by the owner.");
        _;
    }

    constructor() public {
        skins.push(Skin({skin: "naked", xpNeeded: 0}));
        skins.push(Skin({skin: "normal_guy", xpNeeded: 10}));
        skins.push(Skin({skin: "karate_kid", xpNeeded: 15}));
        skins.push(Skin({skin: "japonese", xpNeeded: 25}));
        skins.push(Skin({skin: "monk", xpNeeded: 40}));
        skins.push(Skin({skin: "ninja", xpNeeded: 50}));
        skins.push(Skin({skin: "no_one", xpNeeded: ALL_SKINS_MIN_XP}));
        skins.push(Skin({skin: "daemon", xpNeeded: 80}));
        skins.push(Skin({skin: MASTER_SKIN, xpNeeded: MASTER_MIN_XP}));
    }

    function createFighter(string calldata _name) external {
        require(balanceOf(msg.sender) == 0, "Each user can have just one fyghter.");
        uint256 _id = fighters.length;
        fighters.push(Fighter({id: _id, name: _name, skin: skins[0].skin, xp: 1}));
        _mint(msg.sender, _id);
        emit NewFighter(_id, _name);
    }

    function renameFighter(uint256 _fighterId, string calldata _newName) external onlyOwnerOf(_fighterId) {
        fighters[_fighterId].name = _newName;
        emit FyghterRenamed(_fighterId, _newName);
    }

    function attack(uint256 _fighterId, uint256 _targetId) external onlyOwnerOf(_fighterId) {
        uint256 attackVictoryProbability = calculateAttackerProbability(_fighterId, _targetId);

        uint256 winnerId;

        if (_random() <= attackVictoryProbability) winnerId = _fighterId;
        else winnerId = _targetId;

        fighters[winnerId].xp++;
        _checkForSkinUpdate(winnerId);
        emit Attack(_fighterId, _targetId, winnerId);
    }

    function changeSkin(uint256 _fighterId, string calldata _newSkin) external onlyOwnerOf(_fighterId) {
        Fighter storage fighter = fighters[_fighterId];
        require(fighter.xp >= ALL_SKINS_MIN_XP, "The fyghter has no enough XP to change skin.");

        bool isSkinValid = false;
        for (uint256 i = 0; i < skins.length; i++) {
            if (keccak256(abi.encodePacked(_newSkin)) == keccak256(abi.encodePacked(skins[i].skin))) {
                isSkinValid = true;
                break;
            }
        }

        require(isSkinValid, "Invalid skin.");

        if (keccak256(abi.encodePacked(_newSkin)) == keccak256(abi.encodePacked(MASTER_SKIN))) {
            require(fighter.xp >= MASTER_MIN_XP, "The fyghter should be a master to use the master skin.");
        }

        fighters[_fighterId].skin = _newSkin;

        emit SkinChanged(_fighterId, _newSkin);
    }

    function calculateAttackerProbability(uint256 _fighterId, uint256 _targetId)
        public
        view
        returns (uint256 winProbability)
    {
        Fighter memory attacker = fighters[_fighterId];
        Fighter memory target = fighters[_targetId];

        winProbability = attacker.xp.mul(ONE).div(attacker.xp.add(target.xp)).mul(100);
    }

    function _checkForSkinUpdate(uint256 _fighterId) internal view returns (string memory newSkin) {
        Fighter storage fighter = fighters[_fighterId];
        for (uint256 i = skins.length - 1; i >= 0; i--) {
            if (fighter.xp >= skins[i].xpNeeded) {
                newSkin = skins[i].skin;
                break;
            }
        }
    }

    function _random() internal view returns (uint256) {
        return (uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 100) * ONE;
    }

}
