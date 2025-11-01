The Disputes API allows you manage transaction disputes on your integration.
List Disputes

List disputes filed against you
Headers
authorization
String
	Set value to Bearer SECRET_KEY
Query Parameters
from
Date
	A timestamp from which to start listing dispute e.g. 2016-09-21
to
Date
	A timestamp at which to stop listing dispute e.g. 2016-09-21
perPage
Integer
	
Specify how many records you want to retrieve per page. If not specify we use a default value of 50.
page
Integer
	
Specify exactly what dispute you want to page. If not specify we use a default value of 1.
transaction
String
	
Transaction Id
status
String
	
Dispute Status. Acceptable values: { awaiting-merchant-feedback | awaiting-bank-feedback | pending | resolved }
Show optional parameters
GET/dispute
cURL

#!/bin/sh

url="https://api.paystack.co/dispute"

authorization="Authorization: Bearer YOUR_SECRET_KEY"


curl "$url" -H "$authorization" -X GET

Sample Response
200 Ok

{

  "status": true,

  "message": "Disputes retrieved",

  "data": [

    {

      "id": 2867,

      "refund_amount": null,

      "currency": null,

      "status": "archived",

      "resolution": null,

      "domain": "test",

      "transaction": {

        "id": 5991760,

        "domain": "test",

        "status": "success",

        "reference": "asjck8gf76zd1dr",

        "amount": 39100,

        "message": null,

        "gateway_response": "Successful",

        "paid_at": "2017-11-09T00:01:56.000Z",

        "created_at": "2017-11-09T00:01:36.000Z",

        "channel": "card",

        "currency": "NGN",

        "ip_address": null,

        "metadata": "",

        "log": null,

        "fees": 587,

        "fees_split": null,

        "authorization": {},

        "customer": null,

        "plan": {},

        "subaccount": {},

        "split": {},

        "order_id": null,

        "paidAt": "2017-11-09T00:01:56.000Z",

        "createdAt": "2017-11-09T00:01:36.000Z",

        "pos_transaction_data": null

      },

      "transaction_reference": null,

      "category": null,

      "customer": {

        "id": 10207,

        "first_name": null,

        "last_name": null,

        "email": "shola@baddest.com",

        "customer_code": "CUS_unz4q52yjsd6064",

        "phone": null,

        "metadata": null,

        "risk_action": "default",

        "international_format_phone": null

      },

      "bin": null,

      "last4": null,

      "dueAt": null,

      "resolvedAt": null,

      "evidence": null,

      "attachments": "[]",

      "note": null,

      "history": [

        {

          "status": "pending",

          "by": "demo@test.co",

          "createdAt": "2017-11-16T16:12:24.000Z"

        }

      ],

      "messages": [

        {

          "sender": "demo@test.co",

          "body": "test this",

          "createdAt": "2017-11-16T16:12:24.000Z"

        }

      ],

      "createdAt": "2017-11-16T16:12:24.000Z",

      "updatedAt": "2019-08-16T08:05:25.000Z"

    }

  ],

  "meta": {

    "total": 1,

    "skipped": 0,

    "perPage": 50,

    "page": 1,

    "pageCount": 1

  }

}

Fetch Dispute

Get more details about a dispute.
Headers
authorization
String
	Set value to Bearer SECRET_KEY
Path Parameters
id
String
	The dispute ID you want to fetch