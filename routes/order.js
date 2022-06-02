const app = require("express")();
const { Order, Product, Sales } = require("../model");

app.post("/submit_order", async (req, res) => {
    const { orderDateTime, username, totalCost, order } = req.body;

    try {
        // save order to database
        await Order({
            orderDateTime: orderDateTime,
            username: username,
            totalCost: totalCost,
            orderList: order
        }).save();

        // update product stocks
        let bulkUpdate = order.map( data => (
            {
                updateOne: {
                    "filter": { name: data.name },
                    "update": { $set: { "stock": data.stock - data.qty } }
                }
            }
        ))
        const prodResult = await Product.bulkWrite(bulkUpdate);

        // convert datetime to date only ex ( 6/2/2022, 1:32:13 PM === Jun 2, 2022 )
        const date = new Date(orderDateTime).toLocaleString('en-us', { year:"numeric", day: "numeric", month:"short"});

        const salesReport = await Sales.findOneAndUpdate({ date: date }, { $inc: { revenue: Number(totalCost) } }, { upsert: true, new: true });

        return res.json({ success: true, msg: "order saved!", prodResult, salesReport })

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }

} )

module.exports = app;