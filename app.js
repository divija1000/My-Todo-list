//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
///const date = require(__dirname + "/date.js");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

///////////////////////////// mongoose files////////////////////////////////////////
mongoose.connect("mongodb://localhost:27017/todolistDB", { useNewUrlParser: true });

const itemsSchema = {
     name: String
};

const Item = mongoose.model("Item" , itemsSchema);

const item1 = new Item({
   name: "welcome"
});

const item2 = new Item({
   name: "add"
});

const item3 = new Item({
   name: "delete"
});

const defaultItems = [item1, item2, item3];



//////////////////////////////////////////////////////////////////////////

app.get("/", function(req, res) {

///const day = date.getDate();
//////////mong////////////
Item.find( {}, function(err, foundItems){

     if(foundItems.length === 0)
     {
       Item.insertMany(defaultItems,  function(err){
           if(err){
                console.log(err);
           }
          else{
          console.log("sucess!!");
       }
       });
       res.redirect("/");
     }
     else{
            res.render("list", {listTitle: "Today" , newListItems: foundItems});
     }
});
////////////////////////////////////
});

app.post("/", function(req, res){

  const itemName = req.body.newItem;
  const item = new Item ({
      name: itemName
  });
  item.save();
  res.redirect("/");
});

app.post("/delete", function(req,res){
    const checkedItemId = req.body.checkbox;
    Item.findByIdAndRemove(checkedItemId, function(err){
        if(!err){
          console.log("yoyoyo!!");
          res.redirect("/");
        }
    });
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
