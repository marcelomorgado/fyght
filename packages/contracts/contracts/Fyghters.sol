pragma solidity 0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./Dai.sol";

contract Fyghters is ERC721 {
    using SafeMath for uint256;

    uint8 constant ALL_SKINS_MIN_XP = 80;
    uint8 constant MASTER_MIN_XP = 100;
    string constant MASTER_SKIN = "master";
    uint256 constant ONE = 1 * 10**18;
    uint256 constant MIN_DEPOSIT = ONE * 5;
    uint256 constant BET_VALUE = ONE * 5;

    Dai private dai;

    event FyghterCreated(address indexed owner, uint256 id, string name);
    event ChallengeOccurred(uint256 indexed challengerId, uint256 targetId, uint256 winnerId);
    event SkinChanged(uint256 indexed id, string newSkin);
    event FyghterRenamed(uint256 indexed id, string newName);
    event Deposited(uint256 indexed id, uint256 amount);
    event Withdrawn(uint256 indexed id, uint256 amount);

    struct Fyghter {
        uint256 id;
        string name;
        string skin;
        uint256 xp;
        uint256 balance;
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

    constructor(Dai _dai) public {
        dai = _dai;

        // Skins table
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

    function getMinimumDeposit() external pure returns (uint256) {
        return MIN_DEPOSIT;
    }

    function getBetValue() external pure returns (uint256) {
        return BET_VALUE;
    }

    function create(string calldata _name) external {
        require(balanceOf(msg.sender) == 0, "Each user can have just one fyghter.");

        uint256 _id = fyghters.length;
        fyghters.push(Fyghter({id: _id, name: _name, skin: skins[0].skin, xp: 1, balance: 0}));
        _mint(msg.sender, _id);
        emit FyghterCreated(msg.sender, _id, _name);
    }

    function deposit(uint256 _fyghterId, uint256 _amount) external {
        require(dai.transferFrom(msg.sender, address(this), _amount), "Deposit transfer with error.");
        require(_amount >= MIN_DEPOSIT, "Deposit amount less than the minimum");
        fyghters[_fyghterId].balance = fyghters[_fyghterId].balance.add(_amount);
        emit Deposited(_fyghterId, _amount);
    }

    function withdrawAll(uint256 _fyghterId) external onlyOwnerOf(_fyghterId) {
        uint256 balance = fyghters[_fyghterId].balance;
        fyghters[_fyghterId].balance = 0;
        require(dai.transfer(msg.sender, balance), "Withdraw transfer with error.");
        emit Withdrawn(_fyghterId, balance);
    }

    function rename(uint256 _fyghterId, string calldata _newName) external onlyOwnerOf(_fyghterId) {
        fyghters[_fyghterId].name = _newName;
        emit FyghterRenamed(_fyghterId, _newName);
    }

    function calculateGainAndLoss(uint256 _winProbability) public pure returns (uint256 gainIfWin, uint256 lossIfLose) {
        gainIfWin = BET_VALUE.mul(ONE.sub(_winProbability)).div(ONE);
        lossIfLose = BET_VALUE.mul(_winProbability).div(ONE);
    }

    function challenge(uint256 _challengerId, uint256 _targetId) external onlyOwnerOf(_challengerId) {
        uint256 winProbability = calculateWinProbability(_challengerId, _targetId);
        uint256 winnerId = (_random() <= winProbability) ? _challengerId : _targetId;

        processChallengeResult(_challengerId, _targetId, winnerId, winProbability);
    }

    function processChallengeResult(
        uint256 _challengerId,
        uint256 _targetId,
        uint256 _winnerId,
        uint256 _winProbability
    ) internal {
        (uint256 gainIfWin, uint256 lossIfLose) = calculateGainAndLoss(_winProbability);

        require(fyghters[_challengerId].balance >= lossIfLose, "Your fyghter doesn't have enough balance.");
        require(fyghters[_targetId].balance >= gainIfWin, "The enemy doesn't have enough balance.");

        uint256 prize = (_challengerId == _winnerId) ? gainIfWin : lossIfLose;
        uint256 loserId = _winnerId == _challengerId ? _targetId : _challengerId;

        fyghters[_winnerId].xp++;
        fyghters[_winnerId].balance = fyghters[_winnerId].balance.add(prize);
        fyghters[loserId].balance = fyghters[loserId].balance.sub(prize);

        _checkForSkinUpdate(_winnerId);

        emit ChallengeOccurred(_challengerId, _targetId, _winnerId);
    }

    function changeSkin(uint256 _fyghterId, string calldata _newSkin) external onlyOwnerOf(_fyghterId) {
        Fyghter storage fyghter = fyghters[_fyghterId];
        require(fyghter.xp >= ALL_SKINS_MIN_XP, "The fyghter hasn't enough XP to change skin.");

        require(_isSkinValid(_newSkin), "Invalid skin.");

        if (keccak256(abi.encodePacked(_newSkin)) == keccak256(abi.encodePacked(MASTER_SKIN))) {
            require(fyghter.xp >= MASTER_MIN_XP, "The fyghter should be a master to use the master skin.");
        }

        fyghters[_fyghterId].skin = _newSkin;

        emit SkinChanged(_fyghterId, _newSkin);
    }

    function calculateWinProbability(uint256 _challengerId, uint256 _targetId)
        public
        view
        returns (uint256 winProbability)
    {
        Fyghter memory challenger = fyghters[_challengerId];
        Fyghter memory target = fyghters[_targetId];

        winProbability = challenger.xp.mul(ONE).div(challenger.xp.add(target.xp));
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
        return ((uint256(keccak256(abi.encodePacked(block.timestamp, block.difficulty))) % 100) * ONE).div(100);
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
