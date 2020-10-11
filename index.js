const express = require('express');
const app = express();
var mysql = require('mysql');
var bodyParser = require('body-parser');

const port = 5000;


var con = mysql.createConnection({
    host: 'orgenizer.csjzksainsxv.us-east-2.rds.amazonaws.com',
    user: 'admin',
    password: 'xxx',
    database: 'orgenizer',
})

con.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

GetAllCustomers = (res) => {
    var sql = "SELECT * FROM orgenizer.customers;";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result)
    })
}

GetAllMechnics = (res) => {
    var sql = "SELECT * FROM orgenizer.mechanics;";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result)
    })
}

GetAllMRoutes = (res) => {
    var sql = "SELECT * FROM orgenizer.route;";
    con.query(sql, function (err, result, fields) {
        if (err) throw err;
        console.log(result);
        res.send(result)
    })
}
var date = new Date
let year = date.getFullYear()
let month = date.getMonth() + 1
let day = date.getDate()
if (day < 10) {
    day = ("0" + day)
}
const currentDate = year + "/" + month + "/" + day
console.log(currentDate);
// the date condition is missing in the query 
GetMechanicRoute = (idmechanic, res) => {
    let allCustomer = null
    console.log(idmechanic);
    var sql = `SELECT * FROM orgenizer.route WHERE idmechanic = ${idmechanic} AND date != ${currentDate}`
    con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result);
        console.log("success");
        var routeQuery = `SELECT * FROM orgenizer.routclientmigration WHERE idroute = ${result[0].idroute}`
        con.query(routeQuery, function (err, resu) {
            if (err) throw err;
            console.log("resu is OK");
            for (let i = 0; i < resu.length; i++) {
                const element = resu[i];
                var customerQuery = `SELECT * FROM orgenizer.customers WHERE idcustomers  = ${element.idcustomer}`
                con.query(customerQuery, function (err, response) {
                    if (err) throw err;
                    if (allCustomer !== null) {
                        allCustomer = [allCustomer, response]
                    } else {
                        allCustomer = response
                    }
                })
            }
            console.log(allCustomer);
            res.send(result)
        })
    })
}

PostNewRoute = (newRoute, res) => {
    for (let i = 0; i < newRoute.length; i++) {
        let element = newRoute[i];
        let sql = `INSERT INTO orgenizer.routclientmigration (idroute, idcustomer) VALUES (${element.routeID} , ${element.customerID})`
        con.query(sql, function (err, response) {
            if (err) throw err;
            console.log(response);
        })
    }
}

PostUpdateCustomer = (updatedCustomer, res) => {
    let sql = `UPDATE orgenizer.customers SET Name = ${updatedCustomer.Name}, Address = ${updatedCustomer.Address}, Phonenumber = ${updatedCustomer.Phonenumber}, Scent = ${updatedCustomer.Scent}, System = ${updatedCustomer.System}, Ladder = ${updatedCustomer.Ladder}, MechanicComment = ${updatedCustomer.MechanicComment}, ManagerComment = ${updatedCustomer.ManagerComment}  WHERE idcustomers = ${updatedCustomer.CustomerId}`
    con.query(sql, function (err, res) {
        if (err) throw err;
        res.send(res)
    })
}
app.use(bodyParser.json())

app.get('/allCustomers', (req, res) => {
    console.log("hello world");
    GetAllCustomers(res)
})

app.get("/mechanics", (req, res) => {
    console.log("mechanics");
    GetAllMechnics(res)
})

app.get("/routes", (req, res) => {
    console.log("routes");
    GetAllMRoutes(res)
})

app.get("/routes/:idmechanic", (req, res) => {
    console.log("mechanics routes");
    GetMechanicRoute(req.params.idmechanic, res)
})

app.post("/add_route", (req, res) => {
    console.log("add route");
    PostNewRoute(req.body, res)
})

app.post("/update_customer", (req, res) => {
    console.log("update customer");
    PostUpdateCustomer(req.body, res)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}!`)
});