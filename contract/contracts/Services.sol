// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract Services is Ownable, ReentrancyGuard {


    enum ServiceStatuses {
        Active,
        Paused
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
        uint8 deliveryTime;
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
        uint8 deliveryTime;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _mappingLength;

    uint256[] internal allServices;
    mapping(uint256 => Service) internal services;

    constructor() {
        // serviceFeePercentage = 1;
        _mappingLength.increment();
    }

    // Events

    event ServiceAdded(Service _service);
    event ServiceUpdated(Service _service);
    event ServiceDeleted(uint256 _id);

    // Modifiers

    modifier onlyServiceAuthor(uint256 _id) {
        require(
            msg.sender == services[_id].author,
            "Only author"
        );
        _;
    }

    modifier serviceExists(uint256 _id) {
        require(services[_id].author != address(0), "Service not found.");
        _;
    }

    // Helper functions

    function addService(ReceivedService calldata _newService)
        external
        returns (bool)
    {
        require(bytes(_newService.category).length > 0, "category is required.");
        require(bytes(_newService.title).length > 0, "Title is required.");
        require(bytes(_newService.description).length > 0,"Description is required.");
        require(_newService.price > 0, "Price is required.");
        require(_newService.deliveryTime > 0, "Delivery time is required.");
        uint256 _id = _mappingLength.current();
        services[_id].id = _id;
        services[_id].image = _newService.image;
        services[_id].category = _newService.category;
        services[_id].title = _newService.title;
        services[_id].description = _newService.description;
        services[_id].author = payable(msg.sender);
        services[_id].createdAt = block.timestamp;
        services[_id].price = _newService.price;
        services[_id].deliveryTime = _newService.deliveryTime;
        services[_id].allServicesIndex = allServices.length;
        services[_id].lastStatusChangeAt = block.timestamp;
        allServices.push(_id);
        _mappingLength.increment();
        emit ServiceAdded(services[_id]);
        return true;
    }

    function updateService(uint256 _id, ReceivedService calldata _newService)
        external
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        require(bytes(_newService.category).length > 0, "category is required.");
        require(bytes(_newService.title).length > 0, "Title is required.");
        require(bytes(_newService.description).length > 0,"Description is required.");
        require(_newService.price > 0, "Price is required.");
        services[_id].image = _newService.image;
        services[_id].category = _newService.category;
        services[_id].title = _newService.title;
        services[_id].description = _newService.description;
        services[_id].price = _newService.price;
        emit ServiceUpdated(services[_id]);
        return true;
    }

    function pauseService(uint256 _id)
        external
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        require(services[_id].status == ServiceStatuses.Active, "Invalid service status.");
        services[_id].status = ServiceStatuses.Paused;
        services[_id].lastStatusChangeAt = block.timestamp;
        emit ServiceUpdated(services[_id]);
        return true;
    }

    function resumeService(uint256 _id)
        external
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        require(services[_id].status == ServiceStatuses.Paused, "Invalid service status.");
        services[_id].status = ServiceStatuses.Active;
        services[_id].lastStatusChangeAt = block.timestamp;
        emit ServiceUpdated(services[_id]);
        return true;
    }


    function deleteService(uint256 _id)
        external
        serviceExists(_id)
        onlyServiceAuthor(_id)
        returns (bool)
    {
        uint index = services[_id].allServicesIndex;
        delete services[_id];
        delete allServices[index];
        if (allServices[index] == allServices[allServices.length - 1]) {
            allServices.pop();
        } else {
            allServices[index] = allServices[allServices.length - 1];
            allServices.pop();
            services[allServices[index]].allServicesIndex = index;
        }
        emit ServiceDeleted(_id);
        return true;
    }
}
