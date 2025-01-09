// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract LearningRewards is Ownable, ReentrancyGuard {
    IERC20 public sageToken;

    struct Achievement {
        string name;
        string category;
        uint256 rewardAmount;
        uint256 requiredProof; // e.g., test score, completion time
    }

    struct StudentProgress {
        uint256 totalRewards;
        uint256 achievementsCompleted;
        mapping(uint256 => bool) completedAchievements;
    }

    mapping(uint256 => Achievement) public achievements;
    mapping(address => StudentProgress) public studentProgress;
    mapping(address => bool) public authorizedAgents;

    uint256 public nextAchievementId = 1;

    event AchievementCreated(
        uint256 indexed id,
        string name,
        uint256 rewardAmount
    );
    event AchievementCompleted(
        address indexed student,
        uint256 indexed achievementId,
        uint256 reward
    );
    event AgentAuthorized(address indexed agent);
    event AgentDeauthorized(address indexed agent);

    constructor(address _sageToken) {
        sageToken = IERC20(_sageToken);
    }

    modifier onlyAuthorizedAgent() {
        require(authorizedAgents[msg.sender], "Not authorized agent");
        _;
    }

    function authorizeAgent(address _agent) external onlyOwner {
        authorizedAgents[_agent] = true;
        emit AgentAuthorized(_agent);
    }

    function deauthorizeAgent(address _agent) external onlyOwner {
        authorizedAgents[_agent] = false;
        emit AgentDeauthorized(_agent);
    }

    function createAchievement(
        string memory _name,
        string memory _category,
        uint256 _rewardAmount,
        uint256 _requiredProof
    ) external onlyOwner {
        achievements[nextAchievementId] = Achievement({
            name: _name,
            category: _category,
            rewardAmount: _rewardAmount,
            requiredProof: _requiredProof
        });

        emit AchievementCreated(nextAchievementId, _name, _rewardAmount);
        nextAchievementId++;
    }

    function completeAchievement(
        address _student,
        uint256 _achievementId,
        uint256 _proof
    ) external onlyAuthorizedAgent nonReentrant {
        Achievement memory achievement = achievements[_achievementId];
        require(
            _proof >= achievement.requiredProof,
            "Proof requirement not met"
        );
        require(
            !studentProgress[_student].completedAchievements[_achievementId],
            "Achievement already completed"
        );

        studentProgress[_student].completedAchievements[_achievementId] = true;
        studentProgress[_student].achievementsCompleted++;
        studentProgress[_student].totalRewards += achievement.rewardAmount;

        require(
            sageToken.transfer(_student, achievement.rewardAmount),
            "Reward transfer failed"
        );
        emit AchievementCompleted(
            _student,
            _achievementId,
            achievement.rewardAmount
        );
    }

    function getStudentProgress(
        address _student
    )
        external
        view
        returns (uint256 totalRewards, uint256 achievementsCompleted)
    {
        StudentProgress storage progress = studentProgress[_student];
        return (progress.totalRewards, progress.achievementsCompleted);
    }

    function hasCompletedAchievement(
        address _student,
        uint256 _achievementId
    ) external view returns (bool) {
        return studentProgress[_student].completedAchievements[_achievementId];
    }
}
