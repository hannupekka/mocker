var RequestContainer = React.createClass({
    getInitialState: function() {
        return {
            data: {
                message: "OK",
                data: []
            }
        };
    },
    sendRequest: function(requestBody) {
        console.log('sent', requestBody);
        $.ajax({
            url: '/api',
            dataType: 'json',
            method: 'POST',
            contentType: 'application/json',
            data: requestBody,
            success: function(response) {
                var data = {
                    message: response.message,
                    data: JSON.stringify(response.data, null, '\t')
                };
                this.setState({data: data});
            }.bind(this),
            error: function(xhr, status, err) {
                console.error('/api', status, err.toString());
            }.bind(this)
        });
    },
    render: function() {
        return (
            <div id="request">
                <RequestForm onSubmit={this.sendRequest}/>
                <ResponseBox data={this.state.data} />
            </div>
        );
    }
});

var RequestForm = React.createClass({
    /*getInitialState: function() {
        console.log('resetted');
        return {value: JSON.stringify({"fields": [{"name": "foo", "type": "word"}]}, null, '\t')};
    },*/
    handleSubmit: function(e) {
        e.preventDefault();
        var requestBody = React.findDOMNode(this.refs.requestBody).value.trim();
        if (!requestBody) {
            return;
        }
        this.props.onSubmit(requestBody);
        return;
    },
    componentDidMount: function() {
      $('#requestBody').val(JSON.stringify({"fields": [{"name": "foo", "type": "word"}]}, null, '\t')).ace({ lang: 'json' });
    },
    render: function() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label>Request</label>
                    <textarea rows="20" id="requestBody" className="form-control" ref="requestBody">
                    </textarea>
                </div>
                <button type="submit" className="btn btn-default">Send</button>
            </form>
        );
    }
});

var ResponseBox = React.createClass({
    componentDidMount: function() {
      //$('#responseBody').ace({ lang: 'json' });
    },
    render: function() {
        return (
            <div>
            <strong>Response: </strong><em>{this.props.data.message}</em>
            <pre>{this.props.data.data}</pre>
           </div>
        );
    }
});

React.render(
    <RequestContainer />,
    document.getElementById('content')
);

var defaultRequest = function() {
        return "foo";
    };