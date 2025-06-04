"use client";

import { useState } from "react";
import { HelpCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface HelpTooltipProps {
  title?: string;
  content: string;
  size?: "sm" | "md" | "lg";
  position?: "top" | "bottom" | "left" | "right";
  variant?: "icon" | "button";
}

export default function HelpTooltip({
  title,
  content,
  size = "md",
  position = "top",
  variant = "icon",
}: HelpTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);

  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6",
  };

  const buttonSizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-10 w-10",
  };

  if (variant === "button") {
    return (
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={`${buttonSizeClasses[size]} rounded-full p-0 border-blue-300 hover:border-blue-500 hover:bg-blue-50`}
          >
            <HelpCircle className={`${sizeClasses[size]} text-blue-600`} />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4" side={position} align="center">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              {title && (
                <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button className="inline-flex items-center justify-center hover:bg-white/20 rounded-full p-1 transition-colors">
          <HelpCircle
            className={`${sizeClasses[size]} text-white/80 hover:text-white cursor-help`}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" side={position} align="center">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            {title && (
              <h4 className="font-semibold text-sm text-gray-900">{title}</h4>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-gray-100"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">{content}</p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
