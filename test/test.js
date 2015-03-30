// Require modules.
var Lab = require('lab');
var lab = exports.lab = Lab.script();
var code = require('code');
var server = require('../server');
var method = 'POST';
var url = '/api';
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
            code.expect(payload.data).to.be.empty();
            done();
        });
    });
    lab.test('Simple word data', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'word'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.string();
            done();
        });
    });
    lab.test('Test static values', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'value': 'foobar'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.string();
            code.expect(payload.data.field1).to.equal('foobar');
            done();
        });
    });
    lab.test('Test objects', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'object',
                    'fields': [{
                        'name': 'field2',
                        'type': 'word',
                        'options': {
                            'length': 10
                        }
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.object();
            code.expect(payload.data.field1.field2).to.exist();
            code.expect(payload.data.field1.field2).to.be.string();
            code.expect(payload.data.field1.field2.length).to.equal(10);
            done();
        });
    });
    lab.test('Test objects with static values', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'object',
                    'fields': [{
                        'name': 'field2',
                        'value': 'foobar'
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.object();
            code.expect(payload.data.field1.field2).to.exist();
            code.expect(payload.data.field1.field2).to.be.string();
            code.expect(payload.data.field1.field2).to.equal('foobar');
            done();
        });
    });
    lab.test('Test options', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'word',
                    'options': {
                        'length': 50
                    }
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.string();
            code.expect(payload.data.field1.length).to.equal(50);
            done();
        });
    });
    lab.test('Test arrays', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'word',
                        'count': 5
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(5);
            code.expect(payload.data.field1[0]).to.exist();
            code.expect(payload.data.field1[0]).to.be.string();
            done();
        });
    });
    lab.test('Test 0-length arrays', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'word'
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(1);
            code.expect(payload.data.field1[0]).to.exist();
            code.expect(payload.data.field1[0]).to.be.string();
            done();
        });
    });
    lab.test('Test arrays with multiple children', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'word',
                        'count': 5
                    }, {
                        'type': 'word',
                        'count': 10
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(2);
            code.expect(payload.data.field1[0]).to.exist();
            code.expect(payload.data.field1[0]).to.be.an.array();
            code.expect(payload.data.field1[0].length).to.equal(5);
            code.expect(payload.data.field1[1]).to.exist();
            code.expect(payload.data.field1[1]).to.be.an.array();
            code.expect(payload.data.field1[1].length).to.equal(10);
            done();
        });
    });
    lab.test('Test array of objects', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'object',
                        'fields': [{
                            'name': 'name',
                            'type': 'name'
                        }],
                        'count': 5
                    }]
                }]
            }
        };
        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(5);
            code.expect(payload.data.field1[4]).to.exist();
            code.expect(payload.data.field1[4]).to.be.an.object();
            code.expect(payload.data.field1[4].name).to.exist();
            code.expect(payload.data.field1[4].name).to.be.string();
            done();
        });
    });
    lab.test('Test generating unsupported data', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'foobar'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.be.null();
            done();
        });
    });
    lab.test('Test random date', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'date'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.be.string();
            code.expect(payload.data.field1.length).to.equal(25);
            done();
        });
    });
    lab.test('Test date with start', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'date',
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
            code.expect(payload.data.field1).to.be.string();
            code.expect(payload.data.field1.length).to.equal(25);
            done();
        });
    });
    lab.test('Test array of dates', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'date',
                        'options': {
                            'from': '2015-01-01',
                            'format': 'YYYY-MM-DD',
                            'add': {
                                'amount': 1,
                                'unit': 'days'
                            }
                        },
                        'count': 5
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(5);
            code.expect(payload.data.field1[0]).to.exist();
            code.expect(payload.data.field1[0]).to.be.string();
            code.expect(payload.data.field1[0]).to.equal('2015-01-01');
            code.expect(payload.data.field1[4]).to.exist();
            code.expect(payload.data.field1[4]).to.be.string();
            code.expect(payload.data.field1[4]).to.equal('2015-01-05');
            done();
        });
    });
    lab.test('Test array of dates without correct params, part 1', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'date',
                        'options': {
                            'from': '2015-01-01',
                            'format': 'YYYY-MM-DD',
                            'add': {}
                        },
                        'count': 5
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(5);
            code.expect(payload.data.field1[0]).to.exist();
            code.expect(payload.data.field1[0]).to.be.string();
            code.expect(payload.data.field1[0]).to.equal('2015-01-01');
            code.expect(payload.data.field1[4]).to.exist();
            code.expect(payload.data.field1[4]).to.be.string();
            code.expect(payload.data.field1[4]).to.equal(payload.data.field1[0]);
            done();
        });
    });
    lab.test('Test array of dates without correct params, part 2', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'date',
                        'options': {
                            'from': '2015-01-01',
                            'format': 'YYYY-MM-DD',
                            'add': {
                                'amount': 1
                            }
                        },
                        'count': 5
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(5);
            code.expect(payload.data.field1[0]).to.exist();
            code.expect(payload.data.field1[0]).to.be.string();
            code.expect(payload.data.field1[0]).to.equal('2015-01-01');
            code.expect(payload.data.field1[4]).to.exist();
            code.expect(payload.data.field1[4]).to.be.string();
            code.expect(payload.data.field1[4]).to.equal(payload.data.field1[0]);
            done();
        });
    });
    lab.test('Test array of dates without correct params, part 1', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'field1',
                    'type': 'array',
                    'children': [{
                        'type': 'date',
                        'options': {
                            'from': '2015-01-01',
                            'format': 'YYYY-MM-DD',
                            'add': {
                                'unit': 'days'
                            }
                        },
                        'count': 5
                    }]
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.field1).to.exist();
            code.expect(payload.data.field1).to.be.an.array();
            code.expect(payload.data.field1.length).to.equal(5);
            code.expect(payload.data.field1[0]).to.exist();
            code.expect(payload.data.field1[0]).to.be.string();
            code.expect(payload.data.field1[0]).to.equal('2015-01-01');
            code.expect(payload.data.field1[4]).to.exist();
            code.expect(payload.data.field1[4]).to.be.string();
            code.expect(payload.data.field1[4]).to.equal(payload.data.field1[0]);
            done();
        });
    });
    lab.test('Different data types', function(done) {
        var options = {
            method: method,
            url: url,
            payload: {
                'fields': [{
                    'name': 'ip',
                    'type': 'ip'
                }, {
                    'name': 'dollar',
                    'type': 'dollar'
                }, {
                    'name': 'zip',
                    'type': 'zip'
                }, {
                    'name': 'color',
                    'type': 'color',
                    'options': {
                        'format': 'hex'
                    }
                }, {
                    'name': 'gender',
                    'type': 'gender'
                }, {
                    'name': 'bool',
                    'type': 'bool'
                }]
            }
        };

        server.inject(options, function(response) {
            var payload = JSON.parse(response.payload);
            code.expect(response.statusCode).to.equal(200);
            code.expect(payload).to.be.an.object();
            code.expect(payload.data.ip).to.exist();
            code.expect(payload.data.ip).to.match(/^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/);
            code.expect(payload.data.dollar).to.exist();
            code.expect(payload.data.dollar).to.match(/^\$\d+\.\d+$/);
            code.expect(payload.data.zip).to.exist();
            code.expect(payload.data.zip).to.match(/\d{5}/);
            code.expect(payload.data.color).to.exist();
            code.expect(payload.data.color).to.match(/#[a-fA-F0-9]{6}/);
            code.expect(payload.data.gender).to.exist();
            code.expect(payload.data.gender).to.match(/(Male|Female)/);
            code.expect(payload.data.bool).to.exist();
            code.expect(payload.data.bool).to.be.boolean();
            done();
        });
    });
});
