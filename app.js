const express = require("express");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true, useUnifiedTopology: true });

const itemSchema = new mongoose.Schema({
	text: String,
});

const Item = new mongoose.model("Item", itemSchema);

const defaultItem1 = new Item({
	text: "Welcome to your todolist!",
});
const defaultItem2 = new Item({
	text: "Hit the + button to add a new item.",
});
const defaultItem3 = new Item({
	text: "<-- Hit this to delete an item.",
});

app.get("/", function (req, res) {
	let listItems;
	Item.find({}, function (err, items) {
		if (items.length === 0) {
			Item.insertMany([defaultItem1, defaultItem2, defaultItem3], function (err) {
				console.log("Inserted default items to list.");
				res.redirect("/");
			});
		} else {
			console.log("Successfully retrieved items.");
			listItems = items;
			res.render("list", { listTitle: "Today", listItems: listItems });
		}
	}).catch(err => console.error(err));
	// const dateToday = date.getDate();
});

app.post("/", function (req, res) {
	const newItemText = req.body.newItem;
	if (req.body.list === "Work") {
		res.redirect("/work");
	} else {
		Item.create({ text: newItemText }, function (err) {
			if (err) {
				console.log(err);
			} else {
				console.log("Successfully saved new item.");
			}
		});
		res.redirect("/");
	}
});

app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work", listItems: workItems });
});

app.get("/about", function (req, res) {
	res.render("about");
});

app.listen(3333, function () {
	console.log("Server started on port 3333.");
});
