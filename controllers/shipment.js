const Shipment = require('../models/shipment');

exports.createShipment = (req, res) => {
    const new_shipment = new Shipment(req.body)
    res.json(new_shipment.validate());
};