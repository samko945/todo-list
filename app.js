const express = require("express");
const app = express();
const date = require(__dirname + "/date.js");

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const items = ["Buy food", "Cook food", "Eat food"];
const workItems = [];

app.get("/", function (req, res) {
	const dateToday = date.getDate();
	res.render("list", { listTitle: dateToday, listItems: items });
});

app.post("/", function (req, res) {
	const item = req.body.newItem;
	if (req.body.list === "Work") {
		workItems.push(item);
		res.redirect("/work");
	} else {
		items.push(item);
		res.redirect("/");
	}
});

app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work", listItems: workItems });
});

app.get("/about", function (req, res) {
	res.render("about");
});

app.listen(5000, function () {
	console.log("Server started on port 5000.");
});
