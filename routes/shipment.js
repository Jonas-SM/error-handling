const express = require('express');

const router = express.Router();

const shipmentController = require('../controllers/shipment')

router.post('/create-shipment', shipmentController.createShipment);

module.exports = router;