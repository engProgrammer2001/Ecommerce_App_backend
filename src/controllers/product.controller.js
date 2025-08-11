import Category from "../models/category.model.js";
import Product from "../models/product.model.js";

// Add a new product
export const addProduct = async (req, res) => {
  try {
    const {
      name,
      product_image,
      ar_uri,
      category,
      description,
      discounted_price,
      price,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !product_image ||
      !description ||
      !discounted_price ||
      !price ||
      !category
    ) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided",
      });
    }

    // Validate price and discounted price
    if (isNaN(price) || isNaN(discounted_price)) {
      return res.status(400).json({
        success: false,
        message: "Price and discounted price must be numbers",
      });
    }

    if (discounted_price > price) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot be greater than regular price",
      });
    }

    // Validate category IDs
    if (!Array.isArray(category) || category.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one valid category must be provided",
      });
    }

    // Check if categories exist
    const categoriesExist = await Category.find({
      _id: { $in: category },
    }).countDocuments();

    if (categoriesExist !== category.length) {
      return res.status(400).json({
        success: false,
        message: "One or more categories do not exist",
      });
    }

    // Create new product
    const newProduct = new Product({
      name,
      product_image,
      ar_uri: ar_uri || null,
      category,
      description,
      discounted_price,
      price,
    });
    // Save product to database
    const savedProduct = await newProduct.save();

    // Populate category details in the response
    const populatedProduct = await Product.findById(savedProduct._id).populate(
      "category",
      "name _id" // Only include name and _id from category
    );

    res.status(201).json({
      success: true,
      message: "Product added successfully",
      product: populatedProduct,
    });
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to add product",
      error: error.message,
    });
  }
};

// Get all products
export const getAllProduct = async (req, res) => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
      error: error.message,
    });
  }
};

// Get single product by ID
export const getProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId).populate(
      "category",
      "name _id"
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch product",
      error: error.message,
    });
  }
};

// Update product
export const updateProduct = async (req, res) => {
  try {
    const updates = req.body;

    // Validate price and discounted price if they're being updated
    if (updates.price && isNaN(updates.price)) {
      return res.status(400).json({
        success: false,
        message: "Price must be a number",
      });
    }

    if (updates.discounted_price && isNaN(updates.discounted_price)) {
      return res.status(400).json({
        success: false,
        message: "Discounted price must be a number",
      });
    }

    if (
      updates.discounted_price &&
      updates.price &&
      updates.discounted_price > updates.price
    ) {
      return res.status(400).json({
        success: false,
        message: "Discounted price cannot be greater than regular price",
      });
    }

    // Validate categories if they're being updated
    if (updates.category) {
      if (!Array.isArray(updates.category) || updates.category.length === 0) {
        return res.status(400).json({
          success: false,
          message: "At least one valid category must be provided",
        });
      }

      const categoriesExist = await Category.find({
        _id: { $in: updates.category },
      }).countDocuments();

      if (categoriesExist !== updates.category.length) {
        return res.status(400).json({
          success: false,
          message: "One or more categories do not exist",
        });
      }
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { ...updates, updatedAt: Date.now() },
      { new: true, runValidators: true }
    ).populate("category", "name _id");

    if (!updatedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
      error: error.message,
    });
  }
};

// Delete product
export const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
      error: error.message,
    });
  }
};
