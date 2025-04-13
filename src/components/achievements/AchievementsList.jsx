import React from 'react';

export const ACHIEVEMENTS = {
  timeBased: [
    {
      id: "sound_explorer",
      name: "Sound Explorer",
      description: "Listen to sounds for 1 hour total",
      tier: "bronze"
    },
    {
      id: "sound_master",
      name: "Sound Master",
      description: "Listen to sounds for 10 hours total",
      tier: "silver"
    },
    {
      id: "sound_legend",
      name: "Sound Legend",
      description: "Listen to sounds for 50 hours total",
      tier: "gold"
    },
    {
      id: "daily_devotee",
      name: "Daily Devotee",
      description: "Listen to sounds for 7 consecutive days",
      tier: "silver"
    },
    {
      id: "weekly_warrior",
      name: "Weekly Warrior",
      description: "Maintain a 7-day streak of daily listening",
      tier: "gold"
    },
    {
      id: "monthly_maven",
      name: "Monthly Maven",
      description: "Complete a 30-day listening streak",
      tier: "platinum"
    }
  ],
  
  interactionBased: [
    {
      id: "social_butterfly",
      name: "Social Butterfly",
      description: "Leave 10 comments",
      tier: "bronze"
    },
    {
      id: "popular_voice",
      name: "Popular Voice",
      description: "Get 50 likes on your comments",
      tier: "silver"
    },
    {
      id: "trend_setter",
      name: "Trend Setter",
      description: "Be among the first 10 users to like a new sound",
      tier: "gold"
    },
    {
      id: "community_pillar",
      name: "Community Pillar",
      description: "Interact with 100 different sounds",
      tier: "platinum"
    },
    {
      id: "viral_voice",
      name: "Viral Voice",
      description: "Have one of your comments receive 10+ likes",
      tier: "gold"
    }
  ],

  soundCollection: [
    {
      id: "language_pioneer",
      name: "Language Pioneer",
      description: "Listen to sounds in 5 different languages",
      tier: "silver"
    },
    {
      id: "global_explorer",
      name: "Global Explorer",
      description: "Listen to sounds in 10 different languages",
      tier: "gold"
    },
    {
      id: "sound_collector",
      name: "Sound Collector",
      description: "Listen to 50 different sounds",
      tier: "silver"
    },
    {
      id: "sound_connoisseur",
      name: "Sound Connoisseur",
      description: "Listen to 200 different sounds",
      tier: "platinum"
    }
  ],

  special: [
    {
      id: "early_bird",
      name: "Early Bird",
      description: "Be among the first 100 users to join the platform",
      tier: "gold"
    },
    {
      id: "trending_expert",
      name: "Trending Expert",
      description: "Listen to all top 10 trending sounds in a week",
      tier: "silver"
    },
    {
      id: "marathon_runner",
      name: "Marathon Runner",
      description: "Listen to sounds for 2 hours in a single session",
      tier: "gold"
    },
    {
      id: "night_owl",
      name: "Night Owl",
      description: "Active listening sessions during night hours",
      tier: "silver"
    }
  ],

  featureBased: [
    {
      id: "echo_master",
      name: "Echo Master",
      description: "Use echo effect on 20 different sounds",
      tier: "gold"
    },
    {
      id: "volume_virtuoso",
      name: "Volume Virtuoso",
      description: "Play with different volume levels in a single session",
      tier: "silver"
    },
    {
      id: "loop_legend",
      name: "Loop Legend",
      description: "Loop sounds for a cumulative 24 hours",
      tier: "platinum"
    },
    {
      id: "speed_demon",
      name: "Speed Demon",
      description: "Use different playback speeds on 50 sounds",
      tier: "gold"
    }
  ],

  milestones: [
    {
      id: "bronze_listener",
      name: "Bronze Listener",
      description: "10 hours total listening time",
      tier: "bronze"
    },
    {
      id: "silver_listener",
      name: "Silver Listener",
      description: "50 hours total listening time",
      tier: "silver"
    },
    {
      id: "gold_listener",
      name: "Gold Listener",
      description: "100 hours total listening time",
      tier: "gold"
    },
    {
      id: "platinum_listener",
      name: "Platinum Listener",
      description: "500 hours total listening time",
      tier: "platinum"
    },
    {
      id: "diamond_listener",
      name: "Diamond Listener",
      description: "1000 hours total listening time",
      tier: "diamond"
    }
  ]
};

export default ACHIEVEMENTS;