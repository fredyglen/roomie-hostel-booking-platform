In a nutshell

You can repay your customer for a previous transaction in part or fully by initiating a refund and listening to notifications.
Getting started

Sometimes, a customer makes a request for their money after a successful transaction. Other times, an order cannot be fulfilled after payment has been made. In either case, you need to consider if you should initiate a:

    Partial refund or,
    Full refund

Our RefundAPI endpoints allow you to repay your customers in part or fully. You simply initiate a refund request and we keep you updated on the status of the refund.
Create a refund

To initiate a refund, you make a POST request to the Create RefundAPI and pass the transaction ID or reference in the transaction field. If an amount isn't passed, we handle the request as a full refund.

If you want to do a partial refund, you pass an amount parameter with the amount to refund. The refund amount must not be more than the original transaction amount.
Hide Response

curl https://api.paystack.co/refund

-H 'authorization: Bearer YOUR_SECRET_KEY'

-H 'cache-control: no-cache'

-H 'content-type: application/json'

-d '{ "transaction":"qufywna9w9a5d8v", "amount":"10000" }'

-X POST

{

  "status": true,

  "message": "Refund has been queued for processing",

  "data": {

    "transaction": {

      "id": 1004723697,

      "domain": "live",

      "reference": "T685312322670591",

      "amount": 10000,

      "paid_at": "2021-08-20T18:34:11.000Z",

      "channel": "apple_pay",

      "currency": "NGN",

      "authorization": {

        "exp_month": null,

        "exp_year": null,

        "account_name": null

      },

      "customer": {

        "international_format_phone": null

      },

      "plan": {},

      "subaccount": {

        "currency": null

      },

      "split": {},

      "order_id": null,

      "paidAt": "2021-08-20T18:34:11.000Z",

      "pos_transaction_data": null,

      "source": null,

      "fees_breakdown": null

    },

    "integration": 412829,

    "deducted_amount": 0,

    "channel": null,

    "merchant_note": "Refund for transaction T685312322670591 by test@me.com",

    "customer_note": "Refund for transaction T685312322670591",

    "status": "pending",

    "refunded_by": "test@me.com",

    "expected_at": "2021-12-16T09:21:17.016Z",

    "currency": "NGN",

    "domain": "live",

    "amount": 10000,

    "fully_deducted": false,

    "id": 3018284,

    "createdAt": "2021-12-07T09:21:17.122Z",

    "updatedAt": "2021-12-07T09:21:17.122Z"

  }

}

Maximum refund amount

The refund amount must not be more than the original transaction amount.
List Refunds

To pull a list of your refunds, you can use the List RefundsAPI to fetch all your refunds.
Hide Response

curl https://api.paystack.co/refund 

-H 'authorization: Bearer YOUR_SECRET_KEY'

-H 'cache-control: no-cache'

-H 'content-type: application/json' 

-X GET

{

  "status": true,

  "message": "Refunds retrieved",

  "data": [

    {

      "integration": 428626,

      "transaction": 627178582,

      "dispute": null,

      "settlement": null,

      "id": 747680,

      "domain": "test",

      "currency": "NGN",

      "amount": 10000,

      "status": "processed",

      "refunded_at": null,

      "refunded_by": "jen@smith.com",

      "customer_note": "Refund for transaction qufywna9w9a5d8v",

      "merchant_note": "Refund for transaction qufywna9w9a5d8v by jen@smith.com",

      "deducted_amount": 10000,

      "fully_deducted": true,

      "createdAt": "2020-05-19T11:12:17.000Z"

    },

    {

      "integration": 428626,

      "transaction": 640672957,

      "dispute": null,

      "settlement": null,

      "id": 742609,

      "domain": "test",

      "currency": "NGN",

      "amount": 20000,

      "status": "processed",

      "refunded_at": null,

      "refunded_by": "jen@smith.com",

      "customer_note": "blah blah",

      "merchant_note": "yada yada",

      "deducted_amount": 20000,

      "fully_deducted": true,

      "createdAt": "2020-04-30T10:43:47.000Z"

    }

  ],

  "meta": {

    "total": 2,

    "skipped": 0,

    "perPage": 50,

    "page": 1,

    "pageCount": 1

  }

}

Refund status

During the lifecycle of a refund, its status changes based on the actions performed by the refund processor. When the status of a refund changes, the status of the associated transaction follows suit.

The table below shows the relationship between the status of a refund and its associated transaction:
Status	Description	Transaction Status
pending	Refund initiated, waiting for response from the processor	Reversal Pending
processing	Refund has been received by the processor.	Reversal Pending
failed	

Refund cannot be processed. Your account is credited with refund amount.
	Success
processed	Refund has successfully been processed by the processor.	Reversed
Processed Refunds

When a refund is marked as processed, it may still take up to 10 business days for customers to receive their funds.
Listen to notifications
Receiving Notifications

In order to receive notifications, you need to implement a webhook URL and set the webhook URL in your Paystack dashboard.

We send different events based on the state of a refund. You can listen to the following events to stay updated on the state of a customer's refund:
Event	Description
refund.pending	This is sent when a refund is initiated and we are waiting for a response from the processor.
refund.processing	This is sent when the refund has been received by the processor.
refund.failed	This is sent when a refund cannot be processed. Your account is credited with the refund amount.
refund.processed	This is sent when the refund has been successfully processed by the processor.

    Refund PendingRefund ProcessingRefund ProcessedRefund Failed

{

  "event": "refund.pending",

  "data": {

    "status": "pending",

    "transaction_reference": "tvunjbbd_412829_4b18075d_c7had",

    "refund_reference": null,

    "amount": "10000",

    "currency": "NGN",

    "processor": "instant-transfer",

    "customer": {

      "first_name": "Drew",

      "last_name": "Berry",

      "email": "demo@email.com"

    },

    "integration": 412829,

    "domain": "live"

  }

  {

  "event": "refund.processing",

  "data": {

    "status": "processing",

    "transaction_reference": "tvunjbbd_412829_4b18075d_c7had",

    "refund_reference": null,

    "amount": "10000",

    "currency": "NGN",

    "processor": "instant-transfer",

    "customer": {

      "first_name": "Drew",

      "last_name": "Berry",

      "email": "demo@email.com"

    },

    "integration": 412829,

    "domain": "live"

  }

}

{

  "event": "refund.processed",

  "data": {

    "status": "processed",

    "transaction_reference": "T2154954_412829_3be32076_6lcg3",

    "refund_reference": "132013318360",

    "amount": "5000",

    "currency": "NGN",

    "processor": "mpgs_zen",

    "customer": {

      "first_name": "Damilola",

      "last_name": "Kwabena",

      "email": "damilola@email.com"

    },

    "integration": 412829,

    "domain": "live"

  }

}

{

  "event": "refund.failed",

  "data": {

    "status": "failed",

    "transaction_reference": "T9171231_412325_3be2736c_n6tml",

    "refund_reference": "TRF_9vgfawjnoz58uxy",

    "amount": 20000,

    "currency": "NGN",

    "processor": "instant-transfer",

    "customer": {

      "first_name": "Tobi",

      "last_name": "Digz",

      "email": "tobi@mail.com"

    },

    "integration": 412325,

    "domain": "live"

  }

}