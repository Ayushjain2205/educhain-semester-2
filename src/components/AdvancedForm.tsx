import React, { useState } from "react";
import { ImagePlus, Plus, AlertCircle, Upload, X } from "lucide-react";
import Image from "next/image";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import SimulatorPopup from "./SimulatorPopup";
import { FormData } from "@/types/form";

interface AdvancedFormProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => void;
  handleImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  previewImage: string | null;
  COMPANION_TYPES: string[];
  SPECIALTIES: string[];
  ADJECTIVES: string[];
}

const ACTION_CAPABILITIES = [
  { id: "launchMemecoin", label: "Launch Memecoin" },
  { id: "launchNFT", label: "Launch NFT" },
  { id: "trade", label: "Trade" },
  { id: "airdrop", label: "Airdrop" },
  { id: "deployNFT", label: "Deploy NFT" },
  { id: "staking", label: "Staking" },
  { id: "defi", label: "DeFi Interactions" },
  { id: "governance", label: "Governance Voting" },
  { id: "bridging", label: "Cross-chain Bridging" },
  { id: "smartContracts", label: "Deploy Smart Contracts" },
];

export default function AdvancedForm({
  formData,
  setFormData,
  handleInputChange,
  handleImageUpload,
  previewImage,
  COMPANION_TYPES,
  SPECIALTIES,
  ADJECTIVES,
}: AdvancedFormProps) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customSpecialty, setCustomSpecialty] = useState("");
  const [newLink, setNewLink] = useState("");
  const [showCustomAdjInput, setShowCustomAdjInput] = useState(false);
  const [customAdjective, setCustomAdjective] = useState("");
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s: string) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const handleAdjectiveToggle = (adjective: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      adjectives: prev.adjectives.includes(adjective)
        ? prev.adjectives.filter((a: string) => a !== adjective)
        : [...prev.adjectives, adjective],
    }));
  };

  const handleAddCustomSpecialty = () => {
    if (
      customSpecialty.trim() &&
      !formData.specialties.includes(customSpecialty.trim())
    ) {
      setFormData((prev: FormData) => ({
        ...prev,
        specialties: [...prev.specialties, customSpecialty.trim()],
      }));
      setCustomSpecialty("");
    }
  };

  const handleAddCustomAdjective = () => {
    if (
      customAdjective.trim() &&
      !formData.adjectives.includes(customAdjective.trim())
    ) {
      setFormData((prev: FormData) => ({
        ...prev,
        adjectives: [...prev.adjectives, customAdjective.trim()],
      }));
      setCustomAdjective("");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData((prev: FormData) => ({
      ...prev,
      knowledgeFiles: [...prev.knowledgeFiles, ...files],
    }));
  };

  const handleRemoveFile = (index: number) => {
    setFormData((prev: FormData) => ({
      ...prev,
      knowledgeFiles: prev.knowledgeFiles.filter(
        (_: File, i: number) => i !== index
      ),
    }));
  };

  const handleAddLink = () => {
    if (newLink.trim()) {
      setFormData((prev: FormData) => ({
        ...prev,
        knowledgeLinks: [...prev.knowledgeLinks, newLink.trim()],
      }));
      setNewLink("");
    }
  };

  const handleRemoveLink = (index: number) => {
    setFormData((prev: FormData) => ({
      ...prev,
      knowledgeLinks: prev.knowledgeLinks.filter(
        (_: string, i: number) => i !== index
      ),
    }));
  };

  const handleActionCapabilityToggle = (capability: string) => {
    setFormData((prev: FormData) => ({
      ...prev,
      actionCapabilities: prev.actionCapabilities?.includes(capability)
        ? prev.actionCapabilities.filter((c: string) => c !== capability)
        : [...(prev.actionCapabilities || []), capability],
    }));
  };

  return (
    <div className="space-y-8">
      {/* Launch Configuration */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-space-grotesk text-[#3BF4FB]">
          Launch Configuration
        </h2>
        <RadioGroup
          defaultValue="normal"
          value={formData.launchType as string}
          onValueChange={(value: string) =>
            setFormData((prev: FormData) => ({ ...prev, launchType: value }))
          }
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {[
            {
              value: "normal",
              title: "Normal Launch",
              description: "Launch a new token for your agent",
            },
            {
              value: "fair",
              title: "Fair Launch",
              description:
                "Your token will be launched randomly within a 24-hour time frame",
            },
            {
              value: "no-token",
              title: "No Token",
              description:
                "Launch your agent without a token. You can attach or launch one later.",
            },
            {
              value: "nft",
              title: "Use NFT",
              description:
                "Launch an agent for your NFT. Bring your NFT to life.",
            },
          ].map((option) => (
            <div key={option.value}>
              <RadioGroupItem
                value={option.value}
                id={option.value}
                className="peer sr-only"
              />
              <Label
                htmlFor={option.value}
                className="flex flex-col items-start justify-between rounded-lg border-2 border-muted bg-[#44318D] p-4 hover:bg-[#44318D]/80 peer-data-[state=checked]:border-[#3BF4FB] peer-data-[state=checked]:bg-[#3BF4FB]/20 [&:has([data-state=checked])]:border-[#3BF4FB] [&:has([data-state=checked])]:bg-[#3BF4FB]/20 transition-all duration-300"
              >
                <div className="space-y-1">
                  <p className="text-sm font-medium text-[#E0AAFF] peer-data-[state=checked]:text-[#3BF4FB]">
                    {option.title}
                  </p>
                  <p className="text-sm text-[#E0AAFF]/80">
                    {option.description}
                  </p>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Basic Details Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image Upload Section */}
        <div className="flex flex-col items-center justify-center">
          <div className="w-full aspect-square relative rounded-lg overflow-hidden bg-[#44318D] mb-4">
            {previewImage ? (
              <Image
                src={previewImage}
                alt="Preview"
                layout="fill"
                objectFit="cover"
                className="rounded-lg"
              />
            ) : (
              <div className="h-full flex items-center justify-center">
                <ImagePlus className="w-16 h-16 text-[#E0AAFF]" />
              </div>
            )}
          </div>
          <label className="cursor-pointer bg-[#3BF4FB] text-[#10002B] px-4 py-2 rounded-lg font-space-grotesk hover:bg-[#44318D] hover:text-[#E0AAFF] transition-colors">
            Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
              AI Companion Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
              required
            />
          </div>
          <div>
            <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
              Ticker Symbol *
            </label>
            <div className="relative">
              <span className="absolute left-4 top-2 text-[#E0AAFF]">$</span>
              <input
                type="text"
                name="ticker"
                value={formData.ticker}
                onChange={handleInputChange}
                className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 pl-8 font-outfit uppercase focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
                required
              />
            </div>
          </div>
          <div>
            <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
              Type *
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
              required
            >
              <option value="">Select a type</option>
              {COMPANION_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Framework Selection */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-space-grotesk text-[#3BF4FB]">
          Framework Selection
        </h2>
        <RadioGroup
          defaultValue="eliza"
          value={formData.framework as "eliza" | "goat" | "zerepy"}
          onValueChange={(value: "eliza" | "goat" | "zerepy") =>
            setFormData((prev: FormData) => ({ ...prev, framework: value }))
          }
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <div>
            <RadioGroupItem value="eliza" id="eliza" className="peer sr-only" />
            <Label
              htmlFor="eliza"
              className="flex flex-col items-start justify-between rounded-lg border-2 border-muted bg-[#44318D] p-4 hover:bg-[#44318D]/80 peer-data-[state=checked]:border-[#3BF4FB] [&:has([data-state=checked])]:border-[#3BF4FB]"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#E0AAFF]">
                  Eliza Framework
                </p>
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem value="goat" id="goat" className="peer sr-only" />
            <Label
              htmlFor="goat"
              className="flex flex-col items-start justify-between rounded-lg border-2 border-muted bg-[#44318D] p-4 hover:bg-[#44318D]/80 peer-data-[state=checked]:border-[#3BF4FB] [&:has([data-state=checked])]:border-[#3BF4FB]"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#E0AAFF]">
                  GOAT Framework
                </p>
              </div>
            </Label>
          </div>

          <div>
            <RadioGroupItem
              value="zerepy"
              id="zerepy"
              className="peer sr-only"
            />
            <Label
              htmlFor="zerepy"
              className="flex flex-col items-start justify-between rounded-lg border-2 border-muted bg-[#44318D] p-4 hover:bg-[#44318D]/80 peer-data-[state=checked]:border-[#3BF4FB] [&:has([data-state=checked])]:border-[#3BF4FB]"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium text-[#E0AAFF]">
                  Zerepy Framework
                </p>
              </div>
            </Label>
          </div>
        </RadioGroup>
      </div>

      {/* Personality Configuration */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-space-grotesk text-[#3BF4FB]">
          Personality Configuration
        </h2>

        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Write a brief overview of your AI Agent..."
            className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit h-32 focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
            required
          />
        </div>

        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            Personality
          </label>
          <textarea
            name="personality"
            value={formData.personality}
            onChange={handleInputChange}
            placeholder="Describe your AI Agent traits, behavior, and demeanor..."
            className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit h-24 focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
          />
        </div>

        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            First Message
          </label>
          <textarea
            name="firstMessage"
            value={formData.firstMessage}
            onChange={handleInputChange}
            placeholder="Write the first message your AI Agent will send..."
            className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit h-24 focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
          />
        </div>

        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            Lore
          </label>
          <textarea
            name="lore"
            value={formData.lore}
            onChange={handleInputChange}
            placeholder="Write the background story or lore for your AI Agent..."
            className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit h-24 focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
          />
        </div>

        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            Style
          </label>
          <textarea
            name="style"
            value={formData.style}
            onChange={handleInputChange}
            placeholder="Describe your agent's response style..."
            className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit h-24 focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
          />
        </div>

        {/* Adjectives Section */}
        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            Adjectives
          </label>
          <div className="flex flex-wrap gap-2">
            {ADJECTIVES.map((adjective) => (
              <button
                key={adjective}
                type="button"
                onClick={() => handleAdjectiveToggle(adjective)}
                className={`px-3 py-1 rounded-full font-outfit text-sm transition-colors ${
                  formData.adjectives.includes(adjective)
                    ? "bg-[#3BF4FB] text-[#10002B]"
                    : "bg-[#44318D] text-[#E0AAFF] hover:bg-[#3BF4FB] hover:text-[#10002B]"
                }`}
              >
                {adjective}
              </button>
            ))}
            {formData.adjectives
              .filter((a) => !ADJECTIVES.includes(a))
              .map((customAdjective) => (
                <button
                  key={customAdjective}
                  type="button"
                  onClick={() => handleAdjectiveToggle(customAdjective)}
                  className="bg-[#3BF4FB] text-[#10002B] px-3 py-1 rounded-full font-outfit text-sm transition-colors"
                >
                  {customAdjective}
                </button>
              ))}
            <div className="relative">
              <button
                type="button"
                onMouseEnter={() => setShowCustomAdjInput(true)}
                onMouseLeave={() => setShowCustomAdjInput(false)}
                className="px-3 py-1 rounded-full font-outfit text-sm bg-[#44318D] text-[#E0AAFF] hover:bg-[#3BF4FB] hover:text-[#10002B] transition-colors flex items-center"
              >
                <Plus size={14} className="mr-1" />
                Add Custom
              </button>
              {showCustomAdjInput && (
                <div
                  className="absolute top-0 left-0 flex"
                  onMouseEnter={() => setShowCustomAdjInput(true)}
                  onMouseLeave={() => setShowCustomAdjInput(false)}
                >
                  <input
                    type="text"
                    value={customAdjective}
                    onChange={(e) => setCustomAdjective(e.target.value)}
                    placeholder="Custom adjective"
                    className="bg-[#44318D] text-[#E0AAFF] rounded-l-full px-3 py-1 font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-[#3BF4FB] w-32"
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomAdjective}
                    className="bg-[#3BF4FB] text-[#10002B] rounded-r-full px-3 py-1 font-outfit text-sm hover:bg-[#44318D] hover:text-[#E0AAFF] transition-colors"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Specialties Section */}
      <div>
        <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
          Specialties
        </label>
        <div className="flex flex-wrap gap-2">
          {SPECIALTIES.map((specialty) => (
            <button
              key={specialty}
              type="button"
              onClick={() => handleSpecialtyToggle(specialty)}
              className={`px-3 py-1 rounded-full font-outfit text-sm transition-colors ${
                formData.specialties.includes(specialty)
                  ? "bg-[#3BF4FB] text-[#10002B]"
                  : "bg-[#44318D] text-[#E0AAFF] hover:bg-[#3BF4FB] hover:text-[#10002B]"
              }`}
            >
              {specialty}
            </button>
          ))}
          {formData.specialties
            .filter((s) => !SPECIALTIES.includes(s))
            .map((customSpecialty) => (
              <button
                key={customSpecialty}
                type="button"
                onClick={() => handleSpecialtyToggle(customSpecialty)}
                className="bg-[#3BF4FB] text-[#10002B] px-3 py-1 rounded-full font-outfit text-sm transition-colors"
              >
                {customSpecialty}
              </button>
            ))}
          <div className="relative">
            <button
              type="button"
              onMouseEnter={() => setShowCustomInput(true)}
              onMouseLeave={() => setShowCustomInput(false)}
              className="px-3 py-1 rounded-full font-outfit text-sm bg-[#44318D] text-[#E0AAFF] hover:bg-[#3BF4FB] hover:text-[#10002B] transition-colors flex items-center"
            >
              <Plus size={14} className="mr-1" />
              Add Custom
            </button>
            {showCustomInput && (
              <div
                className="absolute top-0 left-0 flex"
                onMouseEnter={() => setShowCustomInput(true)}
                onMouseLeave={() => setShowCustomInput(false)}
              >
                <input
                  type="text"
                  value={customSpecialty}
                  onChange={(e) => setCustomSpecialty(e.target.value)}
                  placeholder="Custom specialty"
                  className="bg-[#44318D] text-[#E0AAFF] rounded-l-full px-3 py-1 font-outfit text-sm focus:outline-none focus:ring-2 focus:ring-[#3BF4FB] w-32"
                />
                <button
                  type="button"
                  onClick={handleAddCustomSpecialty}
                  className="bg-[#3BF4FB] text-[#10002B] rounded-r-full px-3 py-1 font-outfit text-sm hover:bg-[#44318D] hover:text-[#E0AAFF] transition-colors"
                >
                  Add
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Media Abilities Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-space-grotesk text-[#3BF4FB]">
          Media Abilities
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="image-generation"
              checked={formData.imageGeneration}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  imageGeneration: checked === true,
                }))
              }
            />
            <label
              htmlFor="image-generation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#E0AAFF]"
            >
              Image Generation
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="video-generation"
              checked={formData.videoGeneration}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  videoGeneration: checked === true,
                }))
              }
            />
            <label
              htmlFor="video-generation"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#E0AAFF]"
            >
              Video Generation
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="voice-chat"
              checked={formData.voiceChat}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setFormData((prev: FormData) => ({
                  ...prev,
                  voiceChat: checked === true,
                }))
              }
            />
            <label
              htmlFor="voice-chat"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-[#E0AAFF]"
            >
              Voice Chat
            </label>
          </div>
        </div>
      </div>

      {/* Action Capabilities Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-space-grotesk text-[#3BF4FB]">
          Action Capabilities
        </h2>
        <div className="flex flex-wrap gap-2">
          {ACTION_CAPABILITIES.map((capability) => (
            <button
              key={capability.id}
              type="button"
              onClick={() => handleActionCapabilityToggle(capability.id)}
              className={`px-3 py-1 rounded-full font-outfit text-sm transition-colors ${
                formData.actionCapabilities?.includes(capability.id)
                  ? "bg-[#3BF4FB] text-[#10002B]"
                  : "bg-[#44318D] text-[#E0AAFF] hover:bg-[#3BF4FB] hover:text-[#10002B]"
              }`}
            >
              {capability.label}
            </button>
          ))}
        </div>
      </div>

      {/* Knowledge Base Section */}
      <div className="space-y-6">
        <h2 className="text-xl font-bold font-space-grotesk text-[#3BF4FB]">
          Knowledge Base
        </h2>
        {/* File Upload */}
        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            Upload Files
          </label>
          <div className="flex items-center space-x-2">
            <label className="cursor-pointer bg-[#3BF4FB] text-[#10002B] px-4 py-2 rounded-lg font-space-grotesk hover:bg-[#44318D] hover:text-[#E0AAFF] transition-colors">
              <Upload className="inline-block mr-2" size={18} />
              Choose Files
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
            <span className="text-[#E0AAFF] font-outfit">
              {formData.knowledgeFiles.length} file(s) selected
            </span>
          </div>
          {formData.knowledgeFiles.length > 0 && (
            <ul className="mt-2 space-y-1">
              {formData.knowledgeFiles.map((file: File, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-[#44318D] text-[#E0AAFF] rounded px-3 py-2"
                >
                  <span className="font-outfit truncate">{file.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(index)}
                    className="text-[#E0AAFF] hover:text-[#3BF4FB]"
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Link Input */}
        <div>
          <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
            Add Links
          </label>
          <div className="flex space-x-2">
            <input
              type="url"
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              placeholder="https://example.com"
              className="flex-grow bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
            />
            <button
              type="button"
              onClick={handleAddLink}
              className="bg-[#3BF4FB] text-[#10002B] px-4 py-2 rounded-lg font-space-grotesk hover:bg-[#44318D] hover:text-[#E0AAFF] transition-colors"
            >
              Add
            </button>
          </div>
          {formData.knowledgeLinks.length > 0 && (
            <ul className="mt-2 space-y-1">
              {formData.knowledgeLinks.map((link: string, index: number) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-[#44318D] text-[#E0AAFF] rounded px-3 py-2"
                >
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-outfit truncate hover:text-[#3BF4FB]"
                  >
                    {link}
                  </a>
                  <button
                    type="button"
                    onClick={() => handleRemoveLink(index)}
                    className="text-[#E0AAFF] hover:text-[#3BF4FB]"
                  >
                    <X size={18} />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Telegram Integration Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold font-space-grotesk text-[#3BF4FB]">
          Telegram Integration
        </h2>
        <div className="space-y-4">
          <div>
            <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
              Bot Name
            </label>
            <input
              type="text"
              name="telegramBotName"
              value={formData.telegramBotName}
              onChange={handleInputChange}
              className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
            />
          </div>
          <div>
            <label className="block text-[#E0AAFF] font-space-grotesk mb-2">
              Bot Token
            </label>
            <input
              type="password"
              name="telegramToken"
              value={formData.telegramToken}
              onChange={handleInputChange}
              className="w-full bg-[#44318D] text-[#E0AAFF] rounded-lg px-4 py-2 font-outfit focus:outline-none focus:ring-2 focus:ring-[#3BF4FB]"
            />
          </div>
          <div className="flex items-start space-x-2 text-[#E0AAFF]">
            <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
            <p className="text-sm font-outfit">
              You can get your bot token from the{" "}
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#3BF4FB] hover:underline"
              >
                BotFather
              </a>
              . Make sure to keep it secure and never share it publicly.
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => setIsSimulatorOpen(true)}
          className="bg-[#3BF4FB] text-[#10002B] px-8 py-3 rounded-lg font-space-grotesk font-bold hover:bg-[#44318D] hover:text-[#E0AAFF] transition-colors"
        >
          Test AI Agent
        </Button>
      </div>
      <SimulatorPopup
        isOpen={isSimulatorOpen}
        onClose={() => setIsSimulatorOpen(false)}
        aiName={formData.name || "AI Companion"}
        firstMessage={
          formData.firstMessage || "Hello! How can I assist you today?"
        }
        personality={formData.personality || "friendly and helpful"}
        avatarUrl={previewImage || undefined}
      />
    </div>
  );
}
