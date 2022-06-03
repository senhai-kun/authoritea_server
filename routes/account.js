const app = require("express")();
const { User } = require("../model");

app.get("/", (req, res) => {
    res.send("Hello");
});

app.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    try {
        const result = await User.findOne({ username }).select("+password");

        if (!result) return res.json({ success: false, message: "Username not found!" });

        if (result.password == password) {
            // set status to true or online
            const status = await User.findOneAndUpdate(
                { username },
                { $set: { status: true } },
                { new: true }
            );

            const redirect = result.role + ".html";

            return res.json({
                success: true,
                data: result,
                redirect,
                status,
            });
        } else {
            return res
                .status(422)
                .json({ success: false, message: "Wrong Password!" });
        }
    } catch (e) {
        return res
        .status(500)
        .json({ error: `Something went wrong error: ${e}` });
    }
});

app.post("/add_account", async (req, res) => {
    const { username, password, role } = req.body;

    try {
        const exist = await User.findOne({ username });
        
        if (exist)
            return res.json({
                success: false,
                message: "Account already exist!",
            });

        await new User({
            role,
            username,
            password,
        }).save();

        return res.json({
            success: true,
            message: "Account has been created.",
        });
    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }
});

app.post("/edit_account", async (req, res) => {
    const { user, username, password } = req.body;

    try {
        
        const result = await User.findOneAndUpdate({ username: user }, { username: username, password: password }, { new: true });

        return res.json({ 
            success: true,
            message: "Account has been updated",
            result
        })

    } catch (e) {
        return res.status(500).json({ error: `Something went wrong error: ${e}` });
    }

})

app.post("/remove_account", async (req, res) => {
    const { username } = req.body;

    try {
        const result = await User.findOneAndRemove({ username }, { new: true });

        return res.json({ success: true, result });
    } catch (e) {
        return res
            .status(500)
            .json({ error: `Something went wrong error: ${e}` });
    }
});

app.get("/get_users", async (req, res) => {
    try {
        const users = await User.find();

        return res.json(users);
    } catch (e) {
        return res
            .status(500)
            .json({ error: `Something went wrong error: ${e}` });
    }
});

app.post("/logout", async (req, res) => {
    const { username } = req.body;

    try {
        const user = await User.findOneAndUpdate({ username: username }, { $set: { status: false } },{ new: true });
        
        return res.json({ success: true, msg: "User has been logged out!" });

    } catch (e) {
        return res
            .status(500)
            .json({ error: `Something went wrong error: ${e}` });
    }
});

module.exports = app;
