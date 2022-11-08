// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "./Tasks.sol";
import "./Services.sol";
import "./Profiles.sol";


contract PlatformFactory is Tasks, Services, Profiles {

    function withdrawFees()
        public
        payable
        onlyOwner
        nonReentrant
        returns (bool)
    {
        uint256 amount = totalFees;
        totalFees = 0;
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Tranfer failed.");
        return true;
    }

    function setPlatformFee(uint8 _fee) external onlyOwner returns (bool) {
        platformFeePercentage = _fee;
        emit FeeUpdated(_fee);
        return true;
    }


    function getRating(address _address) public view returns (uint8) {
        return ratings[_address];
    }
    
     function getAllTasks() public view returns (Task[] memory) {
        Task[] memory taskList = new Task[](allTasks.length);
        for (uint256 i; i < allTasks.length; i++) {
            taskList[i] = tasks[allTasks[i]];
        }
        return taskList;
    }

    function getTask(uint256 _id)
        public
        view
        taskExists(_id)
        returns (Task memory)
    {
        return (tasks[_id]);
    }
    
    function getAllServices() public view returns (Service[] memory) {
        Service[] memory serviceList = new Service[](allServices.length);
        for (uint256 i; i < allServices.length; i++) {
            serviceList[i] = services[allServices[i]];
        }
        return serviceList;
    }

    function getService(uint256 _id)
        public
        view
        serviceExists(_id)
        returns (Service memory)
    {
        return (services[_id]);
    }
    
    function getProfile()
        public
        view
        returns (Profile memory)
    {
        return (profiles[msg.sender]);
    }
}
