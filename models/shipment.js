/**
 * Helper method that recursively checks if a given key exists somewhere in a nested (or regular) json object
 *
 * @param {object} obj The json object to be searched
 * @param {string} key The key that is being searched
 *
 * @returns {boolean} returns whether key exists or not
 */
const checkKeyExists = (obj, key) => {
    if (typeof obj !== "object") {
        return false;
    }

    else if (obj.hasOwnProperty(key)) {
        return true;
    }

    else {
        for (const object in obj) {
            const exists = checkKeyExists(obj[object], key);
            if (exists) {
                return exists;
            }
        }
    }
    return false;
}

/**
 * Helper method that recursively searches for the key and returns the respective value (as a json object)
 *
 * @param {object} obj The json object to be searched
 * @param {string} key The key that is being searched
 *
 * @returns {object} The respective value for the given key
 */
const getValueForKey = (obj, key) => {
    if (typeof obj !== "object") {
        return {};
    }

    else if (obj.hasOwnProperty(key)) {
        return obj[key];
    }

    else {
        for (const object in obj) {
            const val = getValueForKey(obj[object], key);
            if (Object.keys(val).length > 0) {
                return val;
            }
        }
    }
    return {};
}

module.exports = class Shipment {
    // List of mandatory fields
    mandatoryFields = ["msgId", "sender", "boxNumber", "senderInfo.plant", "senderInfo.shippingPoint", "soldTo.SoldToCode", "shipTo.shipToCode", "intermediate.intermediateCode"];

    constructor(shipmentDetails) {
        this.shipmentDetails = shipmentDetails;
    }

    // validates shipment to check if all mandatory fields are present
    validate() {
        // basic response
        let response = {
            status: 200,
            message: "new shipment has been successfully created",
            missingFields: []
        };

        // Iterate over all mandatory fields to check if they are present
        for (let i=0; i<this.mandatoryFields.length; i++) {
            let field = this.mandatoryFields[i];

            // If field name includes a dot, it contains a hierarchy of field names that have to be checked in order
            if (field.includes(".")) {
                const separateFieldNames = field.split(".");

                let fieldNames = getValueForKey(this.shipmentDetails, separateFieldNames[0]);
                let fieldExists = true;

                // Check first field name and then also iteratively the following field names
                if (checkKeyExists(this.shipmentDetails, separateFieldNames[0])) {
                    for (let i= 1; i<separateFieldNames.length; i++) {
                        // check json object for the next field name
                        if (!(fieldNames.hasOwnProperty(separateFieldNames[i]))) {
                            fieldExists = false;
                        }
                        fieldNames = fieldNames[separateFieldNames[i]];
                    }
                } else {
                    fieldExists = false;
                }

                if (!(fieldExists)) {
                    response["missingFields"].push(field);
                    response["status"] = 400;
                    response["message"] = "shipment has not been created due to missing mandatory fields";
                }

            }

            else if (!(checkKeyExists(this.shipmentDetails, field))) {
                response["missingFields"].push(field);
                response["status"] = 400;
                response["message"] = "shipment has not been created due to missing mandatory fields";
            }
        }
        return response;
    }

};