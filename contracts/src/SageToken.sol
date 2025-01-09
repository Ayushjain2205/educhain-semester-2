// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract SageToken is ERC20("SageSpace Token", "SAGE"), Ownable(msg.sender) {
    uint256 public constant INITIAL_SUPPLY = 100_000_000 * 10 ** 18; // 100M tokens

    // Token distribution
    uint256 public constant TEAM_ALLOCATION = 15; // 15%
    uint256 public constant REWARDS_ALLOCATION = 40; // 40%
    uint256 public constant TREASURY_ALLOCATION = 20; // 20%
    uint256 public constant PUBLIC_SALE = 25; // 25%

    mapping(address => bool) public isTeacher;
    mapping(address => uint256) public teacherReputationScore;

    event TeacherRegistered(address indexed teacher);
    event TeacherReputationUpdated(address indexed teacher, uint256 newScore);

    constructor() {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    function registerTeacher(address _teacher) external onlyOwner {
        require(!isTeacher[_teacher], "Already registered as teacher");
        isTeacher[_teacher] = true;
        teacherReputationScore[_teacher] = 100; // Base reputation score
        emit TeacherRegistered(_teacher);
    }

    function updateTeacherReputation(
        address _teacher,
        uint256 _newScore
    ) external onlyOwner {
        require(isTeacher[_teacher], "Not a registered teacher");
        require(_newScore <= 1000, "Score exceeds maximum");
        teacherReputationScore[_teacher] = _newScore;
        emit TeacherReputationUpdated(_teacher, _newScore);
    }

    function burn(uint256 amount) public {
        _burn(msg.sender, amount);
    }
}
