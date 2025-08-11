import Order from "../models/order.model.js";
import Transaction from "../models/transaction.model.js";
import Razorpay from "razorpay";

// create transaction controller
export const createTransaction = async (req, res) => {
  const { user, amount } = req.body;

  const razorpay = new Razorpay({
    key_id: process.env.RAZOR_PAY_KEY_ID,
    key_secret: process.env.RAZOR_PAY_SECRET,
  });
  const options = {
    amount: amount,
    currency: "INR",
    receipt: `receipt${Date.now()}`,
  };

  try {
    if (!amount || !user) {
      return res
        .status(400)
        .json({ status: false, message: "Amount and user are required" });
    }
    const razorpayOrder = await razorpay.orders.create(options);
    res.status(200).json({
      status: true,
      message: "Order created successfully",
      order: razorpay,
      key: process.env.RAZOR_PAY_KEY_ID,
      currency: "INR",
      order_id: razorpayOrder.id,
    });
  } catch (error) {
    console.log("error", error);
  }
};

export const createOrder = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      cartItems,
      deliveryDate,
      address,
    } = req.body;

    const key_secret = process.env.RAZOR_PAY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", key_secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }
    const transaction = await Transaction.create({
      user: userId,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      status: "success",
      amount: cartItems.reduce(
        (total, item) => total + item?.quantity * item.price,
        0
      ),
    });

    const order = await Order.create({
      user: userId,
      address,
      deliveryDate,
      item: cartItems?.map((item) => ({
        product: item._id,
        quantity: item.quantity,
      })),
      status: "order_placed",
    });
    transaction.order = order._id;
    await transaction.save();
    res.status(201).json({
      status: true,
      message: "Payment verified & Order created successfully",
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getOrderByUserId = async (req, res) => {
  try {
    const userId = req.params.id;
    const orders = await Order.find({ user: userId })
      .populate("user", "name email")
      .populate("item.product", "name price product_image ar_uri")
      .sort({
        createdAt: -1,
      });

    if (!orders) {
      return res
        .status(404)
        .json({ status: false, message: "Orders not found" });
    }

    res
      .status(200)
      .json({ status: true, message: "Orders fetched successfully", orders });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
