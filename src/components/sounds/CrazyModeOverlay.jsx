import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Volume2, VolumeX } from "lucide-react";

export default function CrazyModeOverlay({ sound, onClose, onTimeUpdate }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime(prev => {
        const newTime = prev + 1;
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [onTimeUpdate]);

  useEffect(() => {
    const createParticle = () => {
      const particle = {
        id: Math.random(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        size: Math.random() * 20 + 10,
        duration: Math.random() * 10 + 5,
      };
      setParticles(prev => [...prev.slice(-20), particle]);
    };

    const particleInterval = setInterval(createParticle, 500);
    return () => clearInterval(particleInterval);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: 'radial-gradient(circle at center, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.95) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      {/* Floating particles */}
      <AnimatePresence>
        {particles.map(particle => (
          <motion.div
            key={particle.id}
            initial={{ 
              opacity: 0,
              scale: 0,
              x: particle.x,
              y: window.innerHeight + 100
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              y: -100,
              rotate: 360
            }}
            transition={{ 
              duration: particle.duration,
              ease: "linear"
            }}
            className="absolute pointer-events-none"
          >
            <span className="text-2xl">✨</span>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Main content */}
      <motion.div
        className="relative max-w-4xl w-full mx-4"
        initial={{ scale: 0.8, y: 20 }}
        animate={{ 
          scale: [1, 1.02, 1],
          y: [0, -5, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
          ease: "easeInOut"
        }}
      >
        {/* Timer and controls */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute -top-16 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-6">
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-5 h-5" />
              <span className="font-mono text-xl">{formatTime(elapsedTime)}</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMuted(!isMuted)}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
          </div>
        </motion.div>

        {/* Image */}
        <motion.img
          src={sound.image_url}
          alt={sound.name}
          className="w-full rounded-xl shadow-[0_0_50px_rgba(168,85,247,0.4)]"
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />

        {/* Close button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="absolute top-4 right-4"
        >
          <Button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white"
          >
            Exit Crazy Mode
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}