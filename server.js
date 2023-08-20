const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const shipmentRoutes = require('./routes/shipment');
const errorController = require('./controllers/error')

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')))

app.use('/admin', adminRoutes);
app.use('/shipment', shipmentRoutes);
app.use(shopRoutes);

app.use(errorController.notFound);

app.listen(3000);
