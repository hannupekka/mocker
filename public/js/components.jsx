var RequestContainer = React.createClass({
    getInitialState: function() {
        return {
            data: {}
        };
    },
    sendRequest: function(requestBody) {
        $.ajax({
            url: '/api',
            dataType: 'json',
            method: 'POST',
            contentType: 'application/json',
            data: requestBody,
            success: function(response) {
                this.setState({data: JSON.stringify(response, null, '\t')});
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
      $('#requestBody').val(JSON.stringify({"fields": [{"name": "name", "type": "name"}]}, null, '\t')).ace({ lang: 'json' });
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
    render: function() {
        return (
            <div>
            <label>Response</label>
            <pre>{this.props.data}</pre>
           </div>
        );
    }
});

React.render(
    <RequestContainer />,
    document.getElementById('content')
);
