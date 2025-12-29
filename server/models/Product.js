// const mongoose = require("mongoose");

// const ProductSchema = new mongoose.Schema({
//   image: String,
//   title: String,
//   description: String,
//   category: String,
//   brand: String,
//   price: Number,
//   salePrice: Number,
//   totalStock: Number,
// }, { timestamps: true });

// module.exports = mongoose.model("Product", ProductSchema);


const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    index: true
  },
  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    index: true
  },
  brand: {
    type: String,
    default: "",
    index: true
  },
  price: {
    type: Number,
    required: [true, "Price is required"],
    min: [0, "Price cannot be negative"]
  },
  salePrice: {
    type: Number,
    min: [0, "Sale price cannot be negative"],
    validate: {
      validator: function(value) {
        return value <= this.price;
      },
      message: "Sale price cannot be higher than regular price"
    }
  },
  totalStock: {
    type: Number,
    required: [true, "Stock is required"],
    min: [0, "Stock cannot be negative"],
    default: 0
  },
  image: {
    type: String,
    required: [true, "Image is required"]
  },
  images: [{
    type: String
  }],
  tags: [{
    type: String,
    index: true
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Compound index for better search performance
productSchema.index({ title: 'text', description: 'text', category: 'text', brand: 'text' });

// Pre-save middleware
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Product", productSchema);