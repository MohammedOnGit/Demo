import React, { useRef } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { CloudUpload, FileIcon, XIcon } from "lucide-react";
import { Button } from "../ui/button";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadedImageUrl,
  setUploadedImageUrl,
}) {
  const inputRef = useRef(null);

  function handleImageFileChange(event) {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setImageFile(selectedFile);
      setUploadedImageUrl(URL.createObjectURL(selectedFile));
    }
  }

  function handleDragOver(event) {
    event.preventDefault();
  }

  function handleDrop(event) {
    event.preventDefault();
    const droppedFile = event.dataTransfer.files?.[0];
    if (droppedFile) {
      setImageFile(droppedFile);
      setUploadedImageUrl(URL.createObjectURL(droppedFile));
    }
  }

  function handleRemoveImage() {
    setImageFile(null);
    setUploadedImageUrl("");
    if (inputRef.current) {
      inputRef.current.value = null;
    }
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      <Label className="text-lg font-semibold mb-2 block">Upload Image</Label>

      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="border-2 border-dashed rounded-lg p-4 mb-4 relative cursor-pointer"
      >
        <Input
          className="hidden"
          id="image-upload"
          type="file"
          ref={inputRef}
          onChange={handleImageFileChange}
        />

        {!imageFile ? (
          <Label
            htmlFor="image-upload"
            className="flex flex-col items-center justify-center h-32 cursor-pointer"
          >
            <CloudUpload className="w-10 h-10 text-shadow-muted-foreground mb-2" />
            <span>Drag & drop or click to upload image</span>
          </Label>
        ) : (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <FileIcon className="w-8 h-8 text-primary mr-2" />
              <p className="text-sm font-medium">{imageFile.name}</p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="hover:text-red-600"
              onClick={handleRemoveImage}
            >
              <XIcon className="w-4 h-4 text-red-500" />
              <span className="sr-only">Remove File</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductImageUpload;
