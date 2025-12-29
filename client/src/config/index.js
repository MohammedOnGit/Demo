// // // ================= AUTH FORMS =================
// // export const registerFormControls = [
// //   {
// //     label: "Username",
// //     name: "userName",
// //     type: "text",
// //     placeholder: "Enter your username",
// //     required: true,
// //   },
// //   {
// //     label: "Email",
// //     name: "email",
// //     type: "email",
// //     placeholder: "Enter your email",
// //     required: true,
// //   },
// //   {
// //     label: "Password",
// //     name: "password",
// //     type: "password",
// //     placeholder: "Enter your password",
// //     required: true,
// //   },
// // ];

// // export const loginFormControls = [
// //   {
// //     label: "Email",
// //     name: "email",
// //     type: "email",
// //     placeholder: "Enter your email",
// //     required: true,
// //   },
// //   {
// //     label: "Password",
// //     name: "password",
// //     type: "password",
// //     placeholder: "Enter your password",
// //     required: true,
// //   },
// // ];

// // // ================= PRODUCT FORM =================
// // export const addProductFormElements = [
// //   {
// //     label: "Title",
// //     name: "title",
// //     componentType: "input",
// //     type: "text",
// //     placeholder: "Enter product title",
// //     required: true,
// //   },
// //   {
// //     label: "Description",
// //     name: "description",
// //     componentType: "textarea",
// //     placeholder: "Enter product description",
// //     required: true,
// //   },
// //   {
// //     label: "Category",
// //     name: "category",
// //     componentType: "select",
// //     required: true,
// //     options: [
// //       { id: "men", label: "Men" },
// //       { id: "women", label: "Women" },
// //       { id: "kids", label: "Kids" },
// //       { id: "accessories", label: "Accessories" },
// //       { id: "footwear", label: "Footwear" },
// //     ],
// //   },
// //   {
// //     label: "Brand",
// //     name: "brand",
// //     componentType: "select",
// //     required: true,
// //     options: [
// //       { id: "nike", label: "Nike" },
// //       { id: "adidas", label: "Adidas" },
// //       { id: "puma", label: "Puma" },
// //       { id: "levi", label: "Levi's" },
// //       { id: "zara", label: "Zara" },
// //       { id: "hm", label: "H&M" },
// //     ],
// //   },
// //   {
// //     label: "Price",
// //     name: "price",
// //     componentType: "input",
// //     type: "number",
// //     placeholder: "Enter product price",
// //     required: true,
// //   },
// //   {
// //     label: "Sale Price",
// //     name: "salePrice",
// //     componentType: "input",
// //     type: "number",
// //     placeholder: "Enter sale price (optional)",
// //     required: false,
// //   },
// //   {
// //     label: "Total Stock",
// //     name: "totalStock",
// //     componentType: "input",
// //     type: "number",
// //     placeholder: "Enter total stock",
// //     required: true,
// //   },
// // ];

// // // ================= HEADER MENU =================
// // export const shopingViewHeaderMenuItems = [
// //   { id: "home", label: "Home", path: "/shop/home" },
// //   { id: "men", label: "Men", path: "/shop/listing" },
// //   { id: "women", label: "Women", path: "/shop/listing" },
// //   { id: "kids", label: "Kids", path: "/shop/listing" },
// //   { id: "accessories", label: "Accessories", path: "/shop/listing" },
// //   { id: "footwear", label: "Footwear", path: "/shop/listing" },
// // ];

// // // ================= MAPS =================
// // export const categoryOptionsMap = {
// //   men: "Men",
// //   women: "Women",
// //   kids: "Kids",
// //   accessories: "Accessories",
// //   footwear: "Footwear",
// // };

// // export const brandOptionsMap = {
// //   nike: "Nike",
// //   adidas: "Adidas",
// //   puma: "Puma",
// //   levi: "Levi's",
// //   zara: "Zara",
// //   hm: "H&M",
// // };

// // // ================= FILTERS =================
// // export const filterOptions = {
// //   category: Object.entries(categoryOptionsMap).map(([id, label]) => ({
// //     id,
// //     label,
// //   })),
// //   brand: Object.entries(brandOptionsMap).map(([id, label]) => ({
// //     id,
// //     label,
// //   })),
// // };

// // export const sortOptions = [
// //   { id: "price-lowtohigh", label: "Price: Low to High" },
// //   { id: "price-hightolow", label: "Price: High to Low" },
// //   { id: "title-atoz", label: "Title: A to Z" },
// //   { id: "title-ztoa", label: "Title: Z to A" },
// // ];

// // // ================= ADDRESS FORM =================
// // export const addressFormControls = [
// //   {
// //     label: "Address",
// //     name: "address",
// //     componentType: "input",
// //     type: "text",
// //     placeholder: "Enter your address",
// //     required: true,
// //   },
// //   {
// //     label: "City",
// //     name: "city",
// //     componentType: "input",
// //     type: "text",
// //     placeholder: "Enter your city",
// //     required: true,
// //   },
// //   {
// //     label: "Digital Address",
// //     name: "digitalAddress",
// //     componentType: "input",
// //     type: "text",
// //     placeholder: "Enter your digital address e.g NT-123-4567",
// //     required: true,
// //   },
// //   {
// //     label: "Phone",
// //     name: "phone",
// //     componentType: "input",
// //     type: "text",
// //     placeholder: "Enter your phone number",
// //     required: true,
// //   },
// //   {
// //     label: "Notes",
// //     name: "notes",
// //     componentType: "textarea",
// //     placeholder: "Enter any additional notes (optional)",
// //     required: false,
// //   },
// // ];

// // // ================= HELPERS =================
// // export const getRequiredFields = (formControls = []) => {
// //   return formControls
// //     .filter((control) => control.required)
// //     .map((control) => control.name);
// // };

// // config/index.js - Updated with search functionality
// // ================= AUTH FORMS =================

// export const registerFormControls = [
//   {
//     label: "Username",
//     name: "userName",
//     type: "text",
//     placeholder: "Enter your username",
//     required: true,
//   },
//   {
//     label: "Email",
//     name: "email",
//     type: "email",
//     placeholder: "Enter your email",
//     required: true,
//   },
//   {
//     label: "Password",
//     name: "password",
//     type: "password",
//     placeholder: "Enter your password",
//     required: true,
//   },
// ];

// export const loginFormControls = [
//   {
//     label: "Email",
//     name: "email",
//     type: "email",
//     placeholder: "Enter your email",
//     required: true,
//   },
//   {
//     label: "Password",
//     name: "password",
//     type: "password",
//     placeholder: "Enter your password",
//     required: true,
//   },
// ];

// // ================= PRODUCT FORM =================
// export const addProductFormElements = [
//   {
//     label: "Title",
//     name: "title",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter product title",
//     required: true,
//   },
//   {
//     label: "Description",
//     name: "description",
//     componentType: "textarea",
//     placeholder: "Enter product description",
//     required: true,
//   },
//   {
//     label: "Category",
//     name: "category",
//     componentType: "select",
//     required: true,
//     options: [
//       { id: "men", label: "Men" },
//       { id: "women", label: "Women" },
//       { id: "kids", label: "Kids" },
//       { id: "accessories", label: "Accessories" },
//       { id: "footwear", label: "Footwear" },
//     ],
//   },
//   {
//     label: "Brand",
//     name: "brand",
//     componentType: "select",
//     required: true,
//     options: [
//       { id: "nike", label: "Nike" },
//       { id: "adidas", label: "Adidas" },
//       { id: "puma", label: "Puma" },
//       { id: "levi", label: "Levi's" },
//       { id: "zara", label: "Zara" },
//       { id: "hm", label: "H&M" },
//     ],
//   },
//   {
//     label: "Price",
//     name: "price",
//     componentType: "input",
//     type: "number",
//     placeholder: "Enter product price",
//     required: true,
//   },
//   {
//     label: "Sale Price",
//     name: "salePrice",
//     componentType: "input",
//     type: "number",
//     placeholder: "Enter sale price (optional)",
//     required: false,
//   },
//   {
//     label: "Total Stock",
//     name: "totalStock",
//     componentType: "input",
//     type: "number",
//     placeholder: "Enter total stock",
//     required: true,
//   },
// ];

// // ================= HEADER MENU =================
// export const shopingViewHeaderMenuItems = [
//   { id: "home", label: "Home", path: "/shop/home" },
//   { id: "men", label: "Men", path: "/shop/listing" },
//   { id: "women", label: "Women", path: "/shop/listing" },
//   { id: "kids", label: "Kids", path: "/shop/listing" },
//   { id: "accessories", label: "Accessories", path: "/shop/listing" },
//   { id: "footwear", label: "Footwear", path: "/shop/listing" },
// ];

// // ================= MAPS =================
// export const categoryOptionsMap = {
//   men: "Men",
//   women: "Women",
//   kids: "Kids",
//   accessories: "Accessories",
//   footwear: "Footwear",
// };

// export const brandOptionsMap = {
//   nike: "Nike",
//   adidas: "Adidas",
//   puma: "Puma",
//   levi: "Levi's",
//   zara: "Zara",
//   hm: "H&M",
// };

// // ================= SEARCH CONFIG =================
// export const searchConfig = {
//   // API endpoints
//   api: {
//     baseUrl: "http://localhost:5000/api",
//     endpoints: {
//       suggestions: "/shop/search/suggestions",
//       search: "/shop/search",
//       popular: "/shop/search/popular",
//       filters: "/shop/search/filters",
//       autocomplete: "/shop/search/autocomplete"
//     }
//   },
  
//   // Search settings
//   settings: {
//     debounceTime: 300,
//     maxRecentSearches: 5,
//     maxSuggestions: 8,
//     minQueryLength: 2,
//     cacheDuration: 300000, // 5 minutes
//   },
  
//   // Popular searches (fallback)
//   popularSearches: [
//     "Men's Cologne",
//     "Women's Perfume", 
//     "Gift Sets",
//     "Luxury Fragrances",
//     "New Arrivals",
//     "Best Sellers",
//     "Summer Scents",
//     "Winter Perfumes"
//   ],
  
//   // Search categories for quick access
//   searchCategories: [
//     { id: "men", label: "Men's", icon: "👔", path: "/shop/listing?category=men" },
//     { id: "women", label: "Women's", icon: "👗", path: "/shop/listing?category=women" },
//     { id: "unisex", label: "Unisex", icon: "⚧️", path: "/shop/listing?category=unisex" },
//     { id: "gift-sets", label: "Gift Sets", icon: "🎁", path: "/shop/search?q=gift+sets" },
//     { id: "luxury", label: "Luxury", icon: "💎", path: "/shop/listing?collection=luxury" },
//     { id: "new", label: "New Arrivals", icon: "🆕", path: "/shop/listing?sort=newest" }
//   ],
  
//   // Price ranges for filtering
//   priceRanges: [
//     { id: "under-50", label: "Under ₵50", min: 0, max: 50 },
//     { id: "50-100", label: "₵50 - ₵100", min: 50, max: 100 },
//     { id: "100-200", label: "₵100 - ₵200", min: 100, max: 200 },
//     { id: "200-500", label: "₵200 - ₵500", min: 200, max: 500 },
//     { id: "500-plus", label: "₵500+", min: 500, max: 10000 },
//   ],
  
//   // Sort options
//   sortOptions: [
//     { id: "relevance", label: "Relevance", value: "relevance" },
//     { id: "price-low", label: "Price: Low to High", value: "price_asc" },
//     { id: "price-high", label: "Price: High to Low", value: "price_desc" },
//     { id: "newest", label: "Newest First", value: "newest" },
//     { id: "popular", label: "Most Popular", value: "popular" },
//     { id: "rating", label: "Highest Rated", value: "rating_desc" },
//   ],
  
//   // View modes
//   viewModes: [
//     { id: "grid", label: "Grid View", icon: "Grid" },
//     { id: "list", label: "List View", icon: "List" },
//   ],
  
//   // Filter defaults
//   defaultFilters: {
//     category: [],
//     brand: [],
//     priceRange: [],
//     rating: 0,
//     inStock: true,
//   }
// };

// // ================= FILTERS =================
// export const filterOptions = {
//   category: Object.entries(categoryOptionsMap).map(([id, label]) => ({
//     id,
//     label,
//   })),
//   brand: Object.entries(brandOptionsMap).map(([id, label]) => ({
//     id,
//     label,
//   })),
// };

// export const sortOptions = [
//   { id: "price-lowtohigh", label: "Price: Low to High" },
//   { id: "price-hightolow", label: "Price: High to Low" },
//   { id: "title-atoz", label: "Title: A to Z" },
//   { id: "title-ztoa", label: "Title: Z to A" },
// ];

// // ================= ADDRESS FORM =================
// export const addressFormControls = [
//   {
//     label: "Address",
//     name: "address",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your address",
//     required: true,
//   },
//   {
//     label: "City",
//     name: "city",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your city",
//     required: true,
//   },
//   {
//     label: "Digital Address",
//     name: "digitalAddress",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your digital address e.g NT-123-4567",
//     required: true,
//   },
//   {
//     label: "Phone",
//     name: "phone",
//     componentType: "input",
//     type: "text",
//     placeholder: "Enter your phone number",
//     required: true,
//   },
//   {
//     label: "Notes",
//     name: "notes",
//     componentType: "textarea",
//     placeholder: "Enter any additional notes (optional)",
//     required: false,
//   },
// ];



// // ================= HELPERS =================
// export const getRequiredFields = (formControls = []) => {
//   return formControls
//     .filter((control) => control.required)
//     .map((control) => control.name);
// };

// // ================= SEARCH UTILS =================
// export const searchUtils = {
//   // Parse URL search parameters
//   parseSearchParams: (searchParams) => {
//     const params = {};
//     for (const [key, value] of searchParams.entries()) {
//       if (key === 'category' || key === 'brand' || key === 'priceRange') {
//         params[key] = value.split(',');
//       } else if (key === 'minPrice' || key === 'maxPrice' || key === 'rating' || key === 'page' || key === 'limit') {
//         params[key] = Number(value);
//       } else if (key === 'inStock') {
//         params[key] = value === 'true';
//       } else {
//         params[key] = value;
//       }
//     }
//     return params;
//   },

//   // Build URL search parameters
//   buildSearchParams: (params) => {
//     const searchParams = new URLSearchParams();
    
//     Object.entries(params).forEach(([key, value]) => {
//       if (Array.isArray(value) && value.length > 0) {
//         searchParams.set(key, value.join(','));
//       } else if (value !== undefined && value !== null && value !== '') {
//         searchParams.set(key, value.toString());
//       }
//     });
    
//     return searchParams.toString();
//   },

//   // Generate search cache key
//   generateCacheKey: (params) => {
//     const sortedParams = Object.keys(params)
//       .sort()
//       .reduce((acc, key) => {
//         acc[key] = params[key];
//         return acc;
//       }, {});
    
//     return `search_${JSON.stringify(sortedParams)}`;
//   },

//   // Validate search query
//   validateSearchQuery: (query) => {
//     if (!query || typeof query !== 'string') return false;
//     const trimmed = query.trim();
//     return trimmed.length >= searchConfig.settings.minQueryLength;
//   },

//   // Format search suggestions
//   formatSuggestions: (suggestions) => {
//     return suggestions.map(suggestion => ({
//       ...suggestion,
//       highlighted: suggestion.text.replace(
//         /(<mark>|<\/mark>)/g,
//         '<strong class="text-primary">'
//       ).replace(
//         /<\/mark>/g,
//         '</strong>'
//       )
//     }));
//   }
// };


// // ================= AUTH FORMS =================
// export const registerFormControls = [
//   { label: "Username", name: "userName", type: "text", placeholder: "Enter your username", required: true },
//   { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
//   { label: "Password", name: "password", type: "password", placeholder: "Enter your password", required: true },
// ];

// export const loginFormControls = [
//   { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
//   { label: "Password", name: "password", type: "password", placeholder: "Enter your password", required: true },
// ];

// // ================= PRODUCT FORM =================
// export const addProductFormElements = [
//   { label: "Title", name: "title", componentType: "input", type: "text", required: true },
//   { label: "Description", name: "description", componentType: "textarea", required: true },
//   {
//     label: "Category",
//     name: "category",
//     componentType: "select",
//     required: true,
//     options: [
//       { id: "men", label: "Men" },
//       { id: "women", label: "Women" },
//       { id: "kids", label: "Kids" },
//       { id: "accessories", label: "Accessories" },
//       { id: "footwear", label: "Footwear" },
//     ],
//   },
//   {
//     label: "Brand",
//     name: "brand",
//     componentType: "select",
//     required: true,
//     options: [
//       { id: "nike", label: "Nike" },
//       { id: "adidas", label: "Adidas" },
//       { id: "puma", label: "Puma" },
//       { id: "levi", label: "Levi's" },
//       { id: "zara", label: "Zara" },
//       { id: "hm", label: "H&M" },
//     ],
//   },
//   { label: "Price", name: "price", componentType: "input", type: "number", required: true },
//   { label: "Sale Price", name: "salePrice", componentType: "input", type: "number" },
//   { label: "Total Stock", name: "totalStock", componentType: "input", type: "number", required: true },
// ];

// // ================= MAPS =================
// export const categoryOptionsMap = {
//   men: "Men",
//   women: "Women",
//   kids: "Kids",
//   accessories: "Accessories",
//   footwear: "Footwear",
// };

// export const brandOptionsMap = {
//   nike: "Nike",
//   adidas: "Adidas",
//   puma: "Puma",
//   levi: "Levi's",
//   zara: "Zara",
//   hm: "H&M",
// };

// // ================= FILTERS =================
// export const filterOptions = {
//   category: Object.entries(categoryOptionsMap).map(([id, label]) => ({ id, label })),
//   brand: Object.entries(brandOptionsMap).map(([id, label]) => ({ id, label })),
// };

// export const sortOptions = [
//   { id: "price-lowtohigh", label: "Price: Low to High" },
//   { id: "price-hightolow", label: "Price: High to Low" },
//   { id: "title-atoz", label: "Title: A to Z" },
//   { id: "title-ztoa", label: "Title: Z to A" },
// ];

// // ================= SEARCH CONFIG =================
// export const searchConfig = {
//   api: {
//     baseUrl: "http://localhost:5000/api",
//     endpoints: {
//       suggestions: "/shop/search/suggestions",
//       search: "/shop/search",
//     },
//   },
//   settings: {
//     debounceTime: 300,
//     minQueryLength: 2,
//   },
// };

// // ================= SEARCH UTILS =================
// export const searchUtils = {
//   validateSearchQuery: (query) =>
//     typeof query === "string" &&
//     query.trim().length >= searchConfig.settings.minQueryLength,
// };

// // ================= HELPERS =================
// export const getRequiredFields = (controls = []) =>
//   controls.filter(c => c.required).map(c => c.name);

// ================= AUTH FORMS =================
// ================= APP CONFIG =================
// ================= APP CONFIG =================

// ================= AUTH FORMS =================
export const registerFormControls = [
  { label: "Username", name: "userName", type: "text", placeholder: "Enter your username", required: true },
  { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
  { label: "Password", name: "password", type: "password", placeholder: "Enter your password", required: true },
];

export const loginFormControls = [
  { label: "Email", name: "email", type: "email", placeholder: "Enter your email", required: true },
  { label: "Password", name: "password", type: "password", placeholder: "Enter your password", required: true },
];

// ================= PRODUCT FORM =================
export const addProductFormElements = [
  { label: "Title", name: "title", componentType: "input", type: "text", placeholder: "Enter product title", required: true },
  { label: "Description", name: "description", componentType: "textarea", placeholder: "Enter product description", required: true },
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
  { label: "Price", name: "price", componentType: "input", type: "number", placeholder: "Enter product price", required: true },
  { label: "Sale Price", name: "salePrice", componentType: "input", type: "number", placeholder: "Enter sale price (optional)" },
  { label: "Total Stock", name: "totalStock", componentType: "input", type: "number", placeholder: "Enter total stock", required: true },
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
export const categoryOptionsMap = { men: "Men", women: "Women", kids: "Kids", accessories: "Accessories", footwear: "Footwear" };
export const brandOptionsMap = { nike: "Nike", adidas: "Adidas", puma: "Puma", levi: "Levi's", zara: "Zara", hm: "H&M" };

// ================= FILTERS =================
export const filterOptions = {
  category: Object.entries(categoryOptionsMap).map(([id, label]) => ({ id, label })),
  brand: Object.entries(brandOptionsMap).map(([id, label]) => ({ id, label })),
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

// ================= ADDRESS FORM =================
export const addressFormControls = [
  { label: "Address", name: "address", componentType: "input", type: "text", placeholder: "Enter your address", required: true },
  { label: "City", name: "city", componentType: "input", type: "text", placeholder: "Enter your city", required: true },
  { label: "Digital Address", name: "digitalAddress", componentType: "input", type: "text", placeholder: "Enter your digital address e.g NT-123-4567", required: true },
  { label: "Phone", name: "phone", componentType: "input", type: "text", placeholder: "Enter your phone number", required: true },
  { label: "Notes", name: "notes", componentType: "textarea", placeholder: "Enter any additional notes (optional)" },
];

// ================= SEARCH CONFIG =================
export const searchConfig = {
  api: {
    baseUrl: "http://localhost:5000/api",
    endpoints: {
      suggestions: "/shop/search/suggestions",
      search: "/shop/search",
      popular: "/shop/search/popular",
      filters: "/shop/search/filters",
      autocomplete: "/shop/search/autocomplete",
    },
  },
  settings: { debounceTime: 300, maxRecentSearches: 5, maxSuggestions: 8, minQueryLength: 2, cacheDuration: 300000 },
  popularSearches: ["Men's Cologne", "Women's Perfume", "Gift Sets", "Luxury Fragrances", "New Arrivals", "Best Sellers", "Summer Scents", "Winter Perfumes"],
  searchCategories: [
    { id: "men", label: "Men's", icon: "👔", path: "/shop/listing?category=men" },
    { id: "women", label: "Women's", icon: "👗", path: "/shop/listing?category=women" },
    { id: "unisex", label: "Unisex", icon: "⚧️", path: "/shop/listing?category=unisex" },
    { id: "gift-sets", label: "Gift Sets", icon: "🎁", path: "/shop/search?q=gift+sets" },
    { id: "luxury", label: "Luxury", icon: "💎", path: "/shop/listing?collection=luxury" },
    { id: "new", label: "New Arrivals", icon: "🆕", path: "/shop/listing?sort=newest" },
  ],
  priceRanges: [
    { id: "under-50", label: "Under ₵50", min: 0, max: 50 },
    { id: "50-100", label: "₵50 - ₵100", min: 50, max: 100 },
    { id: "100-200", label: "₵100 - ₵200", min: 100, max: 200 },
    { id: "200-500", label: "₵200 - ₵500", min: 200, max: 500 },
    { id: "500-plus", label: "₵500+", min: 500, max: 10000 },
  ],
  sortOptions: [
    { id: "relevance", label: "Relevance", value: "relevance" },
    { id: "price-low", label: "Price: Low to High", value: "price_asc" },
    { id: "price-high", label: "Price: High to Low", value: "price_desc" },
    { id: "newest", label: "Newest First", value: "newest" },
    { id: "popular", label: "Most Popular", value: "popular" },
    { id: "rating", label: "Highest Rated", value: "rating_desc" },
  ],
  viewModes: [
    { id: "grid", label: "Grid View", icon: "Grid" },
    { id: "list", label: "List View", icon: "List" },
  ],
  defaultFilters: { category: [], brand: [], priceRange: [], rating: 0, inStock: true },
};

// ================= SEARCH UTILS =================
export const searchUtils = {
  parseSearchParams: (searchParams) => {
    const params = {};
    for (const [key, value] of searchParams.entries()) {
      if (["category", "brand", "priceRange"].includes(key)) params[key] = value.split(",");
      else if (["minPrice", "maxPrice", "rating", "page", "limit"].includes(key)) params[key] = Number(value);
      else if (key === "inStock") params[key] = value === "true";
      else params[key] = value;
    }
    return params;
  },
  buildSearchParams: (params) => {
    const sp = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (Array.isArray(v) && v.length > 0) sp.set(k, v.join(","));
      else if (v !== undefined && v !== null && v !== "") sp.set(k, v.toString());
    });
    return sp.toString();
  },
  generateCacheKey: (params) => `search_${JSON.stringify(Object.keys(params).sort().reduce((acc, k) => ((acc[k] = params[k]), acc), {}))}`,
  validateSearchQuery: (query) => typeof query === "string" && query.trim().length >= searchConfig.settings.minQueryLength,
  formatSuggestions: (suggestions) => suggestions.map(s => ({ ...s, highlighted: s.text.replace(/(<mark>|<\/mark>)/g, '<strong class="text-primary">').replace(/<\/mark>/g, '</strong>') })),
};

// ================= HELPERS =================
export const getRequiredFields = (formControls = []) => formControls.filter(c => c.required).map(c => c.name);
