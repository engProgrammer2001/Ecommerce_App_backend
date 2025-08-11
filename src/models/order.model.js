import mongoose from "mongoose";

const ItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    require: true,
  },
  quantity: {
    type: Number,
    require: true,
  },
});

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  deliveryDate: {
    type: Date,
    require: true,
  },
  order_address: {
    type: String,
    require: true,
  },
  items: {
    type: [ItemSchema],
    require: true,
  },
  status: {
    type: String,
    require: true,
    enum: ["pending", "shipping", "out_for_delivery", "delivered", "cancelled"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updateAt: {
    type: Date,
    default: Date.now,
  },
});

const Order = mongoose.model("Order", orderSchema);
export default Order;
