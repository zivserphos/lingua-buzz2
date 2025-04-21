import React, { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const AVAILABLE_VOICES = [
  { id: 'donald-trump', name: 'Donald Trump', icon: '🇺🇸' },
  { id: 'barak-obama', name: 'Barack Obama', icon: '🎤' },
  { id: 'dj-khaled', name: 'DJ Khaled', icon: '🎵' }
];

export default function VoiceChanger({ onVoiceChange, onVoiceProcessingStart, disabled, loading, audioUrl }) {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);

  const processVoiceChange = async (voiceId) => {
    if (!audioUrl) {
      setError('No audio URL provided');
      return;
    }

    try {
      setProcessing(true);
      setSelectedVoice(voiceId);
      setError(null);
      
      // Notify parent component that processing has started
      if (onVoiceProcessingStart) {
        onVoiceProcessingStart();
      }

      console.log(`Processing voice change to ${voiceId} for audio ${audioUrl}`);

      // 1. Create audio file changer session
      const createResponse = await fetch('https://voiceai.fineshare.com/api/createaudiofilechanger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: voiceId,
          engine: "other"
        })
      });

      const createData = await createResponse.json();
      console.log('Create response:', createData);
      
      const { uuid } = createData;
      if (!uuid) throw new Error('Failed to get UUID');

      // 2. Upload the audio file
      const audioResponse = await fetch(audioUrl);
      const audioBlob = await audioResponse.blob();
      
      const formData = new FormData();
      formData.append('audioFile', audioBlob, 'audio.mp3');

      console.log(`Uploading audio to ${uuid}`);
      const uploadResponse = await fetch(`https://ovc.fineshare.com/api/uploadaudiofile/${uuid}`, {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.text();
        console.error('Upload response:', uploadError);
        throw new Error(`Failed to upload audio: ${uploadResponse.status}`);
      }

      console.log('Audio uploaded successfully');

      // 3. Process the voice change
      const changeResponse = await fetch('https://voiceai.fineshare.com/api/changeaudiofile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          voice: voiceId,
          uuid,
          pitch: 0,
          pitch_control: "rmvpe",
          audioName: "audio.mp3",
          duration: 1,
          platform: "web-app-ovc",
          outputFormat: "mp3",
          engine: "other",
          auto_f0_adjust: true,
          step: 10
        })
      });

      const changeResult = await changeResponse.json();
      console.log('Change result:', changeResult);
      
      if (!changeResult.audioUrl) throw new Error('No audio URL received');

      // 4. Get the final audio URL
      const finalAudioUrl = `https://dlaudio.fineshare.net/ovc/${changeResult.audioUrl}`;
      console.log('Final audio URL:', finalAudioUrl);
      
      // Call the parent callback with the new audio URL
      onVoiceChange(finalAudioUrl);

    } catch (error) {
      console.error('Voice change error:', error);
      setError(error.message || 'Failed to change voice');
      // Reset selection on error
      setSelectedVoice(null);
    } finally {
      setProcessing(false);
    }
  };

  const handleSelectVoice = (voiceId) => {
    setSelectedVoice(voiceId);
    // Don't process immediately - wait for button click
  };

  const applyVoiceChange = () => {
    if (selectedVoice) {
      processVoiceChange(selectedVoice);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-gray-500" />
          Voice Changer
        </label>
        
        <div className="flex gap-3 mt-2">
          <Select
            value={selectedVoice}
            onValueChange={handleSelectVoice}
            disabled={disabled || processing || loading || !audioUrl}
            className="flex-1"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a voice" />
            </SelectTrigger>
            <SelectContent>
              {AVAILABLE_VOICES.map((voice) => (
                <SelectItem
                  key={voice.id}
                  value={voice.id}
                >
                  <div className="flex items-center gap-2">
                    <span>{voice.icon}</span>
                    <span>{voice.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Button 
            onClick={applyVoiceChange} 
            disabled={!selectedVoice || processing || disabled}
            className={processing ? "bg-purple-600" : ""}
          >
            {processing ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing...
              </>
            ) : (
              "Apply Voice"
            )}
          </Button>
        </div>
      </div>
      
      {error && (
        <p className="text-xs text-red-600 mt-1">
          Error: {error}
        </p>
      )}
      
      {processing && (
        <p className="text-xs text-amber-600">
          Processing voice change... This may take up to a minute.
        </p>
      )}
      
      {!audioUrl && (
        <p className="text-xs text-gray-500">
          Load a sound first to use voice changer
        </p>
      )}
    </div>
  );
}
