import CommonForm from "@/components/common/form";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../../components/ui/sheet";
import React, { Fragment, useState } from "react";
import { addProductFormElements } from "@/config";
import ProductImageUpload from "@/components/admin-view/image-upload";


const initialFormData = {
  Image: null,
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",

};

function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState({initialFormData});

  
  function handleCreateProduct(event) {
    event.preventDefault();
    console.log("Product data:", formData);

    setOpenCreateProductDialog(false);
    setFormData({});
  }

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

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
        {/* Product cards will go here */}
      </div>

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>Add New Product</SheetTitle>
            <ProductImageUpload imageFile={imageFile} setImageFile={setImageFile} uploadedImageUrl={uploadedImageUrl} setUploadedImageUrl={setUploadedImageUrl}/>
            <div className="py-6">
              <CommonForm
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateProduct}
                buttonText="Add Product"
                isBtnDisabled={false}
              />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;
