// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

enum ProjectTypes {
    FCFS,
    AuthorSelected,
    ThirdPartyVerified
}

enum Statuses {
    Opened,
    Assigned,
    InReview,
    ChangeRequested,
    Completed
}

contract Platform is Ownable, ReentrancyGuard {

    struct Project {
        uint256 id;
        string category;
        string title;
        string description;
        address payable author;
        address payable assignee;
        address[] candidates;
        uint256 createdAt;
        uint256 completedAt;
        ProjectTypes projectType;
        uint256 reward;
        string result;
        ChangeRequest[] changeRequests;
        uint256 allProjectsIndex;
        Statuses status;
        uint256 lastStatusChangeAt;
    }

    struct ReceivedProject {
        string category;
        string title;
        string description;
        ProjectTypes projectType;
        uint256 reward;
    }

    struct ChangeRequest {
        string message;
        uint256 requestedAt;
    }

    using Counters for Counters.Counter;
    Counters.Counter private _mappingLength;

    uint8 public platformFeePercentage; // Platform fee in %
    uint256 public totalFees;
    uint256[] private allProjects;
    mapping(uint256 => Project) private projects;
    mapping(address => uint8) public ratings;

    constructor() {
        platformFeePercentage = 1;
        _mappingLength.increment();
    }

    // Events

    event ProjectAdded(Project _project);
    event ProjectUpdated(Project _project);
    event ProjectDeleted(uint256 _id);
    event FeeUpdated(uint8 _fee);

    // Modifiers

    modifier onlyAuthor(uint256 _id) {
        require(
            msg.sender == projects[_id].author,
            "Only author"
        );
        _;
    }

    modifier onlyAssignee(uint256 _id) {
        require(
            msg.sender == projects[_id].assignee,
            "Only assignee"
        );
        _;
    }

    modifier projectExists(uint256 _id) {
        require(projects[_id].author != address(0), "Project not found.");
        _;
    }

    // Helper functions

    function isAddressApplied(uint256 _id, address _address)
        internal
        view
        returns (bool)
    {
        for (uint256 i = 0; i < projects[_id].candidates.length; i++) {
            if (projects[_id].candidates[i] == _address) return true;
        }
        return false;
    }

    function calculateRating(uint256 _prevRating, uint8 _newRating)
        internal
        pure
        returns (uint8)
    {
        if (_prevRating == 0) return _newRating;
        return uint8(_prevRating + _newRating) / 2;
    }

    function calculatePlatformFee(uint256 _reward)
        internal
        view
        returns (uint256)
    {
        uint256 platformFee = (_reward / 100) * platformFeePercentage;
        return platformFee;
    }

    // Contract functions

    function addProject(ReceivedProject calldata _newProject)
        external
        payable
        returns (bool)
    {
        require(bytes(_newProject.title).length > 0, "Title is required.");
        require(
            bytes(_newProject.description).length > 0,
            "Description is required."
        );
        require(_newProject.reward > 0, "Reward is required.");
        uint256 platformFee = calculatePlatformFee(_newProject.reward);
        uint256 amount = _newProject.reward + platformFee;
        require(msg.value == amount, "Wrong amount submitted.");
        totalFees += platformFee;
        uint256 _id = _mappingLength.current();
        projects[_id].id = _id;
        projects[_id].category = _newProject.category;
        projects[_id].title = _newProject.title;
        projects[_id].description = _newProject.description;
        projects[_id].author = payable(msg.sender);
        projects[_id].createdAt = block.timestamp;
        projects[_id].reward = _newProject.reward;
        projects[_id].projectType = _newProject.projectType;
        projects[_id].allProjectsIndex = allProjects.length;
        projects[_id].lastStatusChangeAt = block.timestamp;
        allProjects.push(_id);
        _mappingLength.increment();
        emit ProjectAdded(projects[_id]);
        return true;
    }

    function assignProject(uint256 _id, address payable _candidateAddress)
        external
        projectExists(_id)
        onlyAuthor(_id)
        returns (bool)
    {
        require(_candidateAddress != address(0), "Zero address submitted.");
        require(
            projects[_id].projectType == ProjectTypes.AuthorSelected,
            "Invalid project type"
        );
        require(
            projects[_id].status != Statuses.Assigned,
            "Project already assigned."
        );
        require(
            isAddressApplied(_id, _candidateAddress),
            "Invalid address."
        );
        projects[_id].assignee = _candidateAddress;
        projects[_id].status = Statuses.Assigned;
        projects[_id].lastStatusChangeAt = block.timestamp;
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function unassignProject(uint256 _id)
        public
        projectExists(_id)
        returns (bool)
    {
        require(
            msg.sender == projects[_id].author ||
                msg.sender == projects[_id].assignee,
            "Only author or assignee"
        );
        require(
            projects[_id].status == Statuses.Assigned,
            "Project is not assigned."
        );
        delete projects[_id].assignee;
        projects[_id].status = Statuses.Opened;
        projects[_id].lastStatusChangeAt = block.timestamp;
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function applyForProject(uint256 _id)
        external
        projectExists(_id)
        returns (bool)
    {
        require(
            projects[_id].status != Statuses.Assigned,
            "Project already assigned."
        );
        if (projects[_id].projectType == ProjectTypes.FCFS) {
            projects[_id].assignee = payable(msg.sender);
            projects[_id].status = Statuses.Assigned;
            projects[_id].lastStatusChangeAt = block.timestamp;
            emit ProjectUpdated(projects[_id]);
        } else {
            projects[_id].candidates.push(msg.sender);
        }
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function submitResult(uint256 _id, string calldata _result)
        external
        projectExists(_id)
        onlyAssignee(_id)
        returns (bool)
    {
        require(bytes(_result).length > 0, "Result cannot be empty.");
        require(projects[_id].status == Statuses.Assigned || projects[_id].status == Statuses.ChangeRequested, "Invalid project status.");
        // require(
        //     bytes(projects[_id].result).length == 0,
        //     "Result already submitted."
        // );
        projects[_id].result = _result;
        projects[_id].status = Statuses.InReview;
        projects[_id].lastStatusChangeAt = block.timestamp;
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function requestChange(uint256 _id, string calldata _message)
        public
        projectExists(_id)
        onlyAuthor(_id)
        returns (bool)
    {
        require(
            projects[_id].status == Statuses.InReview,
            "Invalid status"
        );
        require(
            projects[_id].changeRequests.length < 3,
            "Limit exceeded"
        );
        projects[_id].changeRequests.push(ChangeRequest(_message, block.timestamp));
        projects[_id].status = Statuses.ChangeRequested;
        projects[_id].lastStatusChangeAt = block.timestamp;
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function completeProject(uint256 _id, uint8 _rating)
        external
        projectExists(_id)
        onlyAuthor(_id)
        nonReentrant
        returns (bool)
    {
        require(projects[_id].completedAt == 0, "Project already completed.");
        require(bytes(projects[_id].result).length > 0, "Result is required.");
        require(_rating <= 5, "Rating is invalid.");
        projects[_id].completedAt = block.timestamp;
        projects[_id].status = Statuses.Completed;
        projects[_id].lastStatusChangeAt = block.timestamp;
        ratings[projects[_id].assignee] = calculateRating(
            ratings[projects[_id].assignee],
            _rating
        );
        (bool success, ) = projects[_id].assignee.call{
            value: projects[_id].reward
        }("");
        require(success, "Tranfer failed.");
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function requestPayment(uint256 _id)
        external
        projectExists(_id)
        onlyAssignee(_id)
        nonReentrant
        returns (bool)
    {
        require(projects[_id].status == Statuses.InReview);
        // Need to wait for 10 days
        require(
            projects[_id].lastStatusChangeAt < block.timestamp - 10 days,
            "Need to wait 10 days."
        );
        projects[_id].completedAt = block.timestamp;
        projects[_id].status = Statuses.Completed;
        projects[_id].lastStatusChangeAt = block.timestamp;
        (bool success, ) = projects[_id].assignee.call{
            value: projects[_id].reward
        }("");
        require(success, "Tranfer failed.");
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function deleteProject(uint256 _id)
        external
        payable
        projectExists(_id)
        onlyAuthor(_id)
        nonReentrant
        returns (bool)
    {
        require(
            projects[_id].assignee == address(0),
            "Project already assigned."
        );
        (bool success, ) = projects[_id].author.call{
            value: projects[_id].reward
        }("");
        require(success, "Tranfer failed.");
        delete projects[_id];
        delete allProjects[projects[_id].allProjectsIndex];
        allProjects[projects[_id].allProjectsIndex] = allProjects[
            allProjects.length - 1
        ];
        allProjects.pop();
        emit ProjectDeleted(_id);
        return true;
    }

    function withdrawFees()
        public
        payable
        onlyOwner
        nonReentrant
        returns (bool)
    {
        (bool success, ) = payable(msg.sender).call{value: totalFees}("");
        require(success, "Tranfer failed.");
        totalFees = 0;
        return true;
    }

    function setPlatformFee(uint8 _fee) external onlyOwner returns (bool) {
        platformFeePercentage = _fee;
        emit FeeUpdated(_fee);
        return true;
    }

    // Getters

    function getAllProjects() public view returns (Project[] memory) {
        Project[] memory projectList = new Project[](allProjects.length);
        for (uint256 i; i < allProjects.length; i++) {
            projectList[i] = projects[allProjects[i]];
        }
        return projectList;
    }

    function getProject(uint256 _id)
        public
        view
        projectExists(_id)
        returns (Project memory)
    {
        Project memory project;
        project.id = projects[_id].id;
        project.category = projects[_id].category;
        project.title = projects[_id].title;
        project.description = projects[_id].description;
        project.author = projects[_id].author;
        project.assignee = projects[_id].assignee;
        project.candidates = projects[_id].candidates;
        project.projectType = projects[_id].projectType;
        project.createdAt = projects[_id].createdAt;
        project.completedAt = projects[_id].completedAt;
        project.reward = projects[_id].reward;
        project.result = projects[_id].result;
        project.status = projects[_id].status;
        project.lastStatusChangeAt = projects[_id].lastStatusChangeAt;
        project.changeRequests = projects[_id].changeRequests;
        return (project);
    }

    function getRating(address _address) public view returns (uint8) {
        return ratings[_address];
    }
}
