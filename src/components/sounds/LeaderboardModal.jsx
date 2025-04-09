import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Crown, Clock, Headphones } from "lucide-react";
import { motion } from "framer-motion";

export default function LeaderboardModal({ isOpen, onClose, stats, soundName }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-gradient-to-br from-purple-50 to-indigo-50">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Crown className="w-6 h-6 text-yellow-500" />
            {soundName ? `"${soundName}" Champions` : "Global Crazy Leaders"}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.user_email}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className={`
                p-4 rounded-lg border flex items-center gap-4
                ${index === 0 ? 'bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200' :
                  index === 1 ? 'bg-gradient-to-r from-gray-50 to-slate-50 border-gray-200' :
                  index === 2 ? 'bg-gradient-to-r from-orange-50 to-amber-50 border-orange-200' :
                  'bg-white border-gray-100'}
              `}>
                {/* Position Indicator */}
                <div className={`
                  w-8 h-8 rounded-full flex items-center justify-center font-bold
                  ${index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 text-gray-700'}
                `}>
                  {index + 1}
                </div>

                {/* User Info */}
                <div className="flex-1">
                  <div className="font-medium">{stat.user_email.split('@')[0]}</div>
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {Math.floor(stat.listen_time / 60)}m {Math.floor(stat.listen_time % 60)}s
                    </div>
                    <div className="flex items-center gap-1">
                      <Headphones className="w-4 h-4" />
                      {stat.crazy_mode_count} times
                    </div>
                  </div>
                </div>

                {/* Trophy for top 3 */}
                {index < 3 && (
                  <div className="absolute -top-2 -right-2">
                    {index === 0 && "🏆"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}