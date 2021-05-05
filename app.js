const express = require("express");
const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

const items = ["Buy food", "Cook food", "Eat food"];
const workItems = [];

app.get("/", function (req, res) {
	var today = new Date();
	var options = {
		weekday: "long",
		day: "numeric",
		month: "long",
	};
	var date = today.toLocaleDateString("en-US", options);

	res.render("list", { listTitle: date, listItems: items });
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

// app.post("/work", function (req, res) {
// 	const item = req.body.newItem;
// 	workItems.push(item);
// 	res.redirect("/work");
// });

app.listen(5000, function () {
	console.log("Server started on port 5000.");
});
