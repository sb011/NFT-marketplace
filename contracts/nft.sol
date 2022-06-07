//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFT is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    // counters allows us to keep track of tokenIds
    // address of marketplace for NFTs to interact
    address contractAddress;

    // OBJ: give the NFT market the ability to transact with tokens or change ownership
    // setApprovalForAll allows us to do that with contract address

    // constructor
    constructor(address marketplaceAddress) ERC721("NFTmarketplace", "NFTZ") {
        contractAddress = marketplaceAddress;
    }

    function mintToken(string memory tokenURI) public returns (uint256) {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        // passing in id and url
        _mint(msg.sender, newItemId);

        _setTokenURI(newItemId, tokenURI);

        // give the marketplace the approval to transact between users
        setApprovalForAll(contractAddress, true);

        return newItemId;
    }
}
