const app = require("express")();
const e = require("express");
const { MainIngredients } = require("../model");

app.get("/ingredients", async (req, res) => {
    
    try {
        const result = await MainIngredients.find();

        return res.json(result);

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

app.post("/update_ingredient", async ( req, res ) => {
    const { name, updatedStock, expiryDate } = req.body;

    try {
        const result = await MainIngredients.findOneAndUpdate({ name }, { $set: { stock: updatedStock, expiryDate: expiryDate } }, { new: true })
        console.log( name, updatedStock, expiryDate);
        return res.json({ success: true, result })
       
    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

module.exports = app;
