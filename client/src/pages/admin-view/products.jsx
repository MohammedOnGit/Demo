// AdminProducts.jsx
import React, { Fragment, useEffect, useState } from "react";
import CommonForm from "@/components/common/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import ProductImageUpload from "@/components/admin-view/image-upload";
import { addProductFormElements } from "@/config";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProducts, addNewProduct } from "@/store/admin/product-slice";
import { toast } from "sonner";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
};

function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);

  const dispatch = useDispatch();
  const { products } = useSelector((state) => state.adminProducts);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  function handleCreateProduct(event) {
    event.preventDefault();

    if (imageLoadingState) {
      toast.error("Image is still uploading...");
      return;
    }

    if (!uploadedImageUrl) {
      toast.error("Upload a product image first");
      return;
    }

    const payload = {
      ...formData,
      image: uploadedImageUrl,
    };

    dispatch(addNewProduct(payload))
      .unwrap()
      .then(() => {
        toast.success("Product added!");
        dispatch(fetchAllProducts());
        setFormData(initialFormData);
        setUploadedImageUrl("");
        setImageFile(null);
        setOpenCreateProductDialog(false);
      })
      .catch(() => toast.error("Failed to add product"));
  }

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <button
          onClick={() => setOpenCreateProductDialog(true)}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add New Product
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products?.map((p) => (
          <div key={p._id} className="border p-3 rounded">
            <img src={p.image} className="w-full h-48 object-cover rounded" />
            <h3 className="font-medium mt-2">{p.title}</h3>
            <p className="text-sm text-gray-600">{p.description}</p>
          </div>
        ))}
      </div>

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>

            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
            />

            <div className="py-6">
              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateProduct}
                buttonText={imageLoadingState ? "Uploading..." : "Add Product"}
                isBtnDisabled={imageLoadingState || !uploadedImageUrl}
              />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
