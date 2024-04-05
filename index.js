const sequelize = require('./db_config');
const express = require('express');
var apiRoutes = require('./routes/api/route');
var adminRoutes = require('./routes/admin/route');
const bodyParser = require('body-parser');
const relations = require('./model/relations')
const productSeeder = require("./seeders/product_seeder");
const categorySeeder = require('./seeders/categor_seeder');
const app = express()
require('dotenv').config()
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(express.json());
// app.use(express.urlencoded({extended: true}))

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

sequelize.authenticate().then(async()=>{
await sequelize.sync({force: true})
  productSeeder(true)
  categorySeeder(true)
});


app.use('/api', apiRoutes);
app.use('/admin', adminRoutes);



app.listen(process.env.PORT||8080, () => {
    console.log(`Url: http://localhost:${process.env.PORT}/`)
    console.log(`Example app listening on port ${process.env.PORT}`)
  })