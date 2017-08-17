var express = require("express");
var bodyparser = require("body-parser");
var fs = require("fs");
var mysql = require("mysql");
var mongodb = require("mongodb");
var jwt = require("jwt-simple");
var app = express();
app.use(express.static(__dirname+"/../POC"));
app.use(bodyparser.json());

var connection = mysql.createConnection({
   host:"localhost",
   user:"root",
   password:"root",
   database:"poc"
});

connection.connect();

var tokens=[];

app.post("/login",function (req,res) {
    var uname = req.body.uname;
    var upwd = req.body.upwd;
    connection.query("select uname from login_details where uname='"+uname+"'",function (err,recordsArray,fields) {
        if(recordsArray.length>0){
            var token = jwt.encode({'uname':uname},'hr@tcs.com');
            tokens.push(token);
            res.send({'login':'success','token':token});
        }else{
            res.send({'login':'fail'});
        }
    });
});

app.post("about",function (req,res) {

        var token = req.body.token;

        console.log("*********"+token);

        if(tokens[0]==token){
            res.send({'message':'static data soon....!'});
        }else{
            res.send({'message':'Authentication Error...!'});
        }

});

app.post("portfolio",function (req,res) {

    var token = req.body.token;

    if(tokens[0]==token){
        res.send({'message':'mysql data soon....!'});
    }else{
        res.send({'message':'Authentication Error...!'});
    }
});

app.post("feedback",function (req,res) {

    var token = req.body.token;

    if(tokens[0]==token){
        res.send({'message':'mongodb data soon....!'});
    }else{
        res.send({'message':'Authentication Error...!'});
    }
});


app.listen(8080);
console.log("Server Listening the Port No.8080");