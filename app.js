const express = require("express");
const mongoose = require("mongoose");
const _ = require("lodash");
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

const item1 = new Item({
	text: "Welcome to your todolist!",
});
const item2 = new Item({
	text: "Hit the + button to add a new item.",
});
const item3 = new Item({
	text: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

const listSchema = new mongoose.Schema({
	name: String,
	items: [itemSchema],
});

const List = new mongoose.model("List", listSchema);

app.get("/", function (req, res) {
	res.redirect("/Today");
});

app.post("/", function (req, res) {
	const listName = req.body.list;
	const newItem = {
		text: req.body.newItem,
	};
	List.findOne({ name: listName }, function (err, foundList) {
		foundList.items.push(newItem);
		foundList.save();
		res.redirect(`/${listName}`);
	});
});

app.post("/delete", function (req, res) {
	const deleteId = req.body.id;
	const listName = req.body.listName;
	List.updateOne({ name: listName }, { $pull: { items: { _id: deleteId } } }, function (err, result) {
		if (!err) {
			res.redirect(`/${listName}`);
		}
	}).catch((err) => console.error(err));
});

app.get("/:listName", function (req, res) {
	const customListName = req.params.listName.split(" ").map(word => _.capitalize(word)).join(" ");

	List.findOne({ name: customListName }, async function (err, list) {
		if (list) {
			res.render("list", { listName: list.name, listItems: list.items });
		} else {
			const list = new List({
				name: customListName,
				items: defaultItems,
			});
			await list.save();
			console.log(`Created list ${customListName}`);
			res.redirect(`/${customListName}`);
		}
	}).catch((err) => console.error(err));
});

// app.get("/about", function (req, res) {
// 	res.render("about");
// });

app.listen(3000, function () {
	console.log("Server started on port Server started on port 3000.");
});
