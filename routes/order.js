const app = require("express")();
const { Order, Product, Sales, MainIngredients } = require("../model");
const moment = require("moment");

app.get("/order_list/:date", async (req, res) => {
    try {
        const orderList = await Order.find();

        const orderListToday =  orderList.filter( i => i.orderDateTime.split(",")[0] === req.params.date.split(",").join("/") )

        return res.json(orderListToday);

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

app.post("/submit_order", async (req, res) => {
    const { orderDateTime, username, totalCost, discount, totalAmount, totalItems, order } = req.body;

    try { 
        let snack = order.filter( i => i.type === "snack" )
        let milktea = order.filter( i => i.type === "milktea" )

        let totalSugarUsed = 0;
        let getSugarArr = milktea.map( i => i.ingredients.serving.sugar * i.qty );
        getSugarArr.forEach( i => totalSugarUsed += i );

        let totalTeaUsed = 0;
        let getTeaArr = milktea.map( i => i.ingredients.serving.tea * i.qty );
        getTeaArr.forEach( i => totalTeaUsed += i );

        let totalMilkUsed = 0;
        let getMilkArr = milktea.map( i => i.ingredients.serving.milk * i.qty );
        getMilkArr.forEach( i => totalMilkUsed += i );

        let totalPearlUsed = 0;
        let getPearlArr = milktea.map( i => i.ingredients.serving.pearl * i.qty );
        getPearlArr.forEach( i => totalPearlUsed += i );

        let totalPowderUsed = 0;
        let getPowderArr = milktea.map( i => i.ingredients.serving.powder * i.qty );
        getPowderArr.forEach( i => totalPowderUsed += i );

        let mainIng = [
            {
                updateOne: {
                    "filter": { name: "sugar" },
                    "update": { $inc: { 
                        "stock": -totalSugarUsed
                    } }
                }
            },
            {
                updateOne: {
                    "filter": { name: "tea" },
                    "update": { $inc: { 
                        "stock": -totalTeaUsed
                    } }
                }
            },
            {
                updateOne: {
                    "filter": { name: "milk" },
                    "update": { $inc: { 
                        "stock": -totalMilkUsed
                    } }
                }
            },
            {
                updateOne: {
                    "filter": { name: "pearl" },
                    "update": { $inc: { 
                        "stock": -totalPearlUsed
                    } }
                }
            },

        ]
        await MainIngredients.bulkWrite(mainIng);

        // save order to database
        const orderSave = await Order({
            orderDateTime: orderDateTime,
            username: username,
            totalCost: totalCost,
            discount: discount, 
            totalAmount: totalAmount,
            totalItems: totalItems,
            orderList: order,
            ingredientsUsed: [
                {
                    name: "sugar",
                    total: totalSugarUsed
                },
                {
                    name: "tea",
                    total: totalTeaUsed
                },
                {
                    name: "milk",
                    total: totalMilkUsed
                },
                {
                    name: "pearl",
                    total: totalPearlUsed
                },
                {
                    name: "powder",
                    total: totalPowderUsed
                },
            ]
        }).save();

        // update milktea stocks
        let bulkUpdateMilktea = milktea.map( data => (
            {
                updateOne: {
                    "filter": { name: data.name },
                    "update": { $set: { 
                        "stock": (( Number(data.ingredients.powderQty) - ( Number(data.ingredients.serving.powder) * Number(data.qty) ) ) ) / data.ingredients.serving.powder,
                        "ingredients.powderQty": Number(data.ingredients.powderQty) - ( Number(data.ingredients.serving.powder) * Number(data.qty) )
                    } },

                }
            }
        ))

        // update snack stocks
        let bulkUpdateSnack = snack.map( data => (
            {
                updateOne: {
                    "filter": { name: data.name },
                    "update": { $set: { 
                        "stock": data.stock - data.qty,
                    } },

                }
            }
        ))
        

        const prodResultMilktea = await Product.bulkWrite(bulkUpdateMilktea);
        const prodResultSnack = await Product.bulkWrite(bulkUpdateSnack);

        // convert datetime to date only ex ( 6/2/2022, 1:32:13 PM === Jun 2, 2022 )
        const date = new Date(orderDateTime).toLocaleString('en-us', { year:"numeric", day: "numeric", month:"short"});

        const salesReport = await Sales.findOneAndUpdate({ date: date }, { $inc: { revenue: Number(totalCost) } }, { upsert: true, new: true });

        return res.json({ success: true, msg: "order saved!", prodResultMilktea, prodResultSnack, salesReport, orderSave })

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }

} )

module.exports = app;