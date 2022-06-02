const app = require("express")();
const { Sales } = require("../model");

app.post("/get_revenue", async (req, res) => {
    const { date } = req.body;

    try {
        const result = await Sales.find()

        // get only the specific date
        const getRevenueDate = result.filter( i => i.date === date );

        // if nothing found on specific date return this data
        let todaysRevenue = { todaysRevenue: "₱0.00", date: date };
        
        if( getRevenueDate.length !== 0 ) {
            // if found change the todaysRevenue data
            todaysRevenue = {
                todaysRevenue: "₱"+getRevenueDate[0].revenue.toFixed(2), 
                date: getRevenueDate[0].date
            }
        }

        // slice the result to get the first 7 revenue data equivalent to 7days or 1week
        const getWeeklyRevenue = result.slice(0, 6);

        let weeklyArray = getWeeklyRevenue.map( i => i.revenue )// transform data into array
        let weeklyTotalRevenue = 0;
        weeklyArray.forEach( i => weeklyTotalRevenue += i )

        return res.json({ 
            today: todaysRevenue,
            weekly: "₱"+weeklyTotalRevenue.toFixed(2), 
        })

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

module.exports = app;