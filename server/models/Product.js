
// server/models/Product.js
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    salePrice: Number,
    image: String,
    category: String,
    brand: String,

    // Review fields
    averageReview: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // Stock management fields (availableStock is now a virtual)
    totalStock: {
      type: Number,
      required: true,
      default: 0,
      min: 0,
    },
    reservedStock: {
      type: Number,
      default: 0,
      min: 0,
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0,
    },
    allowBackorders: {
      type: Boolean,
      default: false,
    },
    showOutOfStock: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ------------------------------------------------------------
// VIRTUAL: availableStock (computed, never persisted)
// ------------------------------------------------------------
productSchema.virtual('availableStock').get(function () {
  return Math.max(0, this.totalStock - this.reservedStock);
});

// ------------------------------------------------------------
// CHECK STOCK AVAILABILITY (read‑only)
// ------------------------------------------------------------
productSchema.methods.checkStockAvailability = function (requestedQuantity = 1) {
  const availableStock = this.availableStock;
  const isLowStock = availableStock > 0 && availableStock <= this.lowStockThreshold;

  return {
    available: this.allowBackorders ? true : availableStock >= requestedQuantity,
    availableStock,
    totalStock: this.totalStock,
    reservedStock: this.reservedStock,
    allowBackorders: this.allowBackorders,
    isLowStock,
    isActive: this.isActive,
    showOutOfStock: this.showOutOfStock,
    averageReview: this.averageReview,
    reviewCount: this.reviewCount,
  };
};

productSchema.statics.checkStockAvailability = async function (productId, requestedQuantity = 1) {
  const product = await this.findById(productId);

  if (!product) {
    throw new Error('Product not found');
  }

  if (!product.isActive) {
    return {
      available: false,
      reason: 'Product is not active',
      productId,
      isActive: false,
    };
  }

  const availableStock = product.availableStock;
  const isLowStock = availableStock > 0 && availableStock <= product.lowStockThreshold;

  return {
    available: product.allowBackorders ? true : availableStock >= requestedQuantity,
    availableStock,
    totalStock: product.totalStock,
    reservedStock: product.reservedStock,
    allowBackorders: product.allowBackorders,
    isLowStock,
    isActive: product.isActive,
    showOutOfStock: product.showOutOfStock,
    averageReview: product.averageReview,
    reviewCount: product.reviewCount,
    productId,
    product,
  };
};

// ------------------------------------------------------------
// ATOMIC STOCK OPERATIONS (static methods)
// ------------------------------------------------------------

/**
 * Reserve stock atomically.
 * - If backorders are allowed, reservation always succeeds.
 * - Otherwise, it requires availableStock >= quantity.
 * - Recalculates reservedStock, availableStock (virtual), and inStock in the same update.
 */
productSchema.statics.reserveStock = async function (productId, quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const updated = await this.findOneAndUpdate(
    {
      _id: productId,
      // Allow if backorders are allowed OR enough stock is available
      $or: [
        { allowBackorders: true },
        { $expr: { $gte: [{ $subtract: ['$totalStock', '$reservedStock'] }, quantity] } },
      ],
    },
    [
      // 1. Increment reservedStock
      { $set: { reservedStock: { $add: ['$reservedStock', quantity] } } },
      // 2. Recalculate inStock (availableStock is virtual, so we don't set it)
      {
        $set: {
          inStock: {
            $or: [
              { $gt: [{ $subtract: ['$totalStock', { $add: ['$reservedStock', quantity] }] }, 0] },
              '$allowBackorders',
            ],
          },
        },
      },
    ],
    { new: true }
  );

  if (!updated) {
    throw new Error('Insufficient stock or product not found');
  }
  return updated;
};

/**
 * Release reserved stock atomically.
 * - Decrements reservedStock by the given quantity (clamped to 0).
 * - Recalculates inStock (availableStock is virtual).
 */
productSchema.statics.releaseStock = async function (productId, quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const updated = await this.findOneAndUpdate(
    { _id: productId },
    [
      // 1. Decrement reservedStock by quantity, but not below 0
      {
        $set: {
          reservedStock: {
            $max: [0, { $subtract: ['$reservedStock', quantity] }],
          },
        },
      },
      // 2. Recalculate inStock (availableStock is virtual)
      {
        $set: {
          inStock: {
            $or: [
              { $gt: [{ $subtract: ['$totalStock', '$reservedStock'] }, 0] },
              '$allowBackorders',
            ],
          },
        },
      },
    ],
    { new: true }
  );

  if (!updated) {
    throw new Error('Product not found');
  }
  return updated;
};

/**
 * Deduct stock permanently (after payment confirmation).
 * - Decrements totalStock by quantity.
 * - Decrements reservedStock by at most quantity (clamped).
 * - Recalculates inStock (availableStock is virtual).
 */
productSchema.statics.deductStock = async function (productId, quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const updated = await this.findOneAndUpdate(
    { _id: productId },
    [
      // 1. Decrement totalStock (never below 0)
      { $set: { totalStock: { $max: [0, { $subtract: ['$totalStock', quantity] }] } } },
      // 2. Decrement reservedStock by min(quantity, reservedStock)
      {
        $set: {
          reservedStock: {
            $max: [0, { $subtract: ['$reservedStock', { $min: [quantity, '$reservedStock'] }] }],
          },
        },
      },
      // 3. Recalculate inStock (availableStock is virtual)
      {
        $set: {
          inStock: {
            $or: [
              { $gt: [{ $subtract: ['$totalStock', '$reservedStock'] }, 0] },
              '$allowBackorders',
            ],
          },
        },
      },
    ],
    { new: true }
  );

  if (!updated) {
    throw new Error('Product not found');
  }
  return updated;
};

/**
 * Increase totalStock (restocking) atomically.
 * - Recalculates inStock (availableStock is virtual).
 */
productSchema.statics.increaseStock = async function (productId, quantity) {
  if (quantity <= 0) {
    throw new Error('Quantity must be greater than 0');
  }

  const updated = await this.findOneAndUpdate(
    { _id: productId },
    [
      // 1. Increment totalStock
      { $set: { totalStock: { $add: ['$totalStock', quantity] } } },
      // 2. Recalculate inStock (availableStock is virtual)
      {
        $set: {
          inStock: {
            $or: [
              { $gt: [{ $subtract: ['$totalStock', '$reservedStock'] }, 0] },
              '$allowBackorders',
            ],
          },
        },
      },
    ],
    { new: true }
  );

  if (!updated) {
    throw new Error('Product not found');
  }
  return updated;
};

// ------------------------------------------------------------
// INSTANCE METHODS (delegate to atomic static methods)
// ------------------------------------------------------------
productSchema.methods.reserveStock = async function (quantity) {
  return await this.constructor.reserveStock(this._id, quantity);
};

productSchema.methods.releaseStock = async function (quantity) {
  return await this.constructor.releaseStock(this._id, quantity);
};

productSchema.methods.deductStock = async function (quantity) {
  return await this.constructor.deductStock(this._id, quantity);
};

productSchema.methods.increaseStock = async function (quantity) {
  return await this.constructor.increaseStock(this._id, quantity);
};

// Legacy method (backward compatibility)
productSchema.methods.reduceStock = async function (quantity) {
  return await this.deductStock(quantity);
};

productSchema.methods.canAddToCart = function (quantity = 1) {
  const stockCheck = this.checkStockAvailability(quantity);
  return stockCheck.available;
};

// ------------------------------------------------------------
// UPDATE RATING
// ------------------------------------------------------------
productSchema.methods.updateRating = async function () {
  const ProductReview = require('./Review');
  const reviews = await ProductReview.find({ productId: this._id.toString() });

  const totalReviews = reviews.length;
  if (totalReviews === 0) {
    this.averageReview = 0;
    this.reviewCount = 0;
  } else {
    const totalRating = reviews.reduce((sum, review) => sum + review.reviewValue, 0);
    this.averageReview = Number((totalRating / totalReviews).toFixed(1));
    this.reviewCount = totalReviews;
  }

  await this.save();
  return this;
};

productSchema.statics.updateRating = async function (productId) {
  const product = await this.findById(productId);
  if (!product) {
    throw new Error('Product not found');
  }
  return await product.updateRating();
};

const Product = mongoose.model('Product', productSchema);
module.exports = Product;