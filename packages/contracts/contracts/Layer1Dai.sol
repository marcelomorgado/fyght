pragma solidity 0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Layer1Dai is ERC20 {
    // Standard mint function
    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
