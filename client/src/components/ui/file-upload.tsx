import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Upload, X } from "lucide-react";
import { useLocale } from "@/contexts/locale-context";

interface FileUploadProps {
  onFileSelected: (file: File) => void;
  currentImageUrl?: string;
  onRemove?: () => void;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  previewSize?: "sm" | "md" | "lg";
  label?: string;
  variant?: "default" | "outline" | "secondary";
}

export function FileUpload({
  onFileSelected,
  currentImageUrl,
  onRemove,
  accept = "image/png, image/jpeg, image/svg+xml",
  maxSize = 2, // 2MB default
  className = "",
  previewSize = "md",
  label,
  variant = "outline"
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | undefined>(currentImageUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { t } = useLocale();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size should not exceed ${maxSize}MB`,
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
    onFileSelected(file);
  };

  const handleRemove = () => {
    setPreviewUrl(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    if (onRemove) {
      onRemove();
    }
  };

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-20 h-20",
    lg: "w-24 h-24",
  };

  const previewSizeClass = sizeClasses[previewSize];

  return (
    <div className={`flex items-center ${className}`}>
      <div
        className={`${previewSizeClass} rounded-lg flex items-center justify-center overflow-hidden ${
          previewUrl ? "border border-neutral-300" : "border-2 border-dashed border-neutral-300 bg-neutral-50"
        }`}
      >
        {previewUrl ? (
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
        ) : (
          <Upload className="text-neutral-400 h-6 w-6" />
        )}
      </div>
      <div className="mr-4">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept={accept}
          style={{ display: "none" }}
        />
        <Button
          variant={variant}
          size="sm"
          className="mb-2 w-full"
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="mr-2 h-4 w-4" />
          {label || t("upload")}
        </Button>
        {previewUrl && onRemove && (
          <Button
            variant="ghost"
            size="sm"
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-0"
            onClick={handleRemove}
          >
            <X className="h-4 w-4 mr-1" />
            {t("remove")}
          </Button>
        )}
      </div>
    </div>
  );
}
