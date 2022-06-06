const app = require("express")();
const e = require("express");
const moment = require("moment");
const { Sales } = require("../model");

app.post("/get_revenue", async (req, res) => {
    const { date } = req.body;

    try {
        const result = await Sales.find()

        // DAILY
        
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

        // WEEKLY
        let getThisDate = moment(date).date();
        let getHowManyDays = getThisDate % 7; // calculate on how many days will get to the week
        let dayStart = getThisDate - getHowManyDays; // where the day will start to count

        let days = [];
        let currentMonth = date.split(" ")[0];
        let currentYear = date.split(" ")[2];

        let weekRevenue = [];

        if( getHowManyDays === 0  ) { 
            dayStart = getThisDate - 7;
        }

        while(getThisDate !== dayStart) {
            days.push(`${currentMonth} ${getThisDate}, ${currentYear}`);
            getThisDate--
        }

        days.map( day => { 
            let weekDaysRevenue = result.find( data => data.date === day  );

            if( weekDaysRevenue === undefined ) {
                weekRevenue.push({ date: day, revenue: 0 })
            } else {
                weekRevenue.push(weekDaysRevenue);
            }
        } )

        let weeklyTotalRevenue = 0;
        let weeklyRevenue = weekRevenue.map( i => i.revenue );
        weeklyRevenue.forEach( i => weeklyTotalRevenue += i );;

        let range;

        if( days.length === 1 ) {
            range = days[0];
        } else {
            range = days[days.length-1] + " - " + days[0]
        }

        let week = { weekly: "₱"+weeklyTotalRevenue.toFixed(2), range }

        return res.json({ 
            today: todaysRevenue,
            week: week,
        })

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
} )

module.exports = app;