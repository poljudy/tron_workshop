// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Platform is Ownable, ReentrancyGuard {

    enum ProjectType {
        FCFS,
        AuthorSelected
    }

    struct Project {
        uint256 id;
        string title;
        string description;
        address payable author;
        address payable assignee;
        Candidate[] candidates;
        uint256 createdAt;
        uint256 completedAt;
        ProjectType projectType;
        uint256 reward;
        string result;
    }

    struct ReceivedProject {
        string title;
        string description;
        ProjectType projectType;
        uint256 reward;
    }

    struct Candidate {
        address candidate;
        uint8 rating;
    }

    uint8 public platformFeePercentage = 1; // Platform fee in %
    uint256 public totalFees;
    uint256 projectsCounter = 0;
    mapping(uint256 => Project) projects;
    mapping(address => uint8) ratings;

    // Events

    event ProjectAdded(Project _project);
    event ProjectUpdated(Project _project);
    event ProjectDeleted(uint256 _id);
    event FeeUpdated(uint8 _fee);

    // Modifiers

    modifier onlyAuthor(uint256 _id) {
        require(
            msg.sender == projects[_id].author,
            "Only author can perform this transaction."
        );
        _;
    }

    modifier onlyAssignee(uint256 _id) {
        require(
            msg.sender == projects[_id].assignee,
            "Only assignee can perform this transaction."
        );
        _;
    }

    modifier onlyAuthorOrAssignee(uint256 _id) {
        require(
            msg.sender == projects[_id].author ||
                msg.sender == projects[_id].assignee,
            "Only author or assignee can perform this transaction."
        );
        _;
    }

    modifier projectExists(uint256 _id) {
        require(projects[_id].author != address(0), "Project does not exist.");
        _;
    }

    modifier isAssigned(uint256 _id) {
        require(
            projects[_id].assignee != address(0),
            "Project is not assigned yet."
        );
        _;
    }

    modifier isCompleted(uint256 _id) {
        require(projects[_id].completedAt != 0, "Project is not completed yet.");
        _;
    }

    modifier isFCFS(uint256 _id) {
        require(
            projects[_id].projectType == ProjectType.FCFS,
            "Project type is not FCFS."
        );
        _;
    }

    modifier isAuthorSelected(uint256 _id) {
        require(
            projects[_id].projectType == ProjectType.AuthorSelected,
            "Project type is not AuthorSelected."
        );
        _;
    }

    // Helper functions

    function isAddressApplied(uint256 _id, address _address)
        public
        view
        returns (bool)
    {
        for (uint256 i = 0; i < projects[_id].candidates.length; i++) {
            if (projects[_id].candidates[i].candidate == _address) {
                return true;
            }
        }
        return false;
    }

    function calculateRating(uint _prevRating, uint8 _newRating) internal pure returns (uint8) {
        if (_prevRating == 0) {
            return _newRating;
        }
        return uint8(_prevRating + _newRating) / 2;
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
        uint256 platformFee = (_newProject.reward / 100) *
            platformFeePercentage;
        uint256 amount = _newProject.reward + platformFee;
        require(msg.value == amount, "Wrong amount submitted.");
        totalFees += platformFee;
        uint256 _id = projectsCounter;
        projects[_id].id = _id;
        projects[_id].title = _newProject.title;
        projects[_id].description = _newProject.description;
        projects[_id].author = payable(msg.sender);
        projects[_id].createdAt = block.timestamp;
        projects[_id].reward = _newProject.reward;
        projects[_id].projectType = _newProject.projectType;
        projectsCounter++;
        emit ProjectAdded(projects[_id]);
        return true;
    }

    function assignProject(uint256 _id, address payable _candidateAddress)
        external
        projectExists(_id)
        onlyAuthor(_id)
        isAuthorSelected(_id)
        returns (bool)
    {
        require(_candidateAddress != address(0), "Zero address submitted.");
        require(
            projects[_id].assignee == address(0),
            "Project already assigned."
        );
        require(
            isAddressApplied(_id, _candidateAddress),
            "Address didn't apply to the project."
        );
        projects[_id].assignee = _candidateAddress;
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function unassignProject(uint256 _id)
        public
        projectExists(_id)
        isAssigned(_id)
        onlyAuthorOrAssignee(_id)
        returns (bool)
    {
        delete projects[_id].assignee;
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function applyForProject(uint256 _id)
        external
        projectExists(_id)
        returns (bool)
    {
        require(
            projects[_id].assignee == address(0),
            "Project already assigned."
        );
        if (projects[_id].projectType == ProjectType.FCFS) {
            projects[_id].assignee = payable(msg.sender);
            emit ProjectUpdated(projects[_id]);
        } else {
            projects[_id].candidates.push(Candidate(msg.sender, ratings[msg.sender]));
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
        require(bytes(projects[_id].result).length == 0, "Result already submitted.");
        projects[_id].result = _result;
        emit ProjectUpdated(projects[_id]);
        return true;
    }

    function completeProject(uint256 _id, uint8 _rating)
        external
        projectExists(_id)
        onlyAuthor(_id)
        isAssigned(_id)
        nonReentrant
        returns (bool)
    {
        require(projects[_id].completedAt == 0, "Project already completed.");
        require(bytes(projects[_id].result).length > 0, "Result is required.");
        require(_rating <= 5, "Rating is invalid.");
        projects[_id].completedAt = block.timestamp;
        ratings[projects[_id].assignee] = calculateRating(ratings[projects[_id].assignee], _rating);
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
        (bool success, ) = projects[_id].author.call{value: projects[_id].reward}("");
        require(success, "Tranfer failed.");
        projectsCounter = projectsCounter - 1;
        delete projects[_id];
        emit ProjectDeleted(_id);
        return true;
    }

    function withdrawFees() public payable onlyOwner nonReentrant returns (bool) {
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
        Project[] memory projectList = new Project[](projectsCounter);
        for (uint256 i = 0; i < projectsCounter; i++) {
            if (projects[i].author != address(0)) {
                projectList[i] = projects[i];
            }
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
        project.title = projects[_id].title;
        project.description = projects[_id].description;
        project.projectType = projects[_id].projectType;
        project.author = projects[_id].author;
        project.candidates = projects[_id].candidates;
        project.assignee = projects[_id].assignee;
        project.createdAt = projects[_id].createdAt;
        project.completedAt = projects[_id].completedAt;
        project.reward = projects[_id].reward;
        project.result = projects[_id].result;
        return (project);
    }

    function getRating(address _address)
        public
        view
        returns (uint8)
    {
        return ratings[_address];
    }
}
