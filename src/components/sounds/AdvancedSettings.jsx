import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Repeat, Lock, Unlock } from "lucide-react";
import VoiceChanger from './VoiceChanger';

export default function AdvancedSettings({
  showAdvanced,
  setShowAdvanced,
  echoCount,
  setEchoCount,
  isConfigLocked,
  setIsConfigLocked,
  isPlaying,
  onVoiceChange,
  onVoiceProcessingStart,
  processing,
  audioUrl
}) {
  // Calculate effective disabled state
  const isEffectivelyDisabled = isConfigLocked || isPlaying;
  
  return (
    <Collapsible
      open={showAdvanced}
      onOpenChange={setShowAdvanced}
      className="mt-4"
    >
      <CollapsibleTrigger className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900">
        {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        Advanced Options {isConfigLocked ? "(Locked)" : ""}
      </CollapsibleTrigger>
      
      <CollapsibleContent className="mt-3">
        <div className="bg-gray-50 rounded-lg p-4 space-y-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-gray-700">
              Echo Effect ({echoCount === 0 ? 'Off' : `${echoCount * 4} instances`})
            </label>
            <Button
              size="sm"
              variant={isConfigLocked ? "destructive" : "default"}
              onClick={() => setIsConfigLocked(!isConfigLocked)}
              disabled={isPlaying}
              className="flex items-center gap-2"
            >
              {isConfigLocked ? 
                <><Lock className="w-4 h-4" /> Unlock Configuration</> : 
                <><Unlock className="w-4 h-4" /> Lock Configuration</>}
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <Repeat className="w-4 h-4 text-gray-500" />
            <input
              type="range"
              min="0"
              max="5"
              step="1"
              value={echoCount}
              onChange={(e) => setEchoCount(parseInt(e.target.value))}
              disabled={isEffectivelyDisabled}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm font-medium w-12">
              {echoCount === 0 ? 'Off' : `${echoCount}x`}
            </span>
          </div>

          <div className={`border-t border-gray-200 pt-4 ${isEffectivelyDisabled ? "opacity-75" : ""}`}>
            <VoiceChanger
              onVoiceChange={onVoiceChange}
              onVoiceProcessingStart={onVoiceProcessingStart}
              disabled={isEffectivelyDisabled}
              loading={processing}
              audioUrl={audioUrl}
            />
          </div>

          {(isPlaying || isConfigLocked) && (
            <p className="text-xs text-amber-600 mt-2 bg-amber-50 p-2 rounded">
              {isPlaying ? "Effects cannot be changed while playing" : ""}
              {isPlaying && isConfigLocked ? " and " : ""}
              {isConfigLocked ? "settings are locked" : ""}
            </p>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
