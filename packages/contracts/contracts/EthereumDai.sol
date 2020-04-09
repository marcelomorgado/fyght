pragma solidity 0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";


contract EthereumDai is ERC20, ERC20Detailed {
    constructor() public payable ERC20Detailed("Dai", "DAI", 18) {}

    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
