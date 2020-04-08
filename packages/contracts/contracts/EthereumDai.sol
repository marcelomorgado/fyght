pragma solidity 0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract EthereumDai is ERC20 {
    function mint(uint256 amount) public {
        _mint(msg.sender, amount);
    }
}
