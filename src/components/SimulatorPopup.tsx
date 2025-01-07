import React from "react";
import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import AICompanionSimulator from "./AICompanionSimulator";

interface SimulatorPopupProps {
  isOpen: boolean;
  onClose: () => void;
  aiName: string;
  firstMessage: string;
  personality: string;
  avatarUrl?: string;
}

export default function SimulatorPopup({
  isOpen,
  onClose,
  aiName,
  firstMessage,
  personality,
}: SimulatorPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] bg-[#44318D] p-0 rounded-t-lg overflow-hidden">
        <DialogHeader className="p-4 bg-[#3BF4FB] flex flex-row items-center justify-between">
          <DialogTitle className="text-[#10002B] font-space-grotesk text-xl">
            Test Your AI Agent
          </DialogTitle>
        </DialogHeader>
        <AICompanionSimulator
          aiName={aiName}
          firstMessage={firstMessage}
          personality={personality}
        />
      </DialogContent>
    </Dialog>
  );
}
