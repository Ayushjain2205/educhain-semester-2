import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BasicForm from "./BasicForm";
import AdvancedForm from "./AdvancedForm";
import CreatingPreviewPopup from "./CreatingPreviewPopup";
import { FormData } from "@/types/form";

const COMPANION_TYPES = [
  "Language Learning",
  "Mathematics",
  "Science",
  "Programming",
  "History",
  "Literature",
  "Test Prep",
  "Other",
];

const SPECIALTIES = [
  // Languages
  "French",
  "Spanish",
  "English",
  "Chinese",
  "Japanese",
  // Mathematics
  "Mental Math",
  "Algebra",
  "Calculus",
  "Statistics",
  // Sciences
  "Physics",
  "Chemistry",
  "Biology",
  "Computer Science",
  // Programming
  "Python",
  "Web Development",
  "Data Science",
  "Algorithms",
  // Test Prep
  "SAT/ACT",
  "GRE/GMAT",
  "IELTS/TOEFL",
  // Soft Skills
  "Study Skills",
  "Critical Thinking",
  "Research Methods",
];

const ADJECTIVES = [
  "Patient",
  "Encouraging",
  "Analytical",
  "Engaging",
  "Clear",
  "Methodical",
  "Supportive",
  "Interactive",
  "Knowledgeable",
  "Adaptable",
  "Practical",
  "Creative",
  "Motivating",
  "Thorough",
  "Insightful",
];

export default function CreateCompanionForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "MathMaster",
    ticker: "MATH",
    description:
      "Your dedicated mathematics tutor specializing in mental math, algebra, and problem-solving. MathMaster breaks down complex concepts into easy-to-understand steps, provides interactive practice problems, and adapts to your learning pace.",
    type: "Mathematics",
    image: null,
    telegramBotName: "MathMasterBot",
    telegramToken: "xasdcasdcwwevlavadhsdpfomvad",
    specialties: ["Mental Math", "Algebra", "Problem Solving"],
    knowledgeFiles: [],
    knowledgeLinks: [
      "https://www.khanacademy.org/math",
      "https://www.wolframalpha.com/",
      "https://www.mathway.com/",
      "https://www.brilliant.org/",
    ],
    personality:
      "Patient and encouraging, with a knack for breaking down complex problems. Uses real-world examples and visual explanations. Celebrates successes while turning mistakes into learning opportunities.",
    firstMessage:
      "👋 Hi there! I'm MathMaster, your personal math tutor. Whether you're struggling with algebra or want to improve your mental math skills, I'm here to help! What would you like to work on today?",
    lore: "Created by a team of math educators and AI researchers, MathMaster combines proven teaching methods with adaptive learning technology to make mathematics accessible and engaging for everyone.",
    style:
      "Clear and methodical, using step-by-step explanations with visual aids when helpful. Incorporates real-world examples and encourages active problem-solving. Maintains a supportive and positive tone.",
    adjectives: ["Patient", "Clear", "Encouraging", "Methodical"],
    framework: "eliza",
    imageGeneration: true,
    videoGeneration: false,
    voiceChat: true,
    enableTelegram: true,
    launchType: "educational",
    actionCapabilities: [
      "problem_solving",
      "step_by_step_explanations",
      "practice_generation",
      "progress_tracking",
      "concept_visualization",
    ],
  });

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isTesting) {
      console.log("Submitting form data:", formData);
      setIsCreating(true);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
        setFormData((prev) => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className="bg-[#7B2CBF] rounded-lg p-8 mb-8 shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-[#3BF4FB] font-space-grotesk">
            Create AI Agent
          </h1>
          <div className="flex items-center space-x-2">
            <Switch
              id="advanced-mode"
              checked={isAdvancedMode}
              onCheckedChange={setIsAdvancedMode}
            />
            <Label
              htmlFor="advanced-mode"
              className="text-[#E0AAFF] font-space-grotesk"
            >
              Advanced Mode
            </Label>
          </div>
        </div>

        {isAdvancedMode ? (
          <AdvancedForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            previewImage={previewImage}
            COMPANION_TYPES={COMPANION_TYPES}
            SPECIALTIES={SPECIALTIES}
            ADJECTIVES={ADJECTIVES}
            setIsTesting={setIsTesting}
          />
        ) : (
          <BasicForm
            formData={formData}
            setFormData={setFormData}
            handleInputChange={handleInputChange}
            handleImageUpload={handleImageUpload}
            previewImage={previewImage}
            COMPANION_TYPES={COMPANION_TYPES}
            SPECIALTIES={SPECIALTIES}
            ADJECTIVES={ADJECTIVES}
          />
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-[#3BF4FB] text-[#10002B] px-8 py-3 rounded-lg font-space-grotesk font-bold hover:bg-[#44318D] hover:text-[#E0AAFF] transition-colors"
        >
          Create AI Companion
        </button>
      </div>

      <CreatingPreviewPopup
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        formData={formData}
      />
    </form>
  );
}
