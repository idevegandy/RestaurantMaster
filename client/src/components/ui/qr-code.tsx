import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRCodeGeneratorProps {
  value: string;
  size?: number;
  level?: 'L' | 'M' | 'Q' | 'H';
  includeMargin?: boolean;
  onRegenerate?: () => void;
  restaurantName?: string;
}

export function QRCodeGenerator({
  value,
  size = 128,
  level = 'M',
  includeMargin = true,
  onRegenerate,
  restaurantName,
}: QRCodeGeneratorProps) {
  // Create a logo element if restaurant name is provided
  const logoImage = restaurantName ? (
    <svg
      height={size * 0.25}
      width={size * 0.25}
      viewBox="0 0 100 100"
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        background: 'white',
        padding: '5px',
        borderRadius: '8px',
      }}
    >
      <rect width="100" height="100" rx="15" fill="white" />
      <text
        x="50"
        y="55"
        fontFamily="Arial"
        fontSize="45"
        fontWeight="bold"
        textAnchor="middle"
        fill="#333"
      >
        {restaurantName.charAt(0).toUpperCase()}
      </text>
    </svg>
  ) : null;

  return (
    <div className="relative group">
      <div className="relative">
        <QRCodeSVG
          value={value}
          size={size}
          level={level}
          includeMargin={includeMargin}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
        {logoImage}
      </div>
      
      {onRegenerate && (
        <Button
          size="sm"
          variant="outline"
          className="mt-2 w-full"
          onClick={onRegenerate}
        >
          <RefreshCw className="h-4 w-4 ml-2" />
          Refresh QR
        </Button>
      )}
    </div>
  );
}