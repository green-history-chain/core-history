pragma solidity ^0.4.21;

contract Root {

    event TokenAdded(uint newOwnerId, uint tokenId);
 
    mapping(uint => State) states;

    mapping(uint => uint) tokens;

    // uint[] tokenList;

    struct State {
        mapping(uint => string) photo;
        uint count;
    }

    function buyToken(string photoHash, uint coordinates, uint newOwnerId) public payable {
        uint tokenId = uint(keccak256(photoHash, coordinates));
        // require(tokens[tokenId] > 1, "This token already exists");
        // tokenList.push(tokenId);
        states[newOwnerId].photo[coordinates] = photoHash;
        states[newOwnerId].count++;
        tokens[tokenId] = newOwnerId;

        emit TokenAdded(newOwnerId, tokenId);
    }

    function getTokensCount(uint owner) public view returns(uint){
        return states[owner].count;
    }
}