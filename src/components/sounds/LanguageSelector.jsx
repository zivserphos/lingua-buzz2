import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LANGUAGES = [
  { code: "English", flag: "🇬🇧" },
  { code: "Portuguese", flag: "🇵🇹" },
  { code: "Spanish", flag: "🇪🇸" },
  { code: "German", flag: "🇩🇪" },
  { code: "Russian", flag: "🇷🇺" },
  { code: "Arabic", flag: "🇸🇦" },
  { code: "Japanese", flag: "🇯🇵" },
  { code: "Korean", flag: "🇰🇷" },
  { code: "Vietnamese", flag: "🇻🇳" },
  { code: "Chinese", flag: "🇨🇳" },
  { code: "French", flag: "🇫🇷" },
  { code: "Italian", flag: "🇮🇹" },
  { code: "Turkish", flag: "🇹🇷" },
  { code: "Hindi", flag: "🇮🇳" },
  { code: "Hebrew", flag: "🇮🇱" }
];

export default function LanguageSelector({ currentLanguage, onLanguageChange }) {
  return (
    <Select value={currentLanguage} onValueChange={onLanguageChange}>
      <SelectTrigger className="w-[180px] bg-white/50 backdrop-blur-sm">
        <SelectValue>
          {LANGUAGES.find(l => l.code === currentLanguage)?.flag} {currentLanguage}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {LANGUAGES.map((lang) => (
          <SelectItem 
            key={lang.code} 
            value={lang.code}
            className="cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <span className="text-xl">{lang.flag}</span>
              <span>{lang.code}</span>
            </span>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}