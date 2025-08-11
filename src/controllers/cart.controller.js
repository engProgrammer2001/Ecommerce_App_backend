import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Get user's cart
export const getCart = async (req, res) => {
  try {
    const userId = req.id;
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) {
      return res.status(200).json({
        items: [],
      });
    }
    res
      .status(200)
      .json({ status: true, message: "Cart retrieved successfully", cart });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add item to cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId, quantity } = req.body;
    // Validate input
    if (!productId || !quantity || quantity < 1) {
      return res.status(400).json({ message: "Invalid input" });
    }
    // Get product details
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({
        user: userId,
        items: [],
      });
    }
    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (existingItemIndex >= 0) {
      cart.items[existingItemIndex].quantity += quantity;
    } else {
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        discounted_price: product.discounted_price,
      });
    }

    await cart.save();
    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );

    res.status(200).json({
      status: true,
      message: "Item added to cart successfully",
      data: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update cart item quantity
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );
    res.status(200).json({
      status: true,
      message: "Item quantity updated successfully",
      data: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove item from cart
export const removeFromCart = async (req, res) => {
  try {
    const userId = req.id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );
    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items.splice(itemIndex, 1);
    await cart.save();

    const populatedCart = await Cart.findById(cart._id).populate(
      "items.product"
    );
    res.status(200).json({
      status: true,
      message: "Item removed from cart successfully",
      data: populatedCart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Clear cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    cart.items = [];
    await cart.save();

    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
