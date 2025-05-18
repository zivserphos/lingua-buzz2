import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { blogPosts } from "./blogposts";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Helmet } from "react-helmet-async";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  
  useEffect(() => {
    const foundPost = blogPosts.find((p) => p.slug === slug);
    if (foundPost) {
      setPost(foundPost);
    } else {
      // Redirect to blog list if post not found
      navigate("/blog");
    }
  }, [slug, navigate]);
  
  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 text-lg mb-4">Loading article...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      <Helmet>
        <title>{post.title} | Brainrot Memes Blog</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={`${post.title} | Brainrot Memes Blog`} />
        <meta property="og:description" content={post.excerpt} />
        {post.image && <meta property="og:image" content={post.image} />}
      </Helmet>
      
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link to="/blog">
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>
        </div>
        
        <Card className="overflow-hidden bg-white/80 backdrop-blur-sm p-6 md:p-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          <p className="text-purple-600 mb-8">{post.date}</p>
          
{post.image && (
  <img 
    src={generateSmallImageUrl(post.image)}
    srcSet={`${generateSmallImageUrl(post.image)} 400w, ${generateMediumImageUrl(post.image)} 800w, ${post.image} 1200w`}
    sizes="(max-width: 480px) 95vw, (max-width: 768px) 70vw, 50vw"
    loading="lazy"
    alt={post.title}
    className="w-full h-auto rounded-lg mb-8 max-h-[400px] object-cover"
  />
)}
          
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          <div className="mt-8 border-t pt-4">
            <Link to="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Read more articles
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
