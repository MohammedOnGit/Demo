import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CloudUpload, FileIcon, XIcon, } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Skeleton } from "../ui/skeleton";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
  setImageLoadingState,
  isEditMode,
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  function handleImageFileChange(event) {
    if (loading) return;
    const selectedFile = event.target.files[0];
    validateAndSetFile(selectedFile);
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    if (loading) return;
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    validateAndSetFile(droppedFile);
  }

  function truncateFileName(name, maxLength = 15) {
    if (!name) return "";
    const ext = name.substring(name.lastIndexOf("."));
    const baseName = name.substring(0, name.lastIndexOf("."));
    return baseName.length > maxLength
      ? baseName.substring(0, maxLength) + "..." + ext
      : name;
  }

  function validateAndSetFile(file) {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only image files (jpg, jpeg, png, gif) are allowed!");
      handleRemoveImage();
      return;
    }

    const preview = URL.createObjectURL(file);
    setPreviewUrl(preview); // ✅ safe preview only
    setImageFile(file);
  }

  function handleRemoveImage() {
    if (loading) return;

    if (previewUrl) URL.revokeObjectURL(previewUrl);

    setPreviewUrl("");
    setImageFile(null);
    setUploadedImageUrl("");

    if (inputRef.current) inputRef.current.value = null;
  }

  async function uploadImageToServer() {
    if (!imageFile || loading) return;

    const data = new FormData();
    data.append("image", imageFile);

    setLoading(true);
    setImageLoadingState(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/api/admin/products/upload-image",
        data
      );

      if (response.data.success) {
        setUploadedImageUrl(response.data.imageUrl); // ✅ CLOUD URL
        toast.success("Image uploaded successfully!");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.error || "Something went wrong during upload"
      );
      handleRemoveImage();
    } finally {
      setLoading(false);
      setImageLoadingState(false);
    }
  }

  // Upload image when imageFile changes
  useEffect(() => {
    if (imageFile) uploadImageToServer();
  }, [imageFile]);

  // Populate preview when in edit mode
  useEffect(() => {
    if (uploadedImageUrl && isEditMode) {
      setPreviewUrl(uploadedImageUrl);
    }
  }, [uploadedImageUrl, isEditMode]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 mb-4 relative cursor-not-allowed ${
          loading || isEditMode ? "opacity-60" : ""
        }`}
      >
        <Input
          className="hidden"
          id="image-upload"
          type="file"
          ref={inputRef}
          disabled={loading || isEditMode} 
          onChange={handleImageFileChange}
        />

        {!previewUrl ? (
          <Label
            htmlFor="image-upload"
            className={`${isEditMode? 'cursor-not-allowed': ""}flex flex-col items-center justify-center h-32 cursor-pointer`}
          >
            <CloudUpload className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <>
            <div className="flex items-center mb-3">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
              <p className="text-sm font-medium">
                {truncateFileName(imageFile?.name || "Current Image")}
              </p>
            </div>

            {loading ? (
              <Skeleton className="w-full aspect-square rounded-md bg-gray-300" />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full aspect-square object-cover rounded-md border"
              />
            )}

            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 hover:text-red-600"
              onClick={handleRemoveImage}
              disabled={loading || isEditMode} 
            >
              {
                isEditMode ? ( "") : (<XIcon className="w-4 h-4 text-red-500" />)
              }
              
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
