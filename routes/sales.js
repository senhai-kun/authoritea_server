const app = require("express")();
const moment = require("moment");
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

        // convert date to day
        let day = moment(date).date();

        let weekRange = day - 7; // date today - 1week;
        let weeklyTotalRevenue = 0;

        if( weekRange < 6 ) {

            let weeklyArray = result.map( i => i.revenue )// transform data into array
            weeklyArray.forEach( i => weeklyTotalRevenue += i )

        } else {
            let completeWeek = result.slice(weekRange,day); // returns the 7days revenue

            let weeklyArray = completeWeek.map( i => i.revenue )
            weeklyArray.forEach( i => weeklyTotalRevenue += i )
        }


        return res.json({ 
            today: todaysRevenue,
            weekly: "₱"+weeklyTotalRevenue.toFixed(2)
        })

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

module.exports = app;