const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const users = new Schema({
    _id: {
        select: false,
        type: ObjectId,
        default: mongoose.Types.ObjectId,
    },
    role: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true, select: false },
    status: { type: Boolean, default: false },
}, { versionKey: false });


const products = new Schema({
    type: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String },
    ingredients: {
        powderName: { type: String },
        powderQty: { type: Number },
        expiryDate: { type: String },
        serving: {
            sugar: { type: Number },
            milk: { type: Number },
            powder: { type: Number },
            pearl: { type: Number },
            tea: { type: Number },
        }
    },
    price: {
        medium: { type: Number, default: 0 },
        large: { type: Number, default: 0 },
    },
    stock: { type: Number },
    bestSeller: { type: Boolean, default: false }
}, { versionKey: false });

const mainIngredients = new Schema({
    name: { type: String, required: true },
    stock: { type: Number, required: true, },
    expiryDate: { type: String },
}, { versionKey: false });

const order = new Schema({
    orderDateTime: { type: String },
    username: { type: String },
    totalCost: { type: Number },
    discount: { type: Number }, 
    totalAmount: { type: Number },
    totalItems: { type: Number },
    orderList: [
        {
            type: { type: String },
            name: { type: String },
            stock: { type: Number },
            variant: { type: String },
            subtotal: { type: Number },
            qty: { type: Number },
            itemPrice: { type: Number }
        }
    ],
    ingredientsUsed: [
        { 
            name: { type: String },
            total: { type: Number }
        }
    ]
}, { versionKey: false })


const sales = new Schema({
    date: { type: String },
    revenue: { type: Number },
}, { versionKey: false })

const User = mongoose.model("users", users);
const Product = mongoose.model("products", products);
const MainIngredients = mongoose.model("ingredients",mainIngredients);
const Order = mongoose.model("orders", order);
const Sales = mongoose.model("sales", sales);

module.exports = { User, Product, Order, Sales, MainIngredients };
