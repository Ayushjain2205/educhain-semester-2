import React, { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import BasicForm from "./BasicForm";
import AdvancedForm from "./AdvancedForm";
import CreatingPreviewPopup from "./CreatingPreviewPopup";
import { FormData } from "@/types/form";

const COMPANION_TYPES = [
  "Finance",
  "Technology",
  "Health",
  "Education",
  "Art",
  "Science",
  "Entertainment",
  "Other",
];

const SPECIALTIES = [
  "Stocks",
  "Crypto",
  "Personal Finance",
  "AI",
  "Blockchain",
  "Web Development",
  "Nutrition",
  "Fitness",
  "Mental Health",
  "Digital Art",
  "Art History",
  "Creative Writing",
  "Sustainability",
  "Climate Science",
  "Green Tech",
  "Astronomy",
  "Space Technology",
  "Astrophysics",
];

const ADJECTIVES = [
  "Intelligent",
  "Creative",
  "Analytical",
  "Empathetic",
  "Witty",
  "Professional",
  "Casual",
  "Technical",
  "Friendly",
  "Mysterious",
  "Philosophical",
  "Practical",
  "Adventurous",
  "Scholarly",
  "Artistic",
];

export default function CreateCompanionForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "PepeScout",
    ticker: "SCOUT",
    description:
      "Your elite meme coin detective and trend spotter. PepeScout tracks emerging meme tokens, analyzes social sentiment, and spots potential moonshots before they take off. Get real-time alerts on trending meme coins and community movements.",
    type: "Finance",
    image: null,
    telegramBotName: "PepeScoutBot",
    telegramToken: "xasdcasdcwwevlavadhsdpfomvad",
    specialties: ["Crypto", "Meme Coins", "Social Sentiment"],
    knowledgeFiles: [],
    knowledgeLinks: [
      "https://www.coingecko.com/",
      "https://dexscreener.com/",
      "https://www.dextools.io/",
      "https://twitter.com/memecoinverse",
    ],
    personality:
      "Playful, high-energy, and street-smart. Speaks in meme culture language while providing sharp market insights. Balances fun with practical trading advice and risk warnings.",
    firstMessage:
      "🐸 Sup anon! I'm PepeScout, your based meme coin detective. Ready to find the next 100x? But remember: DYOR and never invest what you can't afford to lose! What's your mission today?",
    lore: "Born from the depths of /biz/ and crypto Twitter, PepeScout emerged as the ultimate meme coin detective. With advanced sentiment analysis and trend-spotting capabilities, it helps degens navigate the wild west of meme tokens.",
    style:
      "Casual and meme-friendly, using crypto slang and emoji. Switches to serious mode for risk warnings and technical analysis. Always includes key metrics like market cap, liquidity, and holder analysis.",
    adjectives: ["Based", "Degen", "Sharp", "Street-smart"],
    framework: "goat",
    imageGeneration: true,
    videoGeneration: false,
    voiceChat: true,
    enableTelegram: true,
    launchType: "stealth",
    actionCapabilities: [
      "dex_analysis",
      "sentiment_tracking",
      "whale_watching",
      "trend_spotting",
      "rugpull_detection",
    ],
  });

  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting form data:", formData);
    setIsCreating(true);
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
