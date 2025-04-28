import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { blogPosts } from "./blogposts";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";
import { createPageUrl } from "@/utils";

export default function BlogList() {
  const { language } = useParams();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <Helmet>
        <title>Blog | Brainrot Memes</title>
        <meta name="description" content="Read articles about meme sounds, viral audio clips, and internet culture." />
        <meta property="og:title" content="Blog | Brainrot Memes" />
        <meta property="og:description" content="Discover insights and guides about meme sounds and viral audio." />
      </Helmet>
      
      <div className="max-w-5xl mx-auto">
        <div className="mb-6">
          <Link to={createPageUrl("sounds")}>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Sounds
            </Button>
          </Link>
        </div>
        
        <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Meme Sound Blog</h1>
        <p className="text-gray-600 mb-8">Discover insights, tutorials, and the latest trends in viral audio</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogPosts.map((post) => (
            <motion.div
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link 
                to={createPageUrl("blog", { slug: post.slug })}
                className="block h-full"
              >
                <Card className="overflow-hidden h-full hover:shadow-md transition-shadow">
                  {post.image && (
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-sm text-purple-600 mb-2">{post.date}</p>
                    <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                    <p className="text-gray-600 line-clamp-3">{post.excerpt}</p>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
