// Modules.
var _ = require('lodash');
var Chance = require('chance');
var chance = new Chance();
var moment = require('moment');

// Routes.
module.exports = {
    method: 'POST',
    path: '/',
    handler: function(request, reply) {
        var payload = _.isEmpty(request.payload) ? {} : request.payload;
        var fields = payload.fields;
        var response = {};

        if (_.isUndefined(fields)) {
            return reply(response);
        }

        _.each(fields, function(field) {
            response[field.name] = generate(field);
        });

        reply(response);
    }
};

var generate = function(field) {
    var value;
    var params = {};
    var options = field.options || {};
    var children = field.children || [];

    switch (field.type) {
        default:
        case 'String':
            params = {
                length: options.length || 20
            };
            value = chance.word(params);
            break;
        case 'Number':
            if (options.type && options.type === 'float') {
                params = {
                  min: options.min || undefined,
                  max: options.max || undefined,
                  fixed: options.fixed || 0
                };
                value = chance.floating(params);
            } else {
                params = {
                  min: options.min || -9007199254740992,
                  max: options.max || 9007199254740992
                };
                value = chance.integer(params);
            }
            break;
        case 'Boolean':
            value = chance.bool();
            break;
        case 'Array':
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
                        target.push(generate(child));
                    }
                } else {
                    value.push(generate(child));
                }
            });
            break;
        case 'Date':
            if (_.isUndefined(options.from) || _.isEmpty(options.from)) {
                value = moment(chance.date()).format(options.format || '');
            } else {
                var date = moment(options.from);
                value = date.format(options.format || '');
            }
            break;
    }

    return value;
};
