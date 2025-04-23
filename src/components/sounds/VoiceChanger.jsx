import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import VoiceSelector from "./VoiceSelector";

import spongebobImage from "@/assets/spongebob.webp";
import barackObamaImage from "@/assets/barack-obama.webp";
import djKhaledImage from "@/assets/dj-khaled.webp";
import peterGriffinImage from "@/assets/peter-griffin.webp";
import joeBidenImage from "@/assets/joe-biden.webp";
import ishowspeedImage from "@/assets/ishowspeed.webp";
import squidwardImage from "@/assets/squidward.webp";
import patrickStarImage from "@/assets/patrick-star.webp";
import DonuldTrump from "@/assets/donald-trump.webp";

const AVAILABLE_VOICES = [
  { id: 'donald-trump', name: 'Donald Trunp', icon: '🇺🇸', image: DonuldTrump },
  { id: 'joe-biden', name: 'Joe Biden', icon: '🇺🇸', image: joeBidenImage },
  { id: 'barack-obama', name: 'Barack Obama', icon: '🎤', image: barackObamaImage },
  { id: 'spongebob', name: 'Spongebob', icon: '🧽', image: spongebobImage },
  { id: 'patrick-star', name: 'Patrick Star', icon: '⭐', image: patrickStarImage },
  { id: 'squidward', name: 'Squidward', icon: '🦑', image: squidwardImage },
  { id: 'peter-griffin', name: 'Peter Griffin', icon: '🍺', image: peterGriffinImage },
  { id: 'ishowspeed', name: 'IShowSpeed', icon: '🎮', image: ishowspeedImage },
  { id: 'dj-khaled', name: 'DJ Khaled', icon: '🎵', image: djKhaledImage },
];

// Permanent auth token
const PERMANENT_TOKEN = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJiMzc1MzBmMy01Y2UzLTQwZjEtODY2Ni02ODQ2ZWUyZjUzMGMiLCJ1c2VyQWNjb3VudCI6InppdmZyb21pc3JhZWxAZ21haWwuY29tIn0.8zVZjTwVHrnKPfkpUqbf19j_ym4lOyt_Y7V8090IrhY';

export default function VoiceChanger({ onVoiceChange, onVoiceProcessingStart, disabled, loading, audioUrl }) {
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  const [pollCount, setPollCount] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('');
  const [isVoiceSelectorOpen, setIsVoiceSelectorOpen] = useState(false);

  // Reset state when disabled changes (e.g., when locked)
  useEffect(() => {
    if (disabled && processing) {
      setProcessing(false);
      setProcessingStatus('');
      setError("Processing canceled - settings are locked");
    }
  }, [disabled]);

  // Poll for audio completion
  const pollForAudioCompletion = async (uuid, maxAttempts = 20) => {
    if (pollCount >= maxAttempts) {
      throw new Error('Audio processing timed out');
    }

    setPollCount(prev => prev + 1);
    setProcessingStatus(`Checking audio status (attempt ${pollCount + 1}/${maxAttempts})...`);

    try {
      // Check if the audio is ready at the destination
      const checkResponse = await fetch(`https://dlaudio.fineshare.net/ovc/${uuid}.mp3`, {
        method: 'HEAD'
      });

      if (checkResponse.ok) {
        // Audio is ready!
        return `https://dlaudio.fineshare.net/ovc/${uuid}.mp3`;
      } else {
        // Audio isn't ready yet
        await new Promise(resolve => setTimeout(resolve, 3000)); // Wait 3 seconds between attempts
        return pollForAudioCompletion(uuid, maxAttempts);
      }
    } catch (err) {
      console.log('Still waiting for audio to be ready...');
      await new Promise(resolve => setTimeout(resolve, 3000));
      return pollForAudioCompletion(uuid, maxAttempts);
    }
  };

  const processVoiceChange = async (voiceId) => {
    // Don't allow processing when disabled
    if (disabled) {
      setError('Voice changer is locked');
      return;
    }

    if (!audioUrl) {
      setError('No audio URL provided');
      return;
    }

    try {
      setProcessing(true);
      setPollCount(0);
      setSelectedVoice(voiceId);
      setError(null);
      setProcessingStatus('Initializing voice change...');
      
      // Notify parent component that processing has started
      if (onVoiceProcessingStart) {
        onVoiceProcessingStart();
      }

      console.log(`Processing voice change to ${voiceId} for audio ${audioUrl}`);

      // 1. Create audio file changer session with auth
      setProcessingStatus('Creating audio change session...');
      const createResponse = await fetch('https://voiceai.fineshare.com/api/createaudiofilechanger', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERMANENT_TOKEN}`
        },
        body: JSON.stringify({
          voice: voiceId,
          engine: "other"
        })
      });

      const createData = await createResponse.json();
      console.log('Create response:', createData);
      
      const { uuid } = createData;
      if (!uuid) throw new Error('Failed to get UUID');

      // 2. Upload the audio file with auth
      setProcessingStatus('Uploading audio file...');
      const audioResponse = await fetch(audioUrl);
      const audioBlob = await audioResponse.blob();
      
      const formData = new FormData();
      formData.append('audioFile', audioBlob, 'audio.mp3');

      console.log(`Uploading audio to ${uuid}`);
      const uploadResponse = await fetch(`https://ovc.fineshare.com/api/uploadaudiofile/${uuid}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${PERMANENT_TOKEN}`
        },
        body: formData
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.text();
        console.error('Upload response:', uploadError);
        throw new Error(`Failed to upload audio: ${uploadResponse.status}`);
      }

      console.log('Audio uploaded successfully');

      // 3. Process the voice change with auth
      setProcessingStatus('Processing voice change...');
      const changeResponse = await fetch('https://voiceai.fineshare.com/api/changeaudiofile', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${PERMANENT_TOKEN}`,
          'client': 'fv-file-changer'
        },
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
      
      // CRITICAL FIX: Poll for the audio at the correct URL using the UUID
      setProcessingStatus('Waiting for audio to be ready...');
      const finalAudioUrl = await pollForAudioCompletion(uuid);
      console.log('Final audio URL:', finalAudioUrl);
      
      // Check if we're still allowed to update (not disabled)
      if (disabled) {
        setError("Settings were locked during processing - result discarded");
        return;
      }
      
      // Call the parent callback with the new audio URL
      onVoiceChange(finalAudioUrl);

    } catch (err) {
      console.error('Voice change error:', err);
      setError(err.message || 'Failed to change voice');
      // Reset selection on error
      setSelectedVoice(null);
    } finally {
      setProcessing(false);
      setProcessingStatus('');
      setPollCount(0);
    }
  };

  const handleSelectVoice = (voiceId) => {
    if (disabled) {
      setError('Voice changer is locked');
      return;
    }
    setSelectedVoice(voiceId);
    setIsVoiceSelectorOpen(false);
  };

  const applyVoiceChange = () => {
    if (disabled) {
      setError('Voice changer is locked');
      return;
    }
    if (selectedVoice) {
      processVoiceChange(selectedVoice);
    }
  };
  
  const selectedVoiceObject = AVAILABLE_VOICES.find(voice => voice.id === selectedVoice);

 return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
          <Mic2 className="w-4 h-4 text-gray-500" />
          Voice Changer {disabled ? "(Locked)" : ""}
        </label>
        
        <div className="flex gap-3 mt-2">
          <Button
            variant="outline"
            type="button"
            disabled={disabled || processing || loading || !audioUrl}
            className="flex-1 h-10 justify-between"
            onClick={() => setIsVoiceSelectorOpen(true)}
          >
            {selectedVoiceObject ? (
              <div className="flex items-center gap-2">
                <span>{selectedVoiceObject.icon}</span>
                <span>{selectedVoiceObject.name}</span>
              </div>
            ) : (
              <span className="text-gray-500">Select a voice</span>
            )}
          </Button>
          
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
      
      {/* Voice Selector Dialog */}
      <VoiceSelector
        voices={AVAILABLE_VOICES}
        isOpen={isVoiceSelectorOpen}
        onClose={() => setIsVoiceSelectorOpen(false)}
        onSelectVoice={handleSelectVoice}
        selectedVoice={selectedVoice}
      />
      
      {error && (
        <p className="text-xs text-red-600 mt-1">
          Error: {error}
        </p>
      )}
      
      {processing && (
        <div className="text-xs text-amber-600">
          <p>{processingStatus || "Processing voice change..."}</p>
          <div className="w-full bg-amber-100 h-1 mt-1 rounded overflow-hidden">
            <div 
              className="bg-amber-500 h-1 animate-pulse" 
              style={{ width: `${Math.min((pollCount/20) * 100, 100)}%` }}
            ></div>
          </div>
          <p className="mt-1">This may take up to a minute.</p>
        </div>
      )}
      
      {!audioUrl && (
        <p className="text-xs text-gray-500">
          Load a sound first to use voice changer
        </p>
      )}

      {disabled && !error && (
        <p className="text-xs text-amber-600">
          Voice changer is locked. Unlock settings to change voices.
        </p>
      )}
    </div>
  );
}
