import React, { useState } from "react";
import Image from "next/image";
import { Star, Users, MessageSquare, Wallet } from "lucide-react";
import CopyableAddress from "./CopyableAddress";

interface Agent {
  id: number;
  name: string;
  image: string;
  specialties: string[];
  rating: number;
  username: string;
  users: number;
  address: string;
  ticker: string;
  value: number;
  botUsername: string;
}

const agents: Agent[] = [
  {
    id: 1,
    name: "MathMaster",
    image: "/agents/1.jpg",
    specialties: ["Mental Math", "Algebra", "Problem Solving"],
    rating: 4.9,
    username: "@mathmaster",
    users: 8420,
    address: "0x1234567890123456789012345678901234567890",
    ticker: "$MATH",
    value: 1.25,
    botUsername: "mathmaster_bot",
  },
  {
    id: 2,
    name: "FrenchTutor",
    image: "/agents/2.jpg",
    specialties: ["Conversation", "Grammar", "Pronunciation"],
    rating: 4.7,
    username: "@frenchtutor",
    users: 7230,
    address: "0x2345678901234567890123456789012345678901",
    ticker: "$FRENCH",
    value: 0.85,
    botUsername: "frenchtutor_bot",
  },
  {
    id: 3,
    name: "ScienceGuide",
    image: "/agents/3.jpg",
    specialties: ["Physics", "Chemistry", "Biology"],
    rating: 4.8,
    username: "@scienceguide",
    users: 6150,
    address: "0x3456789012345678901234567890123456789012",
    ticker: "$SCIENCE",
    value: 1.15,
    botUsername: "scienceguide_bot",
  },
  {
    id: 4,
    name: "CodeCoach",
    image: "/agents/4.jpg",
    specialties: ["Python", "Web Dev", "Algorithms"],
    rating: 4.9,
    username: "@codecoach",
    users: 5840,
    address: "0x4567890123456789012345678901234567890123",
    ticker: "$CODE",
    value: 0.95,
    botUsername: "codecoach_bot",
  },
  {
    id: 5,
    name: "SpanishPro",
    image: "/agents/5.jpg",
    specialties: ["Conversation", "Cultural Context", "Writing"],
    rating: 4.8,
    username: "@spanishpro",
    users: 7840,
    address: "0x5678901234567890123456789012345678901234",
    ticker: "$SPANISH",
    value: 1.35,
    botUsername: "spanishpro_bot",
  },
  {
    id: 6,
    name: "HistoryExpert",
    image: "/agents/6.jpg",
    specialties: ["World History", "Civilizations", "Modern Era"],
    rating: 4.6,
    username: "@historyexpert",
    users: 9240,
    address: "0x6789012345678901234567890123456789012345",
    ticker: "$HISTORY",
    value: 0.75,
    botUsername: "historyexpert_bot",
  },
  {
    id: 7,
    name: "LitGuide",
    image: "/agents/7.jpg",
    specialties: ["Essay Writing", "Analysis", "Book Reviews"],
    rating: 4.7,
    username: "@litguide",
    users: 4920,
    address: "0x7890123456789012345678901234567890123456",
    ticker: "$LIT",
    value: 0.65,
    botUsername: "litguide_bot",
  },
  {
    id: 8,
    name: "TriviaChamp",
    image: "/agents/8.jpg",
    specialties: ["General Knowledge", "Quiz Prep", "Memory Techniques"],
    rating: 4.8,
    username: "@triviachamp",
    users: 6730,
    address: "0x8901234567890123456789012345678901234567",
    ticker: "$TRIVIA",
    value: 0.95,
    botUsername: "triviachamp_bot",
  },
];

const AiCompanionShowcase: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center p-8"
      style={{ backgroundColor: "#10002B", color: "#E0AAFF" }}
    >
      <h2
        className="text-5xl font-bold mb-12 font-permanent-marker"
        style={{ color: "#3BF4FB" }}
      >
        Discover AI Agents
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl w-full">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-[#7B2CBF] p-6 rounded-lg shadow-lg cursor-pointer transition-transform hover:scale-105"
            onClick={() => setSelectedAgent(agent)}
          >
            <div className="mb-4 relative w-full pt-[100%]">
              <Image
                src={agent.image}
                alt={agent.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <div className="flex items-center justify-between mb-4">
              <h3
                className="text-2xl font-bold font-space-grotesk"
                style={{ color: "#C77DFF" }}
              >
                {agent.name}
              </h3>
              <div className="flex items-center">
                <Star className="w-5 h-5 text-[#FFD700] mr-1" />
                <span className="font-outfit">{agent.rating.toFixed(1)}</span>
              </div>
            </div>
            <div className="mb-4">
              {agent.specialties.map((specialty, index) => (
                <span
                  key={index}
                  className="inline-block bg-[#3BF4FB] text-[#10002B] rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2 font-outfit"
                >
                  {specialty}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center font-outfit text-sm mb-2">
              <div className="flex items-center">
                <MessageSquare className="w-4 h-4 mr-1" />
                <span>{agent.username}</span>
              </div>
              <div className="flex items-center">
                <Users className="w-4 h-4 mr-1" />
                <span>{agent.users.toLocaleString()} users</span>
              </div>
            </div>
            <div className="flex justify-between items-center font-outfit text-sm mb-2">
              <div className="flex items-center">
                <Wallet className="w-4 h-4 mr-1" />
                <span>{agent.ticker}</span>
              </div>
              <span>${agent.value.toFixed(2)}</span>
            </div>
            <div className="mt-2 text-sm">
              <CopyableAddress address={agent.address} />
            </div>
          </div>
        ))}
      </div>
      {selectedAgent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-[#10002B] p-8 rounded-lg max-w-md w-full">
            <div className="mb-4 relative w-full pt-[100%]">
              <Image
                src={selectedAgent.image}
                alt={selectedAgent.name}
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            </div>
            <h3
              className="text-3xl font-bold mb-4 font-space-grotesk"
              style={{ color: "#3BF4FB" }}
            >
              {selectedAgent.name}
            </h3>
            <p className="mb-4 font-outfit">
              Specialties: {selectedAgent.specialties.join(", ")}
            </p>
            <div className="grid grid-cols-2 gap-4 mb-4 font-outfit">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-[#FFD700] mr-1" />
                <span>{selectedAgent.rating.toFixed(1)} rating</span>
              </div>
              <div className="flex items-center">
                <Users className="w-5 h-5 mr-1" />
                <span>{selectedAgent.users.toLocaleString()} users</span>
              </div>
              <div className="flex items-center">
                <MessageSquare className="w-5 h-5 mr-1" />
                <span>{selectedAgent.username}</span>
              </div>
              <div className="flex items-center">
                <Wallet className="w-5 h-5 mr-1" />
                <span>
                  {selectedAgent.ticker} ($
                  {selectedAgent.value.toFixed(2)})
                </span>
              </div>
            </div>
            <div className="mb-4 font-outfit text-sm">
              <span className="font-bold mr-2">Address:</span>
              <CopyableAddress address={selectedAgent.address} isPopup={true} />
            </div>
            <button
              className="w-full py-2 rounded font-bold text-[#10002B] font-space-grotesk"
              style={{ backgroundColor: "#3BF4FB" }}
              onClick={() =>
                window.open(
                  `https://t.me/${selectedAgent.botUsername}`,
                  "_blank"
                )
              }
            >
              Start Conversation
              <i className="fa-brands fa-telegram fa-xl ml-2"></i>
            </button>
            <button
              className="w-full mt-4 py-2 rounded font-bold font-space-grotesk"
              style={{ backgroundColor: "#7B2CBF", color: "#E0AAFF" }}
              onClick={() => setSelectedAgent(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default AiCompanionShowcase;
