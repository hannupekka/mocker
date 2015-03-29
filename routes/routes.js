// Modules.
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();
var moment = require('moment');

// Routes.
module.exports = {
    method: '*',
    path: '/api/{path*}',
    handler: function(request, reply) {
        var payload = _.isEmpty(request.payload) ? {} : request.payload;
        var fields = payload.fields;
        var response = {};

        if (_.isUndefined(fields)) {
            return reply(response);
        }

        _.each(fields, function(field) {
            response[field.name] = !_.isUndefined(field.value) ? field.value : generate(field);
        });

        reply(response);
    }
};

var generate = function(field, iteration) {
    var value;
    var options = field.options || {};
    var children = field.children || [];

    switch (field.type) {
        default:
            var fn = field.type;
            value = _.isFunction(chance[fn]) ? chance[fn](options) : null;
            break;
        case 'array':
            value = [];
            var count;
            var target = value;
            _.each(children, function(child, index) {
                count = child.count || 0;
                if (count > 0) {
                    if (children.length > 1) {
                        value[index] = [];
                        target = value[index];
                    }
                    for (var i = 0; i < count; i++) {
                        target.push(generate(child, i));
                    }
                } else {
                    value.push(generate(child));
                }
            });
            break;
        case 'date':
            var date = _.isUndefined(options.from) ? moment(chance.date()) : moment(options.from);

            if (!_.isUndefined(options.add) && !_.isUndefined(iteration)) {
                var amount = options.add.amount;
                var unit = options.add.unit;
                if (!_.isUndefined(amount) && !_.isUndefined(unit)) {
                    date = date.add(amount * iteration, unit);
                }
            }
            value = date.format(options.format || '');
            break;
        case 'object':
            value = {};
            _.each(field.fields, function(childField) {
                value[childField.name] = !_.isUndefined(childField.value) ?
                    childField.value : generate(childField, iteration);
            });
            break;
    }

    return value;
};
