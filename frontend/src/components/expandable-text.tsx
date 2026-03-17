"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";

interface ExpandableTextProps {
  text: string;
  maxLength?: number;
  showCharCount?: boolean;
}

export function ExpandableText({
  text,
  maxLength = 200,
  showCharCount = false,
}: ExpandableTextProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!text) return null;

  const needsTruncation = text.length > maxLength;
  const displayText =
    isExpanded || !needsTruncation ? text : text.slice(0, maxLength) + "...";

  return (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground leading-relaxed">
        {displayText}
        {showCharCount && needsTruncation && (
          <span className="ml-1 text-xs">
            ({isExpanded ? text.length : maxLength}/{text.length})
          </span>
        )}
      </p>

      {needsTruncation && (
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary-orange hover:text-primary-orange/80"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? "Ẩn bớt" : "Xem thêm"}
        </Button>
      )}
    </div>
  );
}
