// Modules.
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();
var moment = require('moment');
var generators = require('annogenerate');
var schema2object = require('schema2object');

// Routes.
module.exports = [
    // Mock calls.
    {
        // Listen for all methods.
        method: ['GET', 'POST', 'PUT', 'DELETE'],
        // Listen under /api/*.
        path: '/api/{path*}',
        handler: function(request, reply) {
            // Get request body.
            var payload = _.isEmpty(request.payload) ? {} : request.payload;

            // Get fields from body.
            var fields = payload.fields;

            // Get schema from body.
            var schema = payload.schema;

            // Initialize response.
            var response = {
                'message': 'OK',
                'data': {}
            };

            // Check if fields are specified.
            if (_.isUndefined(fields)) {
                // No fields or schema in request body, return empty response.
                if (_.isUndefined(schema)) {
                    response.message = 'Missing parameter fields from request.';
                    return reply(response);
                } else {
                    // Use schema to generate field properties.
                    var properties;
                    _.each(schema, function(field, name) {
                        // Get properties from schema.
                        properties = field.properties;

                        // Make sure we have properties.
                        if (_.isUndefined(properties)) {
                            response.data[name] = 'Missing properties.';
                            return;
                        }

                        // Generate object.
                        try {
                            response.data[name] = schema2object.properties2object({
                                generators: generators,
                                properties: properties,
                                definitions: schema
                            });
                        } catch (exception) {
                            response.data[name] = 'Invalid schema.';
                        }
                    });
                }
            } else {
                // Loop trough fields and either generate or use static value for each.
                _.each(fields, function(field) {
                    response.data[field.name] = !_.isUndefined(field.value) ? field.value : generate(field);
                });
            }

            // Reply to user.
            reply(response);
        }
    },
    // Static demo site.
    {
        // Listen only for GET
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                // Serve content from public/
                path: 'public'
            }
        }
    }
];

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

    // Check if schema is specified.
    var schema = field.schema;

    // Ignore type if schema is provided.
    if (!_.isUndefined(schema)) {
        delete field.type;
    }

    // Check which type field is.
    switch (field.type) {
        // Default to Chance.js types: http://chancejs.com/
        default:
            var fn = field.type;

            // Check if field has schema.
            if (_.isUndefined(schema)) {
                // Check if Chance has a function that matches the type of field. If it has, generate value using that.
                // If not, field value is null.
                value = _.isFunction(chance[fn]) ? chance[fn](options) : null;
            } else {
                // Use schema to generate field properties.
                var properties = schema.properties;
                value = schema2object.properties2object({
                    generators: generators,
                    properties: properties,
                    definitions: schema
                });
            }
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
