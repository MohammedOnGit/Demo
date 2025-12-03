import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CloudUpload, FileIcon, XIcon } from "lucide-react";
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
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false);

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
    if (baseName.length <= maxLength) return name;
    return baseName.substring(0, maxLength) + "..." + ext;
  }

  function validateAndSetFile(file) {
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
    if (!validTypes.includes(file.type)) {
      toast.error("Only image files (jpg, jpeg, png, gif) are allowed!");
      handleRemoveImage();
      return;
    }

    setImageFile(file);
    setUploadedImageUrl(URL.createObjectURL(file));
  }

  function handleRemoveImage() {
    if (loading) return;
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) inputRef.current.value = null;
  }

  async function uploadImageToServer() {
    if (!imageFile) return;

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
        setUploadedImageUrl(response.data.imageUrl);
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

  useEffect(() => {
    if (imageFile) uploadImageToServer();
  }, [imageFile]);

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-lg p-4 mb-4 relative cursor-pointer ${
          loading ? "opacity-60" : ""
        }`}
      >
        {/* Hidden input */}
        <Input
          className="hidden"
          id="image-upload"
          type="file"
          ref={inputRef}
          disabled={loading}
          onChange={handleImageFileChange}
        />

        {/* No image yet: show upload prompt */}
        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <CloudUpload className="w-10 h-10 text-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <>
            {/* File Name */}
            <div className="flex items-center mb-3">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
              <p className="text-sm font-medium">
                {truncateFileName(imageFile.name)}
              </p>
            </div>

            {/* Skeleton or Actual Image */}
            {loading ? (
              <Skeleton className="w-full aspect-square rounded-md bg-gray-300" />
            ) : (
              uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="Preview"
                  className="w-full aspect-square object-cover rounded-md border"
                />
              )
            )}

            {/* Remove Button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 hover:text-red-600"
              onClick={handleRemoveImage}
              disabled={loading}
            >
              <XIcon className="w-4 h-4 text-red-500" />
            </Button>
          </>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
