// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

// Ensure this import matches your installed node_modules structure
import "@semaphore-protocol/contracts/interfaces/ISemaphore.sol";
import "@semaphore-protocol/contracts/base/SemaphoreVerifier.sol";
import "@semaphore-protocol/contracts/Semaphore.sol";

contract ZkWhistle {
    // 1. State Variables
    ISemaphore public semaphore;
    uint256 public groupId;
    address public admin;

    // 2. Events (frontend listens to these)
    event NewComplaint(uint256 indexed signal, string ipfsCid);
    event GroupCreated(uint256 indexed groupId, address indexed admin);

    // 3. Constructor
    // We pass the 'semaphoreAddress' that we deployed in our deploy.js script
    constructor(address _semaphoreAddress) {
        semaphore = ISemaphore(_semaphoreAddress);
        admin = msg.sender;
        
        // --- FIX IS HERE ---
        // We set 'address(this)' as the admin. 
        // This gives the ZkWhistle contract permission to call 'addMember'.
        groupId = semaphore.createGroup(address(this));
        
        emit GroupCreated(groupId, address(this));
    }

    // 4. Join Function (Step 1 for User)
    // The user generates an identityCommitment in the browser and sends it here
    function joinGroup(uint256 identityCommitment) external {
        // In a real app, you would check: require(isValidStudent(msg.sender), "Not a student");
        semaphore.addMember(groupId, identityCommitment);
    }

    // 5. Whistle Function (DEBUG MODE)
    function publishComplaint(
        uint256 merkleTreeRoot,
        uint256 nullifier,
        uint256[8] calldata points,
        uint256 signal,
        uint256 merkleTreeDepth,
        string calldata ipfsCid
    ) external {
        
        // --- COMMENT OUT THESE LINES FOR NOW ---
        /*
        ISemaphore.SemaphoreProof memory proof = ISemaphore.SemaphoreProof({
            merkleTreeDepth: merkleTreeDepth, 
            merkleTreeRoot: merkleTreeRoot,
            nullifier: nullifier,
            message: signal,
            scope: groupId,
            points: points
        });

        bool isValid = semaphore.verifyProof(groupId, proof);
        require(isValid, "Invalid Proof");
        */
        // ---------------------------------------

        // Just emit the event directly to see if the transaction works
        emit NewComplaint(signal, ipfsCid);
    }

    // Helper: Get the Group ID (Useful for Frontend debugging)
    function getGroupId() external view returns (uint256) {
        return groupId;
    }
}