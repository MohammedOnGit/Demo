import React, { useEffect, useRef, useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CloudUpload, FileIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";
import axios from "axios";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
}) {
  const inputRef = useRef(null);
  const [loading, setLoading] = useState(false); // ⬅️ NEW

  function handleImageFileChange(event) {
    if (loading) return; // prevent file change during upload
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
    if (loading) return; // prevent deletion during upload
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) inputRef.current.value = null;
  }

  async function uploadedImageToCloudinary() {
    if (!imageFile) return;

    const data = new FormData();
    data.append("image", imageFile);
    setLoading(true); // ⬅️ show spinner

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
      const message =
        error.response?.data?.error || "Something went wrong during upload";
      toast.error(message);
      handleRemoveImage();
    } finally {
      setLoading(false); // ⬅️ hide spinner
    }
  }

  useEffect(() => {
    if (imageFile) uploadedImageToCloudinary();
  }, [imageFile]);

  function truncateFileName(name, maxLength = 15) {
    if (!name) return "";
    const ext = name.substring(name.lastIndexOf("."));
    const baseName = name.substring(0, name.lastIndexOf("."));
    if (baseName.length <= maxLength) return name;
    return baseName.substring(0, maxLength) + "..." + ext;
  }

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
        <Input
          className="hidden"
          id="image-upload"
          type="file"
          ref={inputRef}
          disabled={loading}
          onChange={handleImageFileChange}
        />

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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center">
                <FileIcon className="w-8 h-8 text-primary mr-2" />
                <p className="text-sm font-medium">
                  {truncateFileName(imageFile.name)}
                </p>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="hover:text-red-600"
                onClick={handleRemoveImage}
                disabled={loading}
              >
                <XIcon className="w-4 h-4 text-red-500" />
              </Button>
            </div>

            {/* 🔥 SPINNER WHILE UPLOADING */}
            {loading ? (
              <div className="w-full flex justify-center py-6">
                <Spinner className="h-10 w-10 text-primary" />
              </div>
            ) : (
              uploadedImageUrl && (
                <img
                  src={uploadedImageUrl}
                  alt="Preview"
                  className="w-full h-65 object-cover rounded-md border"
                />
              )
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
