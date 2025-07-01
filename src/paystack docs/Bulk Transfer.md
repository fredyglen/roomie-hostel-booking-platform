Bulk Transfers
In a nutshell

Send money to multiple recipients at once with Paystack bulk transfer API

Some business models require sending money to multiple customers at the same time. For example, a payroll management system requires sending salaries to all employees at a certain time of the month. Large disbursements such as this requires careful orchestration in order to ensure that all customers get paid and your system doesn’t get overwhelmed.

The Bulk TransferAPI endpoint handles large disbursement orchestration, helping businesses focus on delivering value to their customers.
Before you begin!

To send money on Paystack, you need API keys to authenticate your transfers. You can find your keys on the Paystack Dashboard under Settings → API Keys & Webhooks.
Creating recipients

A transfer recipient is a beneficiary on your integration that you can send money to. Before sending money to your customers, you need to collect their details first, then use their details to create a transfer recipient. We support different recipients in different countries:
Type	Description	Currency
ghipss	This means Ghana Interbank Payment and Settlement Systems. It represents bank account in Ghana.	GHS
mobile_money	Mobile Money or MoMo is an account tied to a mobile number.	GHS/KES
kepss	This is the Kenya Electronic Payment and Settlement System. It represents bank accounts in Kenya.	KES
nuban	This means the Nigerian Uniform Bank Account Number. It represents bank accounts in Nigeria.	NGN
basa	This means the Banking Association South Africa. It represents bank accounts in South Africa.	ZAR
authorization	This is a unique code that represents a customer’s card. We return an authorization code after a user makes a payment with their card.	All

Once created, save the recipient_code to your DB and make it available for the transfer initiation. This is a one time process in the transfer lifecycle. Since you’d be sending money to multiple recipients at interval, you’d only be fetching the recipients from your DB for each transfer request.
Managing batches

Before creating the transfer request, you need to break the requests into batches. A batch is a subset of your requests that makes it easier to manage and track your transfers. In code, a batch is an array of transfer objects:

{

  "transfers": [

    {

      "amount": 20000,

      "reference": "4b36bee6-2d1d-41b6-ab1e-6465c04e6765",

      "reason": "Why not?",

      "recipient": "RCP_2tn9clt23s7qr28"

    },

    {

      "amount": 30000,

      "reference": "79c79c1f-a4fb-446f-a9b6-e743a6bdd61d",

      "reason": "Because I can",

      "recipient": "RCP_1a25w1h3n0xctjg"

    },

    {

      "amount": 40000,

      "reference": "d5d2203b-40db-418f-845e-78786f291c38",

      "reason": "Coming right up",

      "recipient": "RCP_aps2aibr69caua7"

    }

  ]

}

Generate transfer reference

You should always generate a unique transfer reference for each transfer object. The transfer reference will help you keep track and manage each transfer. You can check out the generating a transfer reference section to learn more.

Each object in the transfers array is the same parameters for a single request. A batch should not contain more than 100 items and each batch should be sent every 5 seconds:
Parameter	Config
Batch size	<= 100
Duration	Every 5 seconds

Merchants who have set up transfer approval via URL should ensure they can approve all transfers in each batch within a few seconds (ideally, microseconds), else they risk the possibility of ending up with transfers with blocked status. So while planning the batch size, you should factor in the time it takes to verify the authenticity of each transfer.

The duration is to avoid getting rate limited. Sending multiple requests at short intervals would lead to a 429 (Too many requests) error.

With your batch properly planned and implemented, you can now initiate the bulk transfer.
Initiate bulk transfer
Disable OTP

If you’ve enabled OTP for transfer approval, you need to disable it to use this endpoint.

In addition to the array of transfers in your batch, you need to add the currency and source to make a request to the Bulk TransferAPI endpoint:
Show Response

#!/bin/sh

url="https://api.paystack.co/transfer/bulk"

authorization="Authorization: Bearer YOUR_SECRET_KEY"

content_type="Content-Type: application/json"

data='{

  "currency": "NGN",

  "source": "balance",

  "transfers": [

    {

      "amount": 20000,

      "reference": "588YtfftReF355894J",

      "reason": "Why not?",

      "recipient": "RCP_2tn9clt23s7qr28"

    },

    {

      "amount": 30000,

      "reference": "YunoTReF35e0r4J",

      "reason": "Because I can",

      "recipient": "RCP_1a25w1h3n0xctjg"

    },

    {

      "amount": 40000,

      "reason": "Coming right up",

      "recipient": "RCP_aps2aibr69caua7"

    }

  ]

}'


curl "$url" -H "$authorization" -H "$content_type" -d "$data" -X POST

Unlike single transfers, the data parameter in the response object returns an array of objects. Each object represent a transfer in your batch. It’s important to note that the transfer status works like the single transfer. You can take a look at the transfer lifecycle if you need a refresher on how a transfer status is updated.

Test transfers always return success, because there is no processing involved. Live transfers are queued while they are being processed so you need to set up a webhook URL to receive the updates on your request.
Heads up!

While you might have sent your transfers in batches, notifications are sent for each transfer in a batch. So if you have 100 transfers in a batch, you’ll receive 100 events (one per transfer) for that batch.
Verify a transfer

The update on a transfer isn’t always instant because of the queuing and processing time, so you need to set up a webhook URL where we’ll POST updates to when processing is completed.
Receiving Notifications

In order to receive notifications, you need to implement a webhook URL and set the webhook URL on your Paystack Dashboard.

Once a transfer is processed, we send the final status of the transfer as a POST request to your webhook URL.
Event	Description
transfer.success	This is sent when the transfer is successful
transfer.failed	This is sent when the transfer fails
transfer.reversed	This is sent when we refund a previously debited amount for a transfer that couldn’t be completed

    Transfer SuccessfulTransfer FailedTransfer Reversed

{

  "event": "transfer.success",

  "data": {

    "amount": 30000,

    "currency": "NGN",

    "domain": "test",

    "failures": null,

    "id": 37272792,

    "integration": {

      "id": 463433,

      "is_live": true,

      "business_name": "Boom Boom Industries NG"

    },

    "reason": "Have fun...",

    "reference": "1jhbs3ozmen0k7y5efmw",

    "source": "balance",

    "source_details": null,

    "status": "success",

    "titan_code": null,

    "transfer_code": "TRF_wpl1dem4967avzm",

    "transferred_at": null,

    "recipient": {

      "active": true,

      "currency": "NGN",

      "description": "",

      "domain": "test",

      "email": null,

      "id": 8690817,

      "integration": 463433,

      "metadata": null,

      "name": "Jack Sparrow",

      "recipient_code": "RCP_a8wkxiychzdzfgs",

      "type": "nuban",

      "is_deleted": false,

      "details": {

        "account_number": "0000000000",

        "account_name": null,

        "bank_code": "011",

        "bank_name": "First Bank of Nigeria"

      },

      "created_at": "2020-09-03T12:11:25.000Z",

      "updated_at": "2020-09-03T12:11:25.000Z"

    },

    "session": {

      "provider": null,

      "id": null

    },

    "created_at": "2020-10-26T12:28:57.000Z",

    "updated_at": "2020-10-26T12:28:57.000Z"

  }

}

The response for a transfer also contains a unique transfer code to identify this transfer. You can use this code to call the Fetch TransferAPI endpoint to get the status and details of the transfer.