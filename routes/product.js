const app = require("express")();
const { Product, Sales } = require("../model");

app.get("/get_inventory", async (req, res) => {
    try {
        const all = await Product.find();

        return res.json(all)

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
})

app.get("/best_sellers", async (req, res) => {
    try {
        const bestSeller = await Product.find({ bestSeller: true });

        return res.json(bestSeller)
    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
})

app.get("/get_milktea", async (req, res) => {
    try {
        const milktea = await Product.find({ type: "milktea" });

        return res.json(milktea)
    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

app.get("/get_coffee", async (req, res) => {
    try {
        const coffee = await Product.find({ type: "coffee" });

        return res.json(coffee)
    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

app.get("/get_snack", async (req, res) => {
    try {
        const snack = await Product.find({ type: "snack" });

        return res.json(snack)
    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )


app.post("/add_product", async (req, res) => {
    const { name, description, stock, price, type, bestSeller } = req.body;

    try {
        const exist = await Product.findOne({ name })

        if (exist)
            return res.json({
                success: false,
                message: "Product already exist!",
            });

        const result = await new Product({
            type: type,
            name: name,
            description: description,
            price: { 
                medium: price.medium === '' ? 0 : price.medium,
                large: price.large === '' ? 0 : price.large
            },
            stock: stock,
            bestSeller: bestSeller
        }).save()

        return res.json({
            success: true,
            message: "Product has been added",
            result
        });

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }

})

app.post("/edit_product", async (req, res) => {
    const { product, name, description, stock, price, type, bestSeller } = req.body;

    try {
        const update = await Product.findOneAndUpdate({ name: product }, {
            name: name,
            type: type,
            description: description,
            stock: stock,
            price: price,
            bestSeller: bestSeller
        } , { new: true })

        return res.json({
            success: true,
            message: "Product has been updated",
            update
        })

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
})

app.post("/remove_product", async (req, res) => {
    const { name } = req.body;

    try {
        const result = await Product.findOneAndRemove({ name }, { new: true });

        return res.json({ success: true, message: `Product ${result.name} has been removed` });
    } catch (e) {
        return res
            .status(500)
            .json({ error: `Something went wrong error: ${e}` });
    }
});

module.exports = app;
