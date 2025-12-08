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
  deletedProduct,
} from "@/store/admin/product-slice";

import { PackageOpen } from "lucide-react";
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

  // ✅ SUBMIT (ADD / EDIT)
  function onSubmit(event) {
    event.preventDefault();
    if (imageLoadingState) return toast.error("Image is still uploading...");
    if (!uploadedImageUrl && !currentEditedId)
      return toast.error("Upload a product image first");
    if (!formData.title || !formData.price || !formData.category) {
      return toast.error("Please fill all required fields");
    }

    const payload = {
      ...formData,
      image: uploadedImageUrl || formData.image,
    };

    if (currentEditedId) {
      dispatch(editProduct({ productId: currentEditedId, formData: payload }))
        .unwrap()
        .then(() => {
          toast.success("Product updated successfully!");
          dispatch(fetchAllProducts());
          resetForm();
        })
        .catch(() => toast.error("Failed to update product"));
    } else {
      dispatch(addNewProduct(payload))
        .unwrap()
        .then(() => {
          toast.success("Product added successfully!");
          dispatch(fetchAllProducts());
          resetForm();
        })
        .catch(() => toast.error("Failed to add product"));
    }
  }

  // ✅ DELETE
  function handleDelete(productId) {
    dispatch(deletedProduct({ productId }))
      .unwrap()
      .then(() => {
        toast.success("Product deleted successfully!");
        dispatch(fetchAllProducts());
      })
      .catch(() => toast.error("Failed to delete product"));
  }

  function resetForm() {
    setFormData(initialFormData);
    setUploadedImageUrl("");
    setImageFile(null);
    setImageLoadingState(false);
    setCurrentEditedId(null);
    setOpenCreateProductDialog(false);
  }

  function isProductListEmpty() {
    return !products || products.length === 0;
  }

  const isFormInvalid =
    !formData.title || !formData.price || !formData.category;

  return (
    <Fragment>
      {/* ✅ ADD BUTTON */}
      <div className="mb-5 w-full flex justify-end">
        <button
          onClick={() => {
            resetForm();
            setOpenCreateProductDialog(true);
          }}
          className={`${
            isProductListEmpty() ? "hidden " : ""
          }px-4 py-2 bg-black text-white rounded`}
        >
          Add New Product
        </button>
      </div>

      {/* ✅ ✅ ✅ PRODUCTS GRID / EMPTY STATE */}
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4 min-h-[70vh]">
        {!isProductListEmpty() ? (
          products.map((product) => (
            <AdminProductTile
              key={product._id}
              product={product}
              setCurrentEditedId={setCurrentEditedId}
              setOpenCreateProductDialog={setOpenCreateProductDialog}
              setFormData={setFormData}
              isEditMode={currentEditedId === product._id}
              handleDelete={handleDelete}
            />
          ))
        ) : (
          // ✅ PERFECTLY CENTERED EMPTY STATE
          <div className="col-span-full flex items-center justify-center">
            <div className="flex flex-col items-center text-center text-gray-500">
              <PackageOpen size={90} className="mb-4 text-gray-400" />
              {/* <h2 className="text-xl font-semibold text-gray-700">
          No products available
        </h2> */}
              <h2 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                No products available
              </h2>

              <p className="mt-2 text-sm">
                Click below to add your first product
              </p>
              <button
                className="mt-5 px-5 py-2 bg-black text-white rounded"
                onClick={() => {
                  resetForm();
                  setOpenCreateProductDialog(true);
                }}
              >
                ➕ Add First Product
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ✅ ✅ ✅ SHEET (ADD / EDIT FORM) */}
      <Sheet
        open={openCreateProductDialog}
        onOpenChange={setOpenCreateProductDialog}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle className="text-center text-xl font-bold">
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
                onSubmit={onSubmit}
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
