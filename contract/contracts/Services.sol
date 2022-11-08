// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Services is Ownable, ReentrancyGuard {


    enum ServiceStatuses {
        Active,
        Paused,
        Archived
    }

    struct Service {
        uint256 id;
        string image;
        string category;
        string title;
        string description;
        address payable author;
        uint256 createdAt;
        uint256 price;
        uint256 allServicesIndex;
        ServiceStatuses status;
        uint256 lastStatusChangeAt;
    }

    struct ReceivedService {
        string image;
        string category;
        string title;
        string description;
        uint256 price;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _mappingLength;

    // uint8 public serviceFeePercentage; // Platform fee in %
    // uint256 public totalServiceFees;
    uint256[] internal allServices;
    mapping(uint256 => Service) internal services;
    // mapping(address => uint8) public ratings;

    constructor() {
        // serviceFeePercentage = 1;
        _mappingLength.increment();
    }

    // Events

    event ServiceAdded(Service _service);
    event ServiceUpdated(Service _service);
    event ServiceDeleted(uint256 _id);
    // event ServiceFeeUpdated(uint8 _fee);

    // Modifiers

    // modifier onlyAuthor(uint256 _id) {
    //     require(
    //         msg.sender == services[_id].author,
    //         "Only author"
    //     );
    //     _;
    // }

    // modifier onlyAssignee(uint256 _id) {
    //     require(
    //         msg.sender == services[_id].assignee,
    //         "Only assignee"
    //     );
    //     _;
    // }

    modifier serviceExists(uint256 _id) {
        require(services[_id].author != address(0), "Service not found.");
        _;
    }

    // // Helper functions


    // function calculateServiceFee(uint256 _reward)
    //     internal
    //     view
    //     returns (uint256)
    // {
    //     uint256 serviceFee = (_reward / 100) * serviceFeePercentage;
    //     return serviceFee;
    // }

    function addService(ReceivedService calldata _newService)
        external
        returns (bool)
    {
        require(bytes(_newService.category).length > 0, "category is required.");
        require(bytes(_newService.title).length > 0, "Title is required.");
        require(bytes(_newService.description).length > 0,"Description is required.");
        require(_newService.price > 0, "Price is required.");
        
        uint256 _id = _mappingLength.current();
        
        services[_id].id = _id;
        services[_id].image = _newService.image;
        services[_id].category = _newService.category;
        services[_id].title = _newService.title;
        services[_id].description = _newService.description;
        services[_id].author = payable(msg.sender);
        services[_id].createdAt = block.timestamp;
        services[_id].price = _newService.price;
        services[_id].allServicesIndex = allServices.length;
        services[_id].lastStatusChangeAt = block.timestamp;
        allServices.push(_id);
        _mappingLength.increment();
        emit ServiceAdded(services[_id]);
        return true;
    }


    // Getters

    // function getAllServices() public view returns (Service[] memory) {
    //     Service[] memory serviceList = new Service[](allServices.length);
    //     for (uint256 i; i < allServices.length; i++) {
    //         serviceList[i] = services[allServices[i]];
    //     }
    //     return serviceList;
    // }

    // function getService(uint256 _id)
    //     public
    //     view
    //     serviceExists(_id)
    //     returns (Service memory)
    // {
    //     return (services[_id]);
    // }

}
