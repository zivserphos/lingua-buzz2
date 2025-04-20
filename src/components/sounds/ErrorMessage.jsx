import React from "react";
import { Button } from "@/components/ui/button";

export default function ErrorMessage({ error, onRetry }) {
  return (
    <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
      {error}
      <Button 
        className="ml-4" 
        variant="outline" 
        onClick={onRetry}
      >
        Try Again
      </Button>
    </div>
  );
}
