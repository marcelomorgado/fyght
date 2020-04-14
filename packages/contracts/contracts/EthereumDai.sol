pragma solidity 0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract EthereumDai is ERC20 {
    constructor() public ERC20("Dai", "DAI") {}

    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }
}
