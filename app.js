const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

const items = [];

app.get("/", function (req, res) {
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
    };
    var day = today.toLocaleDateString("en-US", options);

    res.render("list", { dayOfWeek: day, listItems: items });
});

app.post("/", function (req, res) {
    const item = req.body.newItem;
    console.log(item);
    items.push(item);
    res.redirect("/");
});

app.listen(5000, function () {
    console.log("Server started on port 5000.");
});
