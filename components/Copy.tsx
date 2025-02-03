"use client";

import { useState } from "react";
import { Button } from "./ui/button";

const Copy = ({title}: {title: string}) => {

    const [isCopied, setIsCopied] = useState(false);
    
    const copyToClipBoard = () => {
        navigator.clipboard.writeText(title);
        setIsCopied(true);
        
        setTimeout(() => {
            setIsCopied(false);
        },2000);
    };
    
    console.log(title);
    
  
    return (
        <Button
          data-state="closed"
          className="mt-3 flex max-w-[320px] gap-4"
          variant="secondary"
          onClick={copyToClipBoard}
        >
          <p className="line-clamp-1 w-full max-w-full text-xs font-medium text-black-2">
            {title} 
          </p>
    
          {!isCopied ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 size-4"
            >
              <rect width="14" height="14" x="8" y="8" rx="2" ry="2"></rect>
              <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"></path>
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 size-4"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </Button>
  );
};

export default Copy;