import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import { addFeatureImage, resetUploadState } from "@/store/common-slice";
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

function AdminDashBoard() {
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();
  const { uploadLoading, uploadSuccess, uploadError } = useSelector(
    (state) => state.commonFeature
  );

  // Reset upload states on component unmount
  useEffect(() => {
    return () => {
      dispatch(resetUploadState());
    };
  }, [dispatch]);

  // Handle upload success/error
  useEffect(() => {
    if (uploadSuccess) {
      alert("Feature image uploaded successfully!");
      setUploadedImageUrl("");
      setImageFile(null);
      dispatch(resetUploadState());
    }
    
    if (uploadError) {
      alert(`Upload failed: ${uploadError}`);
      dispatch(resetUploadState());
    }
  }, [uploadSuccess, uploadError, dispatch]);

  function handleUploadFeatureImage() {
    if (!uploadedImageUrl.trim()) {
      alert("Please select an image first");
      return;
    }
    
    dispatch(addFeatureImage(uploadedImageUrl));
  }

  return (
    <div>  
      <ProductImageUpload
        imageFile={imageFile}
        setImageFile={setImageFile}
        uploadedImageUrl={uploadedImageUrl}
        setUploadedImageUrl={setUploadedImageUrl}
        setImageLoadingState={setImageLoadingState}
        isCustomStyling={true}
      />
      <Button 
        onClick={handleUploadFeatureImage} 
        className="mt-5 w-full"
        disabled={uploadLoading || !uploadedImageUrl.trim()}
      >
        {uploadLoading ? "Uploading..." : "Upload"}
      </Button>
      
      {uploadLoading && (
        <p className="text-sm text-gray-600 mt-2 text-center">Uploading feature image...</p>
      )}
    </div>
  );
}

export default AdminDashBoard;