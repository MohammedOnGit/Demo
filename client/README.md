Todo
Modify menu Items in Config.js

Change product Schema in models/product.js

--Modify to fit requirment in server/controllers/admin/product-controller.js--
const addProduct = async (req, res) => {
  try {
    const {
      image,
      title,
      description,
      category,
      brand,
      price,
      salePrice,
      totalStock,
    } = req.body;


    ----modify in pages/admin-view/product.jsx

    const initialFormData = {
  title: "",
  description: "",
  category: "",
  brand: "",
  price: "",
  salePrice: "",
  image: "",
};


-----modify the whole file in client/config/index.jsx