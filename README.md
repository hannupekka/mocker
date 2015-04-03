# Mocker [![Build Status](https://travis-ci.org/hannupekka/mocker.svg?branch=master)](https://travis-ci.org/hannupekka/mocker)

With Mocker, you can fake responses for your HTTP requests. Just send a JSON object describing the response you need along the request and Mocker takes care of rest.

## Installing and running
* First install dependencies with `npm install`
* Then run with `node server.js`
* Run tests with `npm test`

## Usage
By default, Mocker listens for all methods at `http://host:port/api/*`. Just make sure your request has header `Content-Type: application/json`.

Structure for request body is as follows:

```
{
	"fields": []
}
```

`fields`-property should be filled with objects, that describe fields. Structure for field objects is:

```
{
	"name": "<field name>",
	"type": "<field type>",
	"value": "<field value>",
	"options": {
		"<option name>": "<option value>"
	},
	"children": [],
	"count": 0

}
```

* `name` - name of the field in response.
* `type` - type of the field. Valid values for type are the functions  that [Chance.js](http://chancejs.com/) provides. In addition to that, type can also be one of the following:
	* array
		* If type is `array` then also property `children` must be included. This describes how the array should be filled.
		* With `count` you can set the amount of children generated.

	* object
		* If type is `object`then also property `fields` must be included. This describes the properties of the object, just like in the request body.
	* date
		* Valid options for date are:
			* `from` - starting date, see [http://momentjs.com/docs/#/parsing/](http://momentjs.com/docs/#/parsing/)
			* `format` - output format, see [http://momentjs.com/docs/#/displaying/](http://momentjs.com/docs/#/displaying/).
			* `add` - amount and unit to add to previous date, see [http://momentjs.com/docs/#/manipulating/add/](http://momentjs.com/docs/#/manipulating/add/)
* `value` - value of the field. Rest of the properties are ignored.
* `options` - options to pass to [Chance.js](http://chancejs.com/) - depends of type used.

## Examples
### Simple data types

Request:

```
{
	"fields": [
		{
			"name": "female_firstname",
			"type": "first",
			"options": {
				"gender": "female"
			}
		},
		{
			"name": "email",
			"type": "email"
		}
	]
}
```

Response:

```
{
	"message": "OK",
	"data": {
		"female_firstname": "Fannie",
		"email": "iviasli@na.co.uk"
	}
}
```

### Object with static values
```
{
	"fields": [
		{
			"name": "foo",
			"value": "bar"
		}
	]
}
```
```
{
	"message": "OK",
	"data": {
		"foo": "bar"
	}
}
```

### Simple array of strings
```
{
	"fields": [
		{
			"name": "words",
			"type": "array",
			"children": [{
				"type": "word",
				"count": 10
			}]
		}
	]
}
```
```
{
	"message": "OK",
	"data": {
		"words": [
			"on",
			"ge",
			"tu",
			"ififla",
			"apocejpol",
			"jipif",
			"gi",
			"uzeoz",
			"ne",
			"ado"
		]
	}
}
```
### Range of dates
```
{
	"fields": [
		{
			"name": "dates",
			"type": "array",
			"children": [{
				"type": "object",
				"fields": [
					{
						"name": "name",
						"type": "name"
					},
					{
						"name": "date",
						"type": "date",
						"options": {
							"from": "2015-01-01",
							"format": "YYYY-MM-DD",
							"add": {
								"amount": 1,
								"unit": "days"
							}
						}
					}
				],
				"count": 3
			}]
		}
	]
}
```
```
{
	"message": "OK",
	"data": {
		"dates": [
			{
				"name": "Cornelia Rodriquez",
				"date": "2015-01-01"
			},
			{
				"name": "Sara Elliott",
				"date": "2015-01-02"
			},
			{
				"name": "Dylan Green",
				"date": "2015-01-03"
			}
		]
	}
}
```

## Try it
Try the [demo](http://responsemocker.herokuapp.com/) or point your requests to [http://responsemocker.herokuapp.com/api](http://responsemocker.herokuapp.com/api)

## TODO
* Allow multiple values for `add`in `date`-type fields.
