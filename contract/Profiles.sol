// SPDX-License-Identifier: MIT
pragma solidity 0.8.11;

contract Profiles {

    struct Profile {
        string avatar;
        string username;
        string skills;
        string[] languages;
        uint16 rate;
        uint8 availability;
        uint256 createdAt;
        uint256 updatedAt;
    }

    struct ReceivedProfile {
        string avatar;
        string username;
        string skills;
        string[] languages;
        uint16 rate;
        uint8 availability;
    }


    mapping(address => Profile) internal profiles;

    // Events

    event ProfileAdded(Profile _profile);
    event ProfileUpdated(Profile _profile);
    event ProfileDeleted(Profile _profile);


    function addProfile(ReceivedProfile calldata _newProfile)
        external
        returns (bool)
    {
        require(bytes(_newProfile.username).length > 0, "Username is required.");
        profiles[msg.sender].avatar = _newProfile.avatar;
        profiles[msg.sender].username = _newProfile.username;
        profiles[msg.sender].skills = _newProfile.skills;
        string[] memory lang = _newProfile.languages;
        profiles[msg.sender].languages = lang;
        profiles[msg.sender].rate = _newProfile.rate;
        profiles[msg.sender].availability = _newProfile.availability;
        profiles[msg.sender].createdAt = block.timestamp;
        emit ProfileAdded(profiles[msg.sender]);
        return true;
    }

    function updateProfile(ReceivedProfile calldata _newProfile)
        external
        returns (bool)
    {
        require(bytes(_newProfile.username).length > 0, "Username is required.");
        profiles[msg.sender].avatar = _newProfile.avatar;
        profiles[msg.sender].username = _newProfile.username;
        profiles[msg.sender].skills = _newProfile.skills;
        string[] memory lang = _newProfile.languages;
        profiles[msg.sender].languages = lang;
        profiles[msg.sender].rate = _newProfile.rate;
        profiles[msg.sender].availability = _newProfile.availability;
        profiles[msg.sender].updatedAt = block.timestamp;
        emit ProfileUpdated(profiles[msg.sender]);
        return true;
    }

    function deleteProfile()
        external
        returns (bool)
    {
        delete profiles[msg.sender];
        emit ProfileDeleted(profiles[msg.sender]);
        return true;
    }
}
