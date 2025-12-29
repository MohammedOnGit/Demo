


//API CALLS REPLACEMENT
const express = require("express");
const router = express.Router();
const Product = require("../../models/Product");

// Search products with filters
router.get("/", async (req, res) => {
  try {
    const { 
      q: searchQuery, 
      category, 
      brand, 
      minPrice, 
      maxPrice, 
      inStock, 
      onSale,
      sortBy = "relevance",
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    let query = {};

    // Text search
    if (searchQuery) {
      query.$or = [
        { title: { $regex: searchQuery, $options: "i" } },
        { description: { $regex: searchQuery, $options: "i" } },
        { category: { $regex: searchQuery, $options: "i" } },
        { brand: { $regex: searchQuery, $options: "i" } }
      ];
    }

    // Category filter
    if (category) {
      const categories = category.split(',');
      query.category = { $in: categories };
    }

    // Brand filter
    if (brand) {
      const brands = brand.split(',');
      query.brand = { $in: brands };
    }

    // Price range filter
    if (minPrice || maxPrice) {
      query.$or = [
        {
          salePrice: {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) })
          }
        },
        {
          $and: [
            { salePrice: { $exists: false } },
            {
              price: {
                ...(minPrice && { $gte: Number(minPrice) }),
                ...(maxPrice && { $lte: Number(maxPrice) })
              }
            }
          ]
        }
      ];
    }

    // In stock filter
    if (inStock === 'true') {
      query.totalStock = { $gt: 0 };
    }

    // On sale filter
    if (onSale === 'true') {
      query.$expr = { $lt: ["$salePrice", "$price"] };
    }

    // Calculate pagination
    const skip = (page - 1) * limit;

    // Sort options
    let sort = {};
    switch (sortBy) {
      case "price-low":
        sort = { salePrice: 1, price: 1 };
        break;
      case "price-high":
        sort = { salePrice: -1, price: -1 };
        break;
      case "newest":
        sort = { createdAt: -1 };
        break;
      default:
        sort = { createdAt: -1 };
    }

    // Execute query
    const products = await Product.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .select("-__v")
      .lean();

    // Get total count for pagination
    const total = await Product.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    // Get unique categories and brands for filters
    const categories = await Product.distinct("category", query);
    const brands = await Product.distinct("brand", query).then(brands => brands.filter(b => b && b.trim() !== ''));

    // Get price range
    const priceRange = await Product.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          minPrice: { 
            $min: { 
              $cond: [
                { $and: [{ $ne: ["$salePrice", null] }, { $gt: ["$salePrice", 0] }] },
                "$salePrice",
                "$price"
              ]
            } 
          },
          maxPrice: { 
            $max: { 
              $cond: [
                { $and: [{ $ne: ["$salePrice", null] }, { $gt: ["$salePrice", 0] }] },
                "$salePrice",
                "$price"
              ]
            } 
          }
        }
      }
    ]);

    res.json({
      success: true,
      data: {
        products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        },
        filters: {
          categories,
          brands,
          priceRange: priceRange[0] || { minPrice: 0, maxPrice: 1000 }
        },
        query: searchQuery || ''
      }
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during search",
      error: error.message
    });
  }
});

// Get search suggestions
router.get("/suggestions", async (req, res) => {
  try {
    const { q: query } = req.query;
    
    if (!query || query.length < 2) {
      return res.json({ success: true, suggestions: [] });
    }

    // Search for products
    const products = await Product.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { brand: { $regex: query, $options: "i" } }
      ]
    })
    .limit(8)
    .select("title category brand price salePrice")
    .lean();

    // Get unique categories that match the query
    const categories = await Product.distinct("category", {
      category: { $regex: query, $options: "i" }
    });

    // Get unique brands that match the query
    const brands = await Product.distinct("brand", {
      brand: { $regex: query, $options: "i" }
    }).then(brands => brands.filter(b => b && b.trim() !== ''));

    // Format suggestions
    const suggestions = [
      // Product suggestions
      ...products.map(product => ({
        id: product._id.toString(),
        text: product.title,
        type: 'product',
        category: product.category,
        brand: product.brand || '',
        price: product.salePrice || product.price
      })),
      
      // Category suggestions
      ...categories.slice(0, 3).map(category => ({
        id: `cat_${category}`,
        text: `Search in ${category}`,
        type: 'category',
        category: category
      })),
      
      // Brand suggestions
      ...brands.slice(0, 3).map(brand => ({
        id: `brand_${brand}`,
        text: brand,
        type: 'brand'
      }))
    ].slice(0, 10); // Limit total suggestions

    res.json({
      success: true,
      suggestions
    });
  } catch (error) {
    console.error("Suggestions error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching suggestions",
      suggestions: []
    });
  }
});

// Get popular searches (you can implement analytics later)
router.get("/popular", async (req, res) => {
  try {
    // Get all categories as popular searches
    const categories = await Product.distinct("category");
    
    // Get top brands
    const brands = await Product.distinct("brand").then(brands => 
      brands.filter(b => b && b.trim() !== '').slice(0, 5)
    );

    // Combine categories and brands for popular searches
    const popularSearches = [
      ...categories,
      ...brands,
      "luxury",
      "sale",
      "new arrival",
      "best seller"
    ].slice(0, 10);

    res.json({
      success: true,
      popularSearches
    });
  } catch (error) {
    console.error("Popular searches error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching popular searches",
      popularSearches: ["men", "women", "footwear", "luxury", "sale"]
    });
  }
});

module.exports = router;