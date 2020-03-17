pragma solidity 0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Fyghters is ERC721 {
    using SafeMath for uint256;

    uint8 constant ALL_SKINS_MIN_XP = 80;
    uint8 constant MASTER_MIN_XP = 100;
    string constant MASTER_SKIN = "master";
    uint256 constant ONE = 1 * 10**18;

    // TODO: Standard names
    event NewFyghter(address indexed owner, uint256 id, string name);
    event Attack(uint256 indexed attackerId, uint256 targetId, uint256 winnerId);
    event SkinChanged(uint256 indexed id, string newSkin);
    event FyghterRenamed(uint256 indexed id, string newName);

    struct Fyghter {
        uint256 id;
        string name;
        string skin;
        uint256 xp;
    }

    struct Skin {
        string skin;
        uint8 xpNeeded;
    }

    Fyghter[] public fyghters;
    Skin[] public skins;

    modifier onlyOwnerOf(uint256 _fyghterId) {
        require(msg.sender == ownerOf(_fyghterId), "This operaction only can be done by the owner.");
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
        skins.push(Skin({skin: "demon", xpNeeded: 80}));
        skins.push(Skin({skin: MASTER_SKIN, xpNeeded: MASTER_MIN_XP}));
    }

    function create(string calldata _name) external {
        require(balanceOf(msg.sender) == 0, "Each user can have just one fyghter.");
        uint256 _id = fyghters.length;
        fyghters.push(Fyghter({id: _id, name: _name, skin: skins[0].skin, xp: 1}));
        _mint(msg.sender, _id);
        emit NewFyghter(msg.sender, _id, _name);
    }

    function rename(uint256 _fyghterId, string calldata _newName) external onlyOwnerOf(_fyghterId) {
        fyghters[_fyghterId].name = _newName;
        emit FyghterRenamed(_fyghterId, _newName);
    }

    function attack(uint256 _attackerId, uint256 _targetId) external onlyOwnerOf(_attackerId) {
        uint256 attackVictoryProbability = calculateAttackerProbability(_attackerId, _targetId);

        uint256 winnerId = (_random() <= attackVictoryProbability) ? _attackerId : _targetId;

        fyghters[winnerId].xp++;
        _checkForSkinUpdate(winnerId);
        emit Attack(_attackerId, _targetId, winnerId);
    }

    function changeSkin(uint256 _fyghterId, string calldata _newSkin) external onlyOwnerOf(_fyghterId) {
        Fyghter storage fyghter = fyghters[_fyghterId];
        require(fyghter.xp >= ALL_SKINS_MIN_XP, "The fyghter has no enough XP to change skin.");

        require(_isSkinValid(_newSkin), "Invalid skin.");

        if (keccak256(abi.encodePacked(_newSkin)) == keccak256(abi.encodePacked(MASTER_SKIN))) {
            require(fyghter.xp >= MASTER_MIN_XP, "The fyghter should be a master to use the master skin.");
        }

        fyghters[_fyghterId].skin = _newSkin;

        emit SkinChanged(_fyghterId, _newSkin);
    }

    function calculateAttackerProbability(uint256 _attackerId, uint256 _targetId)
        public
        view
        returns (uint256 winProbability)
    {
        Fyghter memory attacker = fyghters[_attackerId];
        Fyghter memory target = fyghters[_targetId];

        winProbability = attacker.xp.mul(ONE).div(attacker.xp.add(target.xp)).mul(100);
    }

    function _checkForSkinUpdate(uint256 _fyghterId) internal view returns (string memory newSkin) {
        for (uint256 i = skins.length - 1; i >= 0; i--) {
            if (fyghters[_fyghterId].xp >= skins[i].xpNeeded) {
                newSkin = skins[i].skin;
                break;
            }
        }
    }

    /*
    * Note: It isn't a safe way to generate random number.
    * See more: https://github.com/marcelomorgado/fyght/issues/71
    */
    function _random() internal view returns (uint256) {
        return (uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 100) * ONE;
    }

    function _isSkinValid(string memory skin) private view returns (bool isSkinValid) {
        isSkinValid = false;
        for (uint256 i = 0; i < skins.length; i++) {
            if (keccak256(abi.encodePacked(skin)) == keccak256(abi.encodePacked(skins[i].skin))) {
                isSkinValid = true;
                break;
            }
        }
    }

}
