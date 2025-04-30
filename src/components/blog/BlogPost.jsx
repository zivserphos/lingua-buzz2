import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate, useLocation } from "react-router-dom";
import { blogPosts } from "./blogposts";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import SEO from "../seo/Seo";

export default function BlogPost() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
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
  
  // Find related blog posts (up to 3) based on common words in title
  const relatedPosts = blogPosts
    .filter(p => p.slug !== slug) // Exclude current post
    .slice(0, 3);  // Take up to 3 posts
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-6">
      {/* Use the shared SEO component instead of direct Helmet */}
      <SEO 
        title={post.title}
        description={post.excerpt}
        slug={slug}
        type="article"
        image={post.image}
      />
      
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
              src={post.image} 
              alt={post.title}
              className="w-full h-auto rounded-lg mb-8 max-h-[400px] object-cover"
            />
          )}
          
          <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: post.content }} />
          
          {/* Add keywords as tags for SEO */}
          <div className="mt-8 flex flex-wrap gap-2">
            {post.keywords?.map(keyword => (
              <span key={keyword} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md">
                {keyword}
              </span>
            )) || (
              <>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md">
                  brainrot sounds
                </span>
                <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-md">
                  meme audio
                </span>
              </>
            )}
          </div>
          
          <div className="mt-8 border-t pt-4">
            <Link to="/blog">
              <Button>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Read more articles
              </Button>
            </Link>
          </div>
          
          {/* Related posts section - good for SEO and user engagement */}
          {relatedPosts.length > 0 && (
            <div className="mt-10 border-t pt-6">
              <h2 className="text-xl font-bold mb-4">You might also like:</h2>
              <div className="grid gap-4 md:grid-cols-3">
                {relatedPosts.map(relatedPost => (
                  <Link 
                    key={relatedPost.slug}
                    to={`/blog/${relatedPost.slug}`}
                    className="block p-4 border rounded-lg hover:bg-purple-50 transition"
                  >
                    <h3 className="font-medium text-purple-700">{relatedPost.title}</h3>
                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{relatedPost.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
