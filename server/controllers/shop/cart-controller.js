const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

/* Helper: map cart items */
const mapCartItems = (items = []) =>
  items.map((item) => {
    const p = item.productId || {};
    const image = p.image || (Array.isArray(p.images) ? p.images[0] : null);

    return {
      productId: p._id || null,
      image,
      title: p.title || "Product not found",
      price: p.price ?? null,
      salePrice: p.salePrice ?? null,
      quantity: item.quantity,
    };
  });

/* ------------------ ADD TO CART ------------------ */
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity = 1 } = req.body;
    const qty = Number(quantity) || 1;

    if (!userId || !productId)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const product = await Product.findById(productId);
    if (!product)
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });

    let cart = await Cart.findOne({ userId });
    if (!cart) cart = new Cart({ userId, items: [] });

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index > -1) cart.items[index].quantity += qty;
    else cart.items.push({ productId, quantity: qty });

    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "images image title price salePrice",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: { ...cart._doc, items: mapCartItems(cart.items) },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

/* ------------------ FETCH CART ITEMS ------------------ */
const fetchCartItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId)
      return res
        .status(400)
        .json({ success: false, message: "User ID required" });

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images image title price salePrice",
    });

    if (!cart)
      return res.status(200).json({
        success: true,
        data: { userId, items: [] },
      });

    const validItems = cart.items.filter((item) => item.productId);
    if (validItems.length < cart.items.length) {
      cart.items = validItems;
      await cart.save();
    }

    return res.status(200).json({
      success: true,
      data: { ...cart._doc, items: mapCartItems(cart.items) },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

/* ------------------ UPDATE CART ITEM QUANTITY ------------------ */
const updateCartItemQty = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    if (!userId || !productId || quantity === undefined)
      return res
        .status(400)
        .json({ success: false, message: "All fields required" });

    const qty = Number(quantity);
    if (Number.isNaN(qty) || qty < 0)
      return res
        .status(400)
        .json({ success: false, message: "Invalid quantity" });

    const cart = await Cart.findOne({ userId });
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const index = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (index === -1)
      return res
        .status(404)
        .json({ success: false, message: "Product not in cart" });

    if (qty === 0) cart.items.splice(index, 1);
    else cart.items[index].quantity = qty;

    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "images image title price salePrice",
    });

    return res.status(200).json({
      success: true,
      message: "Cart updated",
      data: { ...cart._doc, items: mapCartItems(cart.items) },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

/* ------------------ DELETE CART ITEM ------------------ */
const deleteCartItem = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId)
      return res
        .status(400)
        .json({ success: false, message: "Invalid data" });

    const cart = await Cart.findOne({ userId }).populate({
      path: "items.productId",
      select: "images image title price salePrice",
    });

    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const beforeCount = cart.items.length;

    cart.items = cart.items.filter(
      (item) => item.productId?._id.toString() !== productId
    );

    if (cart.items.length === beforeCount)
      return res
        .status(404)
        .json({ success: false, message: "Product not in cart" });

    await cart.save();
    await cart.populate({
      path: "items.productId",
      select: "images image title price salePrice",
    });

    return res.status(200).json({
      success: true,
      message: "Cart item removed",
      data: { ...cart._doc, items: mapCartItems(cart.items) },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  addToCart,
  fetchCartItems,
  updateCartItemQty,
  deleteCartItem,
};
