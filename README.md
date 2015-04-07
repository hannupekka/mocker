# Mocker [![Build Status](https://travis-ci.org/hannupekka/mocker.svg?branch=master)](https://travis-ci.org/hannupekka/mocker) ![Codeship Status](https://codeship.com/projects/842f4440-bf18-0132-325a-020f906a5190/status?branch=master)

With Mocker, you can fake responses for your HTTP requests. Just send a JSON object describing the response you need along the request and Mocker takes care of rest. Mocker uses the following awesome libraries to generate data:

* [Chance.js](http://chancejs.com/)
* [Moment.js](http://momentjs.com/)
* [schema2object](https://github.com/bebraw/schema2object)

## Installing and running
* First install dependencies with `npm install`
* Then run with `node server.js`
* Run tests with `npm test`

## Usage
By default, Mocker listens for all methods at `http://host:port/api/*`. Just make sure your request has header `Content-Type: application/json`.

Structure for request body is as follows:

```json
{
	"fields": [],
	"schema": {}
}
```

`fields`-property should be filled with objects, that describe fields. Structure for field objects is:

```json
{
	"name": "<field name>",
	"type": "<field type>",
	"value": "<field value>",
	"options": {
		"<option name>": "<option value>"
	},
	"children": [],
	"fields": {},
	"schema": {},
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
* `value` - value of the field. Rest of the properties (except `name`) are ignored, if this is set.
* `schema` - use [schema2object](https://github.com/bebraw/schema2object) to define object properties. Rest of the properties (except `name`) are ignored, if this is set.
* `options` - options to pass to [Chance.js](http://chancejs.com/) - depends of type used.

`schema`-property should be valid [schema2object](https://github.com/bebraw/schema2object) schema. `fields`-property should not be defined when using this since it takes precedence.

## Examples
### Simple data types

Request:

```json
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

```json
{
	"message": "OK",
	"data": {
		"female_firstname": "Fannie",
		"email": "iviasli@na.co.uk"
	}
}
```

### Object with static values
```json
{
	"fields": [
		{
			"name": "foo",
			"value": "bar"
		}
	]
}
```
```json
{
	"message": "OK",
	"data": {
		"foo": "bar"
	}
}
```

### Simple array of strings
```json
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
```json
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
```json
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
```json
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
### Using schema instead of fields
```json
{
    "schema": {
        "Client": {
            "required": [
                "name",
                "address",
                "city",
                "postalCode",
                "phone",
                "companyId",
                "iban",
                "bic",
                "language"
            ],
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Id of the invoice pending"
                },
                "name": {
                    "type": "string"
                },
                "address": {
                    "type": "string"
                },
                "city": {
                    "type": "string"
                },
                "postalCode": {
                    "type": "string"
                },
                "phone": {
                    "type": "string"
                },
                "companyId": {
                    "$ref": "#/definitions/Id"
                },
                "iban": {
                    "type": "string"
                },
                "bic": {
                    "type": "string"
                },
                "language": {
                    "type": "string",
                    "enum": [
                        "en-en",
                        "fi-fi"
                    ]
                },
                "createdAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the invoice was created at",
                    "readOnly": true
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the invoice was updated",
                    "readOnly": true
                }
            }
        },
        "Error": {
            "properties": {
                "payload": {
                    "type": "object"
                },
                "message": {
                    "type": "string"
                }
            }
        },
        "Id": {
            "type": "integer",
            "format": "int32",
            "description": "Id of the invoice pending"
        },
        "InvoiceItem": {
            "properties": {
                "description": {
                    "type": "string",
                    "description": "Description of the invoice item"
                },
                "cost": {
                    "type": "number",
                    "description": "Cost of the invoice item"
                },
                "vat": {
                    "default": 0,
                    "type": "number",
                    "description": "Vat of the invoice item"
                }
            }
        },
        "InvoicePending": {
            "required": [
                "sender",
                "receiver",
                "items",
                "due",
                "paymentDays"
            ],
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Id of the invoice pending"
                },
                "invoiceId": {
                    "type": "number",
                    "description": "Unique invoice id generated internally by the backend",
                    "readOnly": true
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "WAITING_TO_BE_SENT",
                        "SENT",
                        "WAITING_PAYMENT",
                        "RECEIVED_PAYMENT"
                    ],
                    "readOnly": true,
                    "description": "Status of the invoice pending"
                },
                "sender": {
                    "$ref": "#/definitions/Id",
                    "description": "Sender of the invoice pending"
                },
                "receiver": {
                    "$ref": "#/definitions/Id",
                    "description": "Receiver of the invoice pending"
                },
                "items": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "$ref": "#/definitions/InvoiceItem"
                    },
                    "description": "Items of the invoice pending"
                },
                "due": {
                    "type": "string",
                    "format": "date",
                    "description": "Day in which the invoice is due"
                },
                "paymentDays": {
                    "type": "number",
                    "description": "Amount of days to pay the bill",
                    "default": 8
                },
                "createdAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the invoice was created at",
                    "readOnly": true
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the invoice was updated",
                    "readOnly": true
                }
            }
        },
        "InvoiceSent": {
            "required": [
                "sender",
                "receiver",
                "items",
                "due",
                "paymentDays"
            ],
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Id of the invoice pending"
                },
                "invoiceId": {
                    "type": "number",
                    "description": "Unique invoice id generated internally by the backend",
                    "readOnly": true
                },
                "status": {
                    "type": "string",
                    "enum": [
                        "WAITING_TO_BE_SENT",
                        "SENT",
                        "WAITING_PAYMENT",
                        "RECEIVED_PAYMENT"
                    ],
                    "readOnly": true,
                    "description": "Status of the invoice sent"
                },
                "sender": {
                    "$ref": "#/definitions/Id",
                    "description": "Sender of the invoice sent"
                },
                "receiver": {
                    "$ref": "#/definitions/Id",
                    "description": "Receiver of the invoice sent"
                },
                "items": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                        "$ref": "#/definitions/InvoiceItem"
                    },
                    "description": "Items of the invoice sent"
                },
                "due": {
                    "type": "string",
                    "format": "date",
                    "description": "Day in which the invoice is due"
                },
                "paymentDays": {
                    "type": "number",
                    "description": "Amount of days to pay the bill",
                    "default": 8
                },
                "createdAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the invoice was created at",
                    "readOnly": true
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the invoice was updated",
                    "readOnly": true
                }
            }
        },
        "InvoiceStatus": {
            "type": "string",
            "enum": [
                "WAITING_TO_BE_SENT",
                "SENT",
                "WAITING_PAYMENT",
                "RECEIVED_PAYMENT"
            ]
        },
        "ProductGroup": {
            "required": [
                "name",
                "description"
            ],
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Id of the invoice pending"
                },
                "name": {
                    "type": "string",
                    "description": "Name of the product group"
                },
                "description": {
                    "type": "string",
                    "description": "Description of the product group"
                },
                "createdAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the group was created at",
                    "readOnly": true
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the group was updated",
                    "readOnly": true
                }
            }
        },
        "Product": {
            "required": [
                "name",
                "description",
                "purchasePrice",
                "sellingPrice",
                "priceChanged",
                "vat",
                "group",
                "inStock"
            ],
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Id of the invoice pending"
                },
                "name": {
                    "type": "string",
                    "description": "Name of the product"
                },
                "description": {
                    "type": "string",
                    "description": "Description of the product"
                },
                "purchasePrice": {
                    "type": "number",
                    "description": "Purchase price of the product"
                },
                "sellingPrice": {
                    "type": "number",
                    "description": "Selling price of the product"
                },
                "priceChanged": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Date when price of the product changed"
                },
                "vat": {
                    "type": "number",
                    "description": "VAT of the product"
                },
                "group": {
                    "$ref": "#/definitions/Id",
                    "description": "Group of the product"
                },
                "inStock": {
                    "type": "boolean",
                    "description": "Is the product in the stock"
                },
                "createdAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the group was created at",
                    "readOnly": true
                },
                "updatedAt": {
                    "type": "string",
                    "format": "date-time",
                    "description": "Day in which the group was updated",
                    "readOnly": true
                }
            }
        },
        "User": {
            "properties": {
                "id": {
                    "type": "integer",
                    "format": "int32",
                    "description": "Id of the user"
                },
                "name": {
                    "type": "string"
                },
                "invoicingId": {
                    "type": "number",
                    "description": "Invoicing id that is unique per user"
                }
            }
        }
    }
}
```
```json
{
    "message": "OK",
    "data": {
        "Client": {
            "id": 8.521507304594526e+307,
            "name": "]1\"\\_IF~Jg<_v)/,N[MC%a=)4)5/i_;w{JRDV#:uM~M-]JCJ=eg;\\p[@6a%[_y=9E]4tH1=uVb#0kA)[h",
            "address": "Q,@}L5k+!ca(QV3?Xqq4NaB;x<IDCH7;h(^O\\\\![tT8Ah4;Vir#]#tP:O",
            "city": "CJf9q=eUaoVb`HJW1\\L,|bqugdb03~fR}!aE\\Q2H_|57]9|{3p]kSy>?x+gk(z+CCANdV/H3(ZP_cU8wb?<3x^y|UI=29sFC&a",
            "postalCode": "9HrX|1Cojhl-,f+\")N|ED+B>3]CjR}wM.M.~kIK{kY6.&O%+a}k-ZI~80lrp;od4_c<py<2rv@viP2YQG6OUii{!yk0aCH",
            "phone": "=JL:xyx60k\\d`^E4p`i=)h`FZYG,_%oBw",
            "companyId": 6.813044670972909e+307,
            "iban": "drq=-7ID3bQ{g~'M-]lq?:SXe05-'hzvOD6_jaK",
            "bic": "$K^bE\"vTeVa*xE>X6XtL~ZjV^b,/=:&vWpS,*{GTB3Zb^,T`i0.`^ScowvXxnvp3;",
            "language": "fi-fi",
            "createdAt": "2015-04-07T10:57:20.074Z",
            "updatedAt": "2015-04-07T10:57:20.074Z"
        },
        "Error": {
            "payload": {},
            "message": "/9gf~snl&F[Zuk9T[q4?_wJ9TVE!v;0GJI,#nLh)Nv\\sCU"
        },
        "Id": "Missing properties",
        "InvoiceItem": {
            "description": "xf1B}wna9*<hnI[z6JU#$fpW|\":ihYH>Z`SB;uNnu26F&My.f)",
            "cost": 1.0543275899029713e+308,
            "vat": 4.656849943295265e+307
        },
        "InvoicePending": {
            "id": 9.53169985720178e+307,
            "invoiceId": 1.053087805891723e+308,
            "status": "RECEIVED_PAYMENT",
            "sender": 6.469689791564423e+307,
            "receiver": 1.758843833202085e+308,
            "items": [
                {
                    "description": "YO|c1iM\"\\/21K3k=HYG},?kz(+DM]U=X#Tv0xHt0sL?,\\]+,,}3Ft_x}\"*%hRZwy\"p+(Pq~(1JrAJ\"1aC",
                    "cost": 1.1183951752013998e+308,
                    "vat": 1.203785723603266e+308
                },
                {
                    "description": "LUV/,X]Vp#q6.:y.K~{>mc/NJ@DTI.&19.vFMF=RNdy`#~h>1;.]V-D/Ek+U[mD[0?3",
                    "cost": 1.2052516013718853e+308,
                    "vat": 4.3070833865883046e+307
                },
                {
                    "description": "yT:PCE|UU~'sE~)-^Y,o?t@9K/k#s~4KGK6_uRo<8l.rFgq\\/E+iazskO8A/G;2(71[NKJEF",
                    "cost": 5.9447167145861625e+307,
                    "vat": 7.069464264944443e+307
                }
            ],
            "due": "2015-04-07",
            "paymentDays": 1.1160628211604633e+308,
            "createdAt": "2015-04-07T10:57:20.080Z",
            "updatedAt": "2015-04-07T10:57:20.080Z"
        },
        "InvoiceSent": {
            "id": 1.5046042297702422e+308,
            "invoiceId": 2.600542432498807e+307,
            "status": "WAITING_TO_BE_SENT",
            "sender": 1.472496282237761e+308,
            "receiver": 2.406043629962047e+307,
            "items": [
                {
                    "description": "wK)vZbfl7C9D]gfFSn9u-q",
                    "cost": 1.6908087700539216e+308,
                    "vat": 1.0151218931789231e+308
                },
                {
                    "description": "~uE3<f/#2LGP2~'cjwd{DS3,d^z_c2c.^Zah^#(<BRl[mDrD:#",
                    "cost": 1.13534830771743e+308,
                    "vat": 7.198566770909733e+307
                },
                {
                    "description": "2_I9E{Kpy*9BZLDV\"Con6bOh>.;1|oTOM~rYuh4o\".5KBZ?}ZB.xr!@4?F#m~[Mk]x3*g\"BFC{Z'2da0@5,/d::p.UN2",
                    "cost": 1.785781014624167e+308,
                    "vat": 8.204417570640669e+307
                },
                {
                    "description": "-g;`fPa@>a1Z*RhTttuL=3_|w",
                    "cost": 1.3553775662054665e+308,
                    "vat": 7.682628946088098e+307
                },
                {
                    "description": "1wHVVZM+n4`7zwdUY.MUE:$u;Rr`x39<qO)Gw=o-Bq&@,+&F#P'JlQyw4$P0d=L/]*.?DF6:YD:rmaB{.aY;10r",
                    "cost": 1.7941508676239046e+308,
                    "vat": 1.3618314115532151e+308
                }
            ],
            "due": "2015-04-07",
            "paymentDays": 1.6215462624043726e+308,
            "createdAt": "2015-04-07T10:57:20.086Z",
            "updatedAt": "2015-04-07T10:57:20.086Z"
        },
        "InvoiceStatus": "Missing properties",
        "ProductGroup": {
            "id": 1.2035163438280712e+308,
            "name": "a!K,U%{mKT#J-4xcShE*R<]8+wr/\"2=lKysz3\\-S'`Y%to|q8[1\"G~+C8yil4TT^|1KnKJae@SO1r\"J8wv:)(v7n)@",
            "description": "&&.a\"hgvl&2vxMG}A=\"",
            "createdAt": "2015-04-07T10:57:20.087Z",
            "updatedAt": "2015-04-07T10:57:20.087Z"
        },
        "Product": {
            "id": 1.0966499359971245e+308,
            "name": "<Sv:MaR=jvP,)NRWS%@$`3^JzX:}3Z5|?$v8Erf0B6=Sp=+5nD`]iEhN&B\\1U=?g\\WyxdJfgsghti}\\(ob*D$.E}moXo3-\"J<Z",
            "description": "wnRj6spP]<%h54&&',!zdR\"~tN\\)t1ZZ4%^8/pc3oRq0iwH7~:O6}n8c_c`n<~",
            "purchasePrice": 1.0727900465131778e+308,
            "sellingPrice": 5.833226269121914e+307,
            "priceChanged": "2015-04-07T10:57:20.088Z",
            "vat": 1.0794273487840085e+307,
            "group": 1.1414744777804981e+308,
            "inStock": false,
            "createdAt": "2015-04-07T10:57:20.089Z",
            "updatedAt": "2015-04-07T10:57:20.089Z"
        },
        "User": {
            "id": 1.8901164421102586e+307,
            "name": "c3_o0fQgr~DsVApF_fjnZmV/sw)tLt9pF{\"`4oXv`A/'~y",
            "invoicingId": 1.1266662426415996e+308
        }
    }
}
```
### Array of objects, defined by schema
```json
{
    "fields": [
        {
            "name":"users",
            "type": "array",
            "children": [
                {
                    "schema": {
                        "properties": {
                            "id": {
                                "type": "integer",
                                "format": "int32",
                                "description": "Id of the user"
                            },
                            "name": {
                                "type": "string"
                            },
                            "invoicingId": {
                                "type": "number",
                                "description": "Invoicing id that is unique per user"
                            }
                        }
                    },
                    "count": 5
                }
            ]
        }
    ]
}
```
```json
{
    "message": "OK",
    "data": {
        "users": [
            {
                "id": 1.0637304048248677e+307,
                "name": "i\"vc4BDH=DSSITgNEp-Zfzxke-3GVPc,+b>,B'l-\\{5A<7<YHK~*T-~w.K9T5rb&Nrc)",
                "invoicingId": 7.621919147730567e+307
            },
            {
                "id": 1.6083189281346103e+308,
                "name": "RxH\\cPo!7l<\\Hjcmib_[;so%S",
                "invoicingId": 4.941917906214933e+307
            },
            {
                "id": 1.5125068547902805e+308,
                "name": "V0`Q$([M)b{?|E6\"a]",
                "invoicingId": 2.186935028830185e+307
            },
            {
                "id": 1.4827991120699375e+308,
                "name": "(bC0:~0`V8",
                "invoicingId": 2.9299701360217206e+306
            },
            {
                "id": 7.817983813601413e+307,
                "name": "7Y!]lsLJAZ`szCJBe;^H16{zE<&vG[Sov/En5",
                "invoicingId": 1.3825187708189598e+308
            }
        ]
    }
}
```
## Try it
Try the [demo](http://responsemocker.herokuapp.com/) or point your requests to [http://responsemocker.herokuapp.com/api](http://responsemocker.herokuapp.com/api)

## TODO
* Allow multiple values for `add`in `date`-type fields.
