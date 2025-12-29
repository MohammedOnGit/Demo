
// ProductImageUpload.jsx - JavaScript version
import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { CloudUpload, FileIcon, X, Loader2, UploadCloud } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode = false,
  isDisabled = false,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  // Cleanup blob URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl && previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  // Show existing uploaded image in edit mode
  useEffect(() => {
    if (isEditMode && uploadedImageUrl && !previewUrl) {
      setPreviewUrl(uploadedImageUrl);
    }
  }, [uploadedImageUrl, isEditMode, previewUrl]);

  function handleImageSelect(file) {
    if (!file) return;

    setUploadError("");

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Image is too large. Please choose a file under 10MB.");
      return;
    }

    const newPreview = URL.createObjectURL(file);
    setPreviewUrl(newPreview);
    setImageFile(file);
  }

  function handleFileChange(event) {
    const file = event.target.files[0];
    handleImageSelect(file);
  }

  function handleDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const file = event.dataTransfer.files[0];
    handleImageSelect(file);
  }

  function handleDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  function handleRemoveImage() {
    if (isUploading || isEditMode || isDisabled) return;

    if (previewUrl && previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(previewUrl);
    }

    setPreviewUrl("");
    setImageFile(null);
    setUploadedImageUrl(null);
    setUploadError("");

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // Auto-upload using axios
  useEffect(() => {
    if (!imageFile || isEditMode) return;

    async function uploadImage() {
      const formData = new FormData();
      formData.append("image", imageFile);

      setIsUploading(true);
      setImageLoadingState(true);
      setUploadError("");

      try {
        const response = await axios.post(
          "http://localhost:5000/api/admin/products/upload-image",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data.success && response.data.imageUrl) {
          setUploadedImageUrl(response.data.imageUrl);
          toast.success("Image uploaded successfully!");
        } else {
          throw new Error(response.data.message || "Invalid response from server");
        }
      } catch (error) {
        console.error("Upload error:", error);

        const msg =
          error.response?.data?.error ||
          error.response?.data?.message ||
          error.message ||
          "Failed to upload image. Please try again.";

        setUploadError(msg);
        toast.error(msg);

        // Remove failed image to avoid stuck state
        handleRemoveImage();
      } finally {
        setIsUploading(false);
        setImageLoadingState(false);
      }
    }

    uploadImage();
  }, [imageFile, isEditMode, setImageLoadingState, setUploadedImageUrl]);

  const isInteractionDisabled = isUploading || isEditMode || isDisabled;

  return (
    <div className="w-full max-w-md mx-auto">
      <Label htmlFor="image-upload" className="text-base font-medium">
        Product Image <span className="text-destructive">*</span>
      </Label>

      <div className="mt-3">
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className={cn(
            "relative border-2 border-dashed rounded-xl p-6 transition-all duration-200",
            "bg-muted/30 hover:bg-muted/50",
            "min-h-[200px] sm:min-h-[250px]",
            isInteractionDisabled && "opacity-60 cursor-not-allowed"
          )}
          style={{
            maxHeight: 'calc(100vh - var(--header-height) - var(--footer-height) - 200px)',
            overflow: 'hidden'
          }}
        >
          <Input
            id="image-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
            ref={inputRef}
            className="hidden"
            onChange={handleFileChange}
            disabled={isInteractionDisabled}
          />

          {!previewUrl ? (
            <Label
              htmlFor="image-upload"
              className={cn(
                "flex flex-col items-center justify-center h-48 cursor-pointer gap-3",
                isInteractionDisabled && "cursor-not-allowed"
              )}
            >
              <UploadCloud className="w-12 h-12 text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium text-foreground">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF, WebP (max 10MB)
                </p>
              </div>
            </Label>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <FileIcon className="w-8 h-8 text-primary flex-shrink-0" />
                  <p className="text-sm font-medium truncate">
                    {imageFile?.name || "Current Image"}
                  </p>
                </div>

                {!isEditMode && !isDisabled && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                    className="hover:bg-destructive/10 flex-shrink-0"
                  >
                    <X className="h-4 w-4 text-destructive" />
                  </Button>
                )}
              </div>

              <div className="relative aspect-square rounded-lg overflow-hidden border bg-background">
                {isUploading ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 bg-muted/50">
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                    <p className="text-sm text-muted-foreground">Uploading...</p>
                  </div>
                ) : (
                  <img
                    src={previewUrl}
                    alt="Product preview"
                    className="h-full w-full object-cover"
                  />
                )}
              </div>

              {uploadError && (
                <Alert variant="destructive" className="py-3">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-sm">
                    {uploadError}
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>

        <p className="text-xs text-muted-foreground mt-2">
          High-quality square images work best (recommended: 800×800px or larger).
        </p>
      </div>
    </div>
  );
}

export default ProductImageUpload;