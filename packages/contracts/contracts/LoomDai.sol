pragma solidity 0.6.2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20Detailed.sol";

contract LoomDai is ERC20, ERC20Detailed {
    // Transfer Gateway contract address
    address public gateway;

    constructor(address _gateway) public ERC20Detailed("Dai", "DAI", 18) {
        gateway = _gateway;
    }

    // Note: temporary when gateway isn't working
    function mint(uint256 _amount) public {
        _mint(msg.sender, _amount);
    }

    // Used by the DAppChain Gateway to mint tokens that have been deposited to the Ethereum Gateway
    function mintToGateway(uint256 _amount) public {
        require(msg.sender == gateway, "only the gateway is allowed to mint");
        _mint(gateway, _amount);
    }
}
