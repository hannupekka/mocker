// Modules.
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();
var moment = require('moment');

// Routes.
module.exports = {
    // Listen for all methods.
    method: '*',
    // Listen under /api/*.
    path: '/api/{path*}',
    handler: function(request, reply) {
        // Get request body.
        var payload = _.isEmpty(request.payload) ? {} : request.payload;

        // Get fields from body.
        var fields = payload.fields;

        // Initialize response.
        var response = {'message': 'OK', 'data': {}};

        // No fields in request body, return empty response.
        if (_.isUndefined(fields)) {
            response.message = 'Missing parameter fields from request.';
            return reply(response);
        }

        // Loop trough fields and either generate or use static value for each.
        _.each(fields, function(field) {
            response.data[field.name] = !_.isUndefined(field.value) ? field.value : generate(field);
        });

        // Reply to user.
        reply(response);
    }
};

/**
 * Generates values for field.
 * @param {Object} field     Field definition
 * @param {Number} iteration Iteration when in array
 */
var generate = function(field, iteration) {
    // Field value.
    var value;

    // Field options, like string lenght or integer max. value.
    var options = field.options || {};

    // Array children.
    var children = field.children || [];

    // Check which type field is.
    switch (field.type) {
        // Default to Chance.js types: http://chancejs.com/
        default:
            var fn = field.type;

            // Check if Chance has a function that matches the type of field. If it has, generate value using that.
            // If not, field value is null.
            value = _.isFunction(chance[fn]) ? chance[fn](options) : null;
            break;
        case 'array':
            value = [];

            // Child count for array.
            var count;

            // Where to save array values.
            var target = value;

            // Loop through array children.
            _.each(children, function(child, index) {
                // How many child user want us to generate?
                count = child.count || 0;

                // If there are multiple children, we need to save our values into 2-dimensional array.
                if (count > 0) {
                    // If array has multiple child objects, save values for them to their own indices.
                    if (children.length > 1) {
                        // Initialize array.
                        value[index] = [];
                        target = value[index];
                    }

                    // Generate child values.
                    for (var i = 0; i < count; i++) {
                        target.push(generate(child, i));
                    }
                } else {
                    value.push(generate(child));
                }
            });
            break;
        case 'date':
            // If user wants some certain date, use it. Otherwise, generate random date.
            var date = _.isUndefined(options.from) ? moment(chance.date()) : moment(options.from);

            // Are we processing an array of dates that increase with each iteration?
            if (!_.isUndefined(options.add) && !_.isUndefined(iteration)) {
                var amount = options.add.amount;
                var unit = options.add.unit;

                // Add desired amount of units to previous date.
                if (!_.isUndefined(amount) && !_.isUndefined(unit)) {
                    date = date.add(amount * iteration, unit);
                }
            }

            // Format - or don't.
            value = date.format(options.format || '');
            break;
        case 'object':
            value = {};
            // Generate values for each field.
            _.each(field.fields, function(childField) {
                value[childField.name] = !_.isUndefined(childField.value) ? childField.value : generate(childField, iteration);
            });
            break;
    }

    return value;
};
