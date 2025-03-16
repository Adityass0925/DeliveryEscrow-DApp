// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DeliveryEscrow {
    struct Delivery {
        address payable client;
        address payable contractor;
        string itemDetails;
        uint256 amount;
        bool completed;
        bool fundsReleased;
    }

    mapping(uint256 => Delivery) public deliveries;
    
    event EscrowCreated(uint256 jobId, address client, address contractor, uint256 amount, string itemDetails);
    event DeliveryConfirmed(uint256 jobId);
    event PaymentReleased(uint256 jobId, address contractor, uint256 amount);
    
    modifier onlyClient(uint256 jobId) {
        require(msg.sender == deliveries[jobId].client, "Only client can perform this action");
        _;
    }
    
    modifier onlyIfExists(uint256 jobId) {
        require(deliveries[jobId].amount > 0, "Delivery does not exist");
        _;
    }
    
    function createEscrow(uint256 jobId, address payable contractor, string memory itemDetails) external payable {
        require(msg.value > 0, "Escrow amount must be greater than zero");
        require(deliveries[jobId].amount == 0, "Escrow already exists for this job");
        
        deliveries[jobId] = Delivery({
            client: payable(msg.sender),
            contractor: contractor,
            itemDetails: itemDetails,
            amount: msg.value,
            completed: false,
            fundsReleased: false
        });
        
        emit EscrowCreated(jobId, msg.sender, contractor, msg.value, itemDetails);
    }
    
    function confirmDelivery(uint256 jobId) external onlyClient(jobId) onlyIfExists(jobId) {
        require(!deliveries[jobId].completed, "Delivery already confirmed");
        
        deliveries[jobId].completed = true;
        emit DeliveryConfirmed(jobId);
    }
    
    function releasePayment(uint256 jobId) external onlyClient(jobId) onlyIfExists(jobId) {
        require(deliveries[jobId].completed, "Delivery not confirmed yet");
        require(!deliveries[jobId].fundsReleased, "Funds already released");
        
        deliveries[jobId].fundsReleased = true;
        deliveries[jobId].contractor.transfer(deliveries[jobId].amount);
        
        emit PaymentReleased(jobId, deliveries[jobId].contractor, deliveries[jobId].amount);
    }
    
    function getDeliveryDetails(uint256 jobId) external view onlyIfExists(jobId) returns (
        address client,
        address contractor,
        string memory itemDetails,
        uint256 amount,
        bool completed,
        bool fundsReleased
    ) {
        Delivery memory d = deliveries[jobId];
        return (d.client, d.contractor, d.itemDetails, d.amount, d.completed, d.fundsReleased);
    }
}
