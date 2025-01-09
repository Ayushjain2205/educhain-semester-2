// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract AgentRegistry is Ownable(msg.sender) {
    IERC20 public sageToken;

    struct Agent {
        string name;
        string category;
        address creator;
        uint256 price;
        string[] specialties;
        bool isActive;
        uint256 studentsCount;
        uint256 rating;
    }

    mapping(uint256 => Agent) public agents;
    mapping(address => uint256[]) public creatorAgents;
    mapping(address => uint256[]) public studentSubscriptions;

    uint256 public nextAgentId = 1;
    uint256 public registrationFee = 100 * 10 ** 18;

    event AgentRegistered(
        uint256 indexed agentId,
        string name,
        address creator
    );
    event AgentSubscribed(uint256 indexed agentId, address indexed student);
    event AgentRated(
        uint256 indexed agentId,
        address indexed student,
        uint256 rating
    );

    constructor(address _sageToken) {
        sageToken = IERC20(_sageToken);
    }

    function registerAgent(
        string memory _name,
        string memory _category,
        uint256 _price,
        string[] memory _specialties
    ) external {
        require(
            sageToken.transferFrom(msg.sender, address(this), registrationFee),
            "Fee transfer failed"
        );

        agents[nextAgentId] = Agent({
            name: _name,
            category: _category,
            creator: msg.sender,
            price: _price,
            specialties: _specialties,
            isActive: true,
            studentsCount: 0,
            rating: 0
        });

        creatorAgents[msg.sender].push(nextAgentId);
        emit AgentRegistered(nextAgentId, _name, msg.sender);
        nextAgentId++;
    }

    function subscribeToAgent(uint256 _agentId) external {
        require(agents[_agentId].isActive, "Agent not active");
        require(
            sageToken.transferFrom(
                msg.sender,
                agents[_agentId].creator,
                agents[_agentId].price
            ),
            "Payment failed"
        );

        studentSubscriptions[msg.sender].push(_agentId);
        agents[_agentId].studentsCount++;
        emit AgentSubscribed(_agentId, msg.sender);
    }

    function rateAgent(uint256 _agentId, uint256 _rating) external {
        require(_rating <= 1000, "Invalid rating");
        bool isSubscribed = false;
        for (uint i = 0; i < studentSubscriptions[msg.sender].length; i++) {
            if (studentSubscriptions[msg.sender][i] == _agentId) {
                isSubscribed = true;
                break;
            }
        }
        require(isSubscribed, "Not subscribed to agent");

        Agent storage agent = agents[_agentId];
        agent.rating = (_rating + agent.rating) / 2;
        emit AgentRated(_agentId, msg.sender, _rating);
    }

    function getStudentAgents(
        address _student
    ) external view returns (uint256[] memory) {
        return studentSubscriptions[_student];
    }

    function getCreatorAgents(
        address _creator
    ) external view returns (uint256[] memory) {
        return creatorAgents[_creator];
    }
}
