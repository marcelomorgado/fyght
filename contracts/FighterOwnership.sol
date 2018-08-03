pragma solidity ^0.4.24;

import "./FighterAttack.sol";
import "./ERC721.sol";
import "./SafeMath.sol";

contract FighterOwnership is FighterAttack, ERC721 {

  using SafeMath for uint256;

  mapping (uint => address) fighterApprovals;

  function balanceOf(address _owner) public view returns (uint256 _balance) {
    return ownerFighterCount[_owner];
  }

  function ownerOf(uint256 _tokenId) public view returns (address _owner) {
    return fighterToOwner[_tokenId];
  }

  function _transfer(address _from, address _to, uint256 _tokenId) private {
    ownerFighterCount[_to] = ownerFighterCount[_to].add(1);
    ownerFighterCount[msg.sender] = ownerFighterCount[msg.sender].sub(1);
    fighterToOwner[_tokenId] = _to;
    emit Transfer(_from, _to, _tokenId);
  }

  function transfer(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
    _transfer(msg.sender, _to, _tokenId);
  }

  function approve(address _to, uint256 _tokenId) public onlyOwnerOf(_tokenId) {
    fighterApprovals[_tokenId] = _to;
    emit Approval(msg.sender, _to, _tokenId);
  }

  function takeOwnership(uint256 _tokenId) public {
    require(fighterApprovals[_tokenId] == msg.sender);
    address owner = ownerOf(_tokenId);
    _transfer(owner, msg.sender, _tokenId);
  }
}
