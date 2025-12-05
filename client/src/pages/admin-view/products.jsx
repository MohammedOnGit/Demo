import { Fragment, useEffect, useState } from "react";
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
import {
  fetchAllProducts,
  addNewProduct,
  editProduct,
} from "@/store/admin/product-slice";
import { toast } from "sonner";
import AdminProductTile from "@/components/admin-view/product-tile";

const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  image: "", 
};

function AdminProducts() {
  const [openCreateProductDialog, setOpenCreateProductDialog] = useState(false);
  const [formData, setFormData] = useState(initialFormData);

  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);

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

    if (!uploadedImageUrl && !currentEditedId) {
      toast.error("Upload a product image first");
      return;
    }

    if (!formData.title || !formData.price || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }

    const payload = {
      ...formData,
      image: uploadedImageUrl || formData.image, // use existing image if editing
    };

    if (currentEditedId) {
      // ✅ EDIT PRODUCT
      dispatch(editProduct({ productId: currentEditedId, formData: payload }))
        .unwrap()
        .then(() => {
          toast.success("Product updated!");
          dispatch(fetchAllProducts());
          resetForm();
        })
        .catch((error) => {
          console.error("Update product failed:", error);
          toast.error("Failed to update product");
        });
    } else {
      // ✅ ADD NEW PRODUCT
      dispatch(addNewProduct(payload))
        .unwrap()
        .then(() => {
          toast.success("Product added!");
          dispatch(fetchAllProducts());
          resetForm();
        })
        .catch((error) => {
          console.error("Add product failed:", error);
          toast.error("Failed to add product");
        });
    }
  }

  function resetForm() {
    setFormData(initialFormData);
    setUploadedImageUrl("");
    setImageFile(null);
    setImageLoadingState(false);
    setCurrentEditedId(null);
    setOpenCreateProductDialog(false);
  }

  const isFormInvalid =
    !formData.title || !formData.price || !formData.category;

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <button
          onClick={() => {
            resetForm();
            setOpenCreateProductDialog(true);
          }}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add New Product
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products && products.length > 0
          ? products.map((product) => (
              <AdminProductTile
                key={product._id}
                product={product}
                setCurrentEditedId={setCurrentEditedId}
                setOpenCreateProductDialog={setOpenCreateProductDialog}
                setFormData={setFormData}
                isEditMode={currentEditedId === product._id}
              />
            ))
          : null}
      </div>

      <Sheet
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className='text-center text-xl font-bold'>
              {currentEditedId ? "Edit Product" : "Add New Product"}
            </SheetTitle>

            <ProductImageUpload
              imageFile={imageFile}
              setImageFile={setImageFile}
              uploadedImageUrl={uploadedImageUrl || formData.image}
              setUploadedImageUrl={setUploadedImageUrl}
              setImageLoadingState={setImageLoadingState}
              isEditMode={currentEditedId !== null}
            />

            <div className="py-6">
              <CommonForm 
                formControls={addProductFormElements}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleCreateProduct}
                buttonText={
                  currentEditedId
                    ? imageLoadingState
                      ? "Updating..."
                      : "Update Product"
                    : imageLoadingState
                    ? "Uploading..."
                    : "Add Product"
                }
                isBtnDisabled={
                  imageLoadingState ||
                  (!uploadedImageUrl && !currentEditedId) ||
                  isFormInvalid
                }
              />
            </div>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    </Fragment>
  );
}

export default AdminProducts;

