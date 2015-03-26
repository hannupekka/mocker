// Require modules.
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var code = require('code');
var server = require('../server');
var method = 'POST';
var url = '/';
var moment = require('moment');

// Tests.
lab.experiment('Test simple data', function() {
    lab.test('Empty payload', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {}
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload).to.be.empty();
            done();
        });

    });
});

lab.experiment('String data', function() {
    lab.test('Data with one string field with default length', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'String'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload.field1).to.exist();
            code.expect(typeof payload.field1).to.equal('string');
            code.expect(payload.field1.length).to.equal(20);
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });
    });

    lab.test('Data with one string field with custom length', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'String',
                    'options': {
                        'length': 10
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload.field1).to.exist();
            code.expect(typeof payload.field1).to.equal('string');
            code.expect(payload.field1.length).to.equal(10);
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });
    });
});

lab.experiment('Number data', function() {
    lab.test('Data with one float field', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Number',
                    'options': {
                        'type': 'float'
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload.field1).to.exist();
            code.expect(typeof payload.field1).to.equal('number');
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });
    });

    lab.test('Data with one float field with min and max parameters', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Number',
                    'options': {
                        'type': 'float',
                        'min': '0',
                        'max': 10
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload.field1).to.exist();
            code.expect(typeof payload.field1).to.equal('number');
            code.expect(payload.field1).to.be.between(-1, 11);
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });
    });

    lab.test('Data with one float field with all parameters', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Number',
                    'options': {
                        'type': 'float',
                        'min': '0',
                        'max': 10,
                        'fixed': 1
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload.field1).to.exist();
            code.expect(typeof payload.field1).to.equal('number');
            code.expect(payload.field1).to.be.between(-1, 11);
            code.expect(payload.field1).to.match(/^\d+(\.\d+)?$/);
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });
    });

    lab.test('Data with one int field without parameters', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Number'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload.field1).to.exist();
            code.expect(typeof payload.field1).to.equal('number');
            code.expect(payload.field1).to.be.between(-9007199254740992, 9007199254740992);
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });
    });

    lab.test('Data with one int field with min and max parameters', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Number',
                    'options': {
                        'type': 'int',
                        'min': '0',
                        'max': 10
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload.field1).to.exist();
            code.expect(typeof payload.field1).to.equal('number');
            code.expect(payload.field1).to.be.between(-1, 11);
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });
    });
});

lab.experiment('Test boolean data', function() {
    lab.test('Data with one boolean field', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Boolean'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.a.boolean();
            code.expect(Object.keys(payload).length).to.equal(1);
            done();
        });

    });
});

lab.experiment('Test array data', function() {
    lab.test('Data with simple string array', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Array',
                    'children': [{
                        'type': 'String',
                        'count': 10
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.an.array();
            code.expect(payload.field1.length).to.equal(10);
            done();
        });

    });

    lab.test('Data with array of strings and integers', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Array',
                    'children': [{
                        'type': 'String'
                    }]
                }, {
                    'name': 'field2',
                    'type': 'Array',
                    'children': [{
                        'type': 'Number',
                        'count': 10,
                        'options': {
                            'min': -100,
                            'max': 100
                        }
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.an.array();
            code.expect(payload.field1.length).to.equal(1);
            code.expect(payload.field2).to.exist();
            code.expect(payload.field2).to.be.an.array();
            code.expect(payload.field2.length).to.equal(10);
            done();
        });
    });

    lab.test('Data with array with 2 child arrays', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Array',
                    'children': [{
                        'type': 'String',
                        'count': 10,
                        'options': {
                            'length': 50
                        }
                    }, {
                        'type': 'String',
                        'count': 5
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.an.array();
            code.expect(payload.field1.length).to.equal(2);
            code.expect(payload.field1[0]).to.exist();
            code.expect(payload.field1[0]).to.be.an.array();
            code.expect(payload.field1[0].length).to.equal(10);
            code.expect(payload.field1[1]).to.exist();
            code.expect(payload.field1[1]).to.be.an.array();
            code.expect(payload.field1[1].length).to.equal(5);
            done();
        });
    });
});

lab.experiment('Test date data', function() {
    lab.test('Data with one date field', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Date',
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.a.string();
            code.expect(payload.field1.length).to.equal(25);
            done();
        });
    });

    lab.test('Data with one date field and start date', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Date',
                    'options': {
                        'from': '2015-01-01'
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.a.string();
            code.expect(payload.field1.length).to.equal(25);
            done();
        });
    });

    lab.test('Data with one formatted date field', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Date',
                    'options': {
                        'format': 'YYYY-MM-DD',
                        'from': ''
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.a.string();
            code.expect(payload.field1).to.match(/^(19|2\d)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/);
            done();
        });
    });

    lab.test('Data with one formatted date field and start date', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'Date',
                    'options': {
                        'format': 'YYYY-MM-DD',
                        'from': '2015-01-01'
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload)
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.field1).to.exist();
            code.expect(payload.field1).to.be.a.string();
            code.expect(payload.field1).to.equal('2015-01-01');
            done();
        });
    });
});
