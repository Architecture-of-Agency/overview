// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract NeighborhoodDataGovernance {
    struct Neighborhood {
        string id;
        string name;
        string dataHash;
        bool validated;
    }
    
    mapping(string => Neighborhood) public neighborhoods;
    
    function registerNeighborhood(
        string memory id,
        string memory name,
        string memory dataHash
    ) external {
        neighborhoods[id] = Neighborhood(id, name, dataHash, false);
    }
}
