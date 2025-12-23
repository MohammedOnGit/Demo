// ================= AUTH FORMS =================
export const registerFormControls = [
  {
    label: "Username",
    name: "userName",
    type: "text",
    placeholder: "Enter your username",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

export const loginFormControls = [
  {
    label: "Email",
    name: "email",
    type: "email",
    placeholder: "Enter your email",
    required: true,
  },
  {
    label: "Password",
    name: "password",
    type: "password",
    placeholder: "Enter your password",
    required: true,
  },
];

// ================= PRODUCT FORM =================
export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
    required: true,
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
    required: true,
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    required: true,
    options: [
      { id: "men", label: "Men" },
      { id: "women", label: "Women" },
      { id: "kids", label: "Kids" },
      { id: "accessories", label: "Accessories" },
      { id: "footwear", label: "Footwear" },
    ],
  },
  {
    label: "Brand",
    name: "brand",
    componentType: "select",
    required: true,
    options: [
      { id: "nike", label: "Nike" },
      { id: "adidas", label: "Adidas" },
      { id: "puma", label: "Puma" },
      { id: "levi", label: "Levi's" },
      { id: "zara", label: "Zara" },
      { id: "hm", label: "H&M" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
    required: true,
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
    required: false,
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
    required: true,
  },
];

// ================= HEADER MENU =================
export const shopingViewHeaderMenuItems = [
  { id: "home", label: "Home", path: "/shop/home" },
  { id: "men", label: "Men", path: "/shop/listing" },
  { id: "women", label: "Women", path: "/shop/listing" },
  { id: "kids", label: "Kids", path: "/shop/listing" },
  { id: "accessories", label: "Accessories", path: "/shop/listing" },
  { id: "footwear", label: "Footwear", path: "/shop/listing" },
];

// ================= MAPS =================
export const categoryOptionsMap = {
  men: "Men",
  women: "Women",
  kids: "Kids",
  accessories: "Accessories",
  footwear: "Footwear",
};

export const brandOptionsMap = {
  nike: "Nike",
  adidas: "Adidas",
  puma: "Puma",
  levi: "Levi's",
  zara: "Zara",
  hm: "H&M",
};

// ================= FILTERS =================
export const filterOptions = {
  category: Object.entries(categoryOptionsMap).map(([id, label]) => ({
    id,
    label,
  })),
  brand: Object.entries(brandOptionsMap).map(([id, label]) => ({
    id,
    label,
  })),
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

// ================= ADDRESS FORM =================
export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
    required: true,
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
    required: true,
  },
  {
    label: "Digital Address",
    name: "digitalAddress",
    componentType: "input",
    type: "text",
    placeholder: "Enter your digital address e.g NT-123-4567",
    required: true,
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
    required: true,
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes (optional)",
    required: false,
  },
];

// ================= HELPERS =================
export const getRequiredFields = (formControls = []) => {
  return formControls
    .filter((control) => control.required)
    .map((control) => control.name);
};

