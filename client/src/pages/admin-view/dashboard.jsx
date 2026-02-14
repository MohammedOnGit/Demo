import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";

import ProductImageUpload from "@/components/admin-view/image-upload";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Trash2,
  RefreshCw,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

import {
  addFeatureImage,
  getFeatureImages,
  deleteFeatureImage,
  resetUploadState,
  resetDeleteState,
} from "@/store/common-slice";

import { toast } from "sonner";

function AdminDashBoard() {
  const dispatch = useDispatch();

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [uploadKey, setUploadKey] = useState(Date.now());

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  const {
    featureImageList = [],
    isloading,
    uploadSuccess,
    uploadError,
    deleteLoading,
    deleteSuccess,
    deleteError,
  } = useSelector((state) => state.commonFeature || {});

  /* ----------------------------- EFFECTS ----------------------------- */

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    if (uploadSuccess) {
      toast.success("Feature image added successfully");
      setImageFile(null);
      setUploadedImageUrl("");
      setUploadKey(Date.now());
      dispatch(resetUploadState());
    }

    if (uploadError) {
      toast.error(uploadError || "Failed to upload image");
      dispatch(resetUploadState());
    }
  }, [uploadSuccess, uploadError, dispatch]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Feature image deleted");
      setDeleteDialogOpen(false);
      setSelectedImageId(null);
      dispatch(resetDeleteState());
    }

    if (deleteError) {
      toast.error(deleteError || "Failed to delete image");
      dispatch(resetDeleteState());
    }
  }, [deleteSuccess, deleteError, dispatch]);

  /* ----------------------------- HANDLERS ----------------------------- */

  const handleUpload = useCallback(() => {
    if (!uploadedImageUrl) {
      toast.error("Upload an image first");
      return;
    }
    dispatch(addFeatureImage(uploadedImageUrl));
  }, [dispatch, uploadedImageUrl]);

  const handleDelete = useCallback((id) => {
    setSelectedImageId(id);
    setDeleteDialogOpen(true);
  }, []);

  const confirmDelete = useCallback(() => {
    if (selectedImageId) {
      dispatch(deleteFeatureImage(selectedImageId));
    }
  }, [dispatch, selectedImageId]);

  const refreshImages = useCallback(() => {
    dispatch(getFeatureImages());
    toast.info("Refreshing images...");
  }, [dispatch]);

  const formatDate = (date) =>
    date ? new Date(date).toLocaleString() : "N/A";

  /* ----------------------------- RENDER ----------------------------- */

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-semibold">Feature Images</h1>
          <p className="text-muted-foreground">
            Manage homepage feature images
          </p>
        </div>

        <Button variant="outline" onClick={refreshImages} disabled={isloading}>
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isloading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Upload */}
      <Card>
        <CardHeader>
          <CardTitle>Add Feature Image</CardTitle>
          <CardDescription>Upload a new homepage banner</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ProductImageUpload
            key={uploadKey}
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            isCustomStyling={false}
          />

          <Button
            className="w-full"
            onClick={handleUpload}
            disabled={!uploadedImageUrl || imageLoadingState}
          >
            {isloading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              "Add Feature Image"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Images */}
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Uploaded Images</h2>

        {isloading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-72 w-full" />
            ))}
          </div>
        ) : featureImageList.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mx-auto mb-4" />
            No images uploaded yet
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureImageList.map((img) => (
              <div
                key={img._id}
                className="relative border rounded-lg overflow-hidden"
              >
                <img src={img.image} alt="Feature" className="w-full h-auto" />

                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-3 right-3"
                  onClick={() => handleDelete(img._id)}
                  disabled={deleteLoading}
                >
                  {deleteLoading && selectedImageId === img._id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>

                <div className="absolute bottom-0 w-full bg-black/60 text-white px-4 py-2">
                  <p className="text-xs">Uploaded</p>
                  <p className="text-sm font-medium">
                    {formatDate(img.createdAt)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Delete Dialog */}
      <AlertDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete image?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLoading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

export default AdminDashBoard;
