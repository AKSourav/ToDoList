const express=require("express");
const app=express();
const bodyParser=require("body-parser");
const { default: mongoose } = require("mongoose");
const date=require(__dirname+"/date.js");
const _=require("lodash");

app.set("view engine","ejs");
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("public"));
// dolist=["wake up","sleep","drink"];
// workItems=[];

//MongoDB stuffs
mongoose.connect('mongodb+srv://aksourav2001:anupamkumarsourav@cluster0.gpd8jbm.mongodb.net/todolistDB');
const todolistSchema= new mongoose.Schema({
    name: String
});
const dolist=mongoose.model("dolist",todolistSchema);
var item1=new dolist({
    name:"Welcome to do list!"
});
var item2=new dolist({
    name:"Hit + button To add an item!"
});
var item3=new dolist({
    name:"<--Hit button to delete an item!"
});
var defaultItems=[item1,item2,item3];
//Inseting Items
// dolist.insertMany(defaultItems,function(err){
//     if(err)
//         console.log(err);
//     else
//         console.log("Successfully saved in DB.");
// })
//Reading Items
// dolist.find({},function(err,result){
//     if(err)
//         console.log(err);
//     else{
//         console.log(result);
//     }
// });

//Creating New Schema and its model
const ListSchema= new mongoose.Schema({
    name:String,
    items:[todolistSchema]
});
const List=mongoose.model("List",ListSchema);

let today=date.getDay();
app.get("/",function(req,res){
    dolist.find({},function(err,foundItems){
        if(err)
            console.log(err);
        else if(foundItems.length==0)
        {
            dolist.insertMany(defaultItems,function(err){
            if(err)
                console.log(err);
            else
                console.log("Successfully saved in DB.");
            });
            res.redirect("/");
        }
        else{
            res.render("index",{listTitle:"Today",dolist:foundItems});
        }
    });
});
app.post("/",function(req,res){
    const newData=req.body.newData;
    const listName=req.body.list;
    var newItem=new dolist({
        name:newData
    });
    if(listName=="Today")
    {
        newItem.save();
        res.redirect("/");
    }
    else{
        List.findOne({name:listName},function(err,foundList){
            if(!err)
            {
                if(foundList)
                {
                    foundList.items.push(newItem);
                    foundList.save();
                }
                res.redirect("/"+listName);
            }
        });
    }
});
app.post("/delete", function(req,res){
    const checkedId=req.body.checkbox;
    const ListName=req.body.ListName;
    if(ListName=="Today")
    {
        dolist.findByIdAndRemove(checkedId,function(err){
            if(!err)
                console.log("Successfull Deleted item!")
            res.redirect("/");
        });
    }
    else
    {
        List.findOneAndUpdate({name:ListName},{$pull:{items:{_id:checkedId}}}, function(err,result)
        {
            if(!err)
                console.log(`Item Deleted Successfully from ${ListName}`);
            res.redirect("/"+ListName);
        });
    }
});

//Custom list Name
app.get("/:customListName",function(req,res){
    const customListName=_.capitalize(req.params.customListName);
    List.findOne({name:customListName},function(err,foundList){
        if(!err)
        {
            if(!foundList)
            {
                //Create a new List
                const list=new List({
                    name:customListName,
                    items:defaultItems
                });
                list.save();
                res.redirect("/"+customListName);
            }
            else
            {
                //Show an existing List
                res.render("index",{listTitle:customListName,dolist:foundList.items});
            }
        }
    });
});
app.get("/about",function(req,res){
    res.render("about");
})
app.listen(3000,()=>{
    console.log("on port 3000");
});