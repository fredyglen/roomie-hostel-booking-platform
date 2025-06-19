In a nutshell

Send money to your customers by using the Transfer API

You can transfer money in four easy steps:

    Create a transfer recipient
    Generate a transfer reference
    Initiate a transfer
    Listen for transfer status

Before you begin!

To send money on Paystack, you need API keys to authenticate your transfers. You can find your keys on the Paystack Dashboard under Settings → API Keys & Webhooks.
Create a transfer recipient

A transfer recipient is a beneficiary on your integration that you can send money to. Before sending money to your customer, you need to collect their details first, then use their details to create a transfer recipient. We support different recipients in different countries:
Type	Description	Currency
ghipss	This means Ghana Interbank Payment and Settlement Systems. It represents bank account in Ghana.	GHS
mobile_money	Mobile Money or MoMo is an account tied to a mobile number.	GHS/KES
kepss	This is the Kenya Electronic Payment and Settlement System. It represents bank accounts in Kenya.	KES
nuban	This means the Nigerian Uniform Bank Account Number. It represents bank accounts in Nigeria.	NGN
basa	This means the Banking Association South Africa. It represents bank accounts in South Africa.	ZAR
authorization	This is a unique code that represents a customer’s card. We return an authorization code after a user makes a payment with their card.	All

The recipient_code from the data object is the unique identifier for a user and would be used to make transfers to that customer This code should be saved with the customer's records in your database.
Generate a transfer reference

A transfer reference is a unique identifier that lets you track, manage and reconcile each transfer request made on your integration. Transfer references allow you to prevent double crediting as you can retry a non-conclusive transfer rather than initiate a new request.

In order to take advantage of a transfer reference, you need to generate and provide it for every request. When you don’t provide a transfer reference, Paystack generates one for you but this defeats the purpose of the transfer reference.

We recommend generating a v4 UUID reference of no more than 100 characters. However, if you prefer implementing your own logic, you should ensure your reference contains at least 16 alphanumeric characters.

{

	"source": "balance",

	"reason": "Savings",

	"amount": 30000,

	"reference": "your-unique-reference",

	"recipient": "RCP_1a25w1h3n0xctjg"

}

Initiate a transfer

To send money to a customer, you make a POST request to the Initate TransferAPI, passing the reference and recipient_code previously created.
Disabling OTP
![alt text](disabled_otp.png)

When building a fully automated system, you might need to disable OTP for transfers. You can disable OTP from the Preferences tab on the Paystack Dashoard. You should uncheck the Confirm transfers before sending checkbox as shown in the image below.
Image of the disabled OTP state of tranfers
Show Response

curl https://api.paystack.co/transfer

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ "source": "balance", 

      "amount": "37800",

      "reference": "your-unique-reference", 

      "recipient": "RCP_t0ya41mp35flk40", 

      "reason": "Holiday Flexing" 

    }'

-X POST


When you send this request, if there are no errors, the response comes back with a pending status, while the transfer is being processed.
Retrying a transfer

If there is an error with the transfer request, kindly retry the transaction with the same reference in order to avoid double crediting. If a new reference is used, the transfer would be treated as a new request.

Test transfers always return success, because there is no processing involved. The live transfers processing usually take between a few seconds and a few minutes. When it's done processing, a notification is sent to your webhook URL.
Verify a transfer

When a transfer is initiated, it could take a few seconds or minutes to be processed. This is why we recommend relying on webhooks for verification as opposed to polling.
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

        Transfer SuccessfulTransfer FailedTransfer Reversed

{

  "event": "transfer.failed",

  "data": {

    "amount": 200000,

    "currency": "NGN",

    "domain": "test",

    "failures": null,

    "id": 69123462,

    "integration": {

      "id": 100043,

      "is_live": true,

      "business_name": "Paystack"

    },

    "reason": "Enjoy",

    "reference": "1976435206",

    "source": "balance",

    "source_details": null,

    "status": "failed",

    "titan_code": null,

    "transfer_code": "TRF_chs98y5rykjb47w",

    "transferred_at": null,

    "recipient": {

      "active": true,

      "currency": "NGN",

      "description": null,

      "domain": "test",

      "email": "test@email.com",

      "id": 13584206,

      "integration": 100043,

      "metadata": null,

      "name": "Ted Lasso",

      "recipient_code": "RCP_cjcua8itre45gs",

      "type": "nuban",

      "is_deleted": false,

      "details": {

        "authorization_code": null,

        "account_number": "0123456789",

        "account_name": "Ted Lasso",

        "bank_code": "011",

        "bank_name": "First Bank of Nigeria"

      },

      "created_at": "2021-04-12T15:30:14.000Z",

      "updated_at": "2021-04-12T15:30:14.000Z"

    },

    "session": {

      "provider": "nip",

      "id": "74849400998877667"

    },

    "created_at": "2021-04-12T15:30:15.000Z",

    "updated_at": "2021-04-12T15:41:21.000Z"

  }

{

  "event": "transfer.reversed",

  "data": {

    "amount": 10000,

    "currency": "NGN",

    "domain": "live",

    "failures": null,

    "id": 20615868,

    "integration": {

      "id": 100073,

      "is_live": true,

      "business_name": "Night's Watch Inc"

    },

    "reason": "test balance ledger elastic changes",

    "reference": "jvrjckwenm",

    "source": "balance",

    "source_details": null,

    "status": "reversed",

    "titan_code": null,

    "transfer_code": "TRF_js075pj9u07f34l",

    "transferred_at": "2020-03-24T07:14:00.000Z",

    "recipient": {

      "active": true,

      "currency": "NGN",

      "description": null,

      "domain": "live",

      "email": "jon@sn.ow",

      "id": 1476759,

      "integration": 100073,

      "metadata": null,

      "name": "JON SNOW",

      "recipient_code": "RCP_hmcj8ciho490bvi",

      "type": "nuban",

      "is_deleted": false,

      "details": {

        "authorization_code": null,

        "account_number": "0000000000",

        "account_name": null,

        "bank_code": "011",

        "bank_name": "First Bank of Nigeria"

      },

      "created_at": "2019-04-10T08:39:10.000Z",

      "updated_at": "2019-11-27T20:43:57.000Z"

    },

    "session": {

      "provider": "nip",

      "id": "110006200324071331002061586801"

    },

    "created_at": "2020-03-24T07:13:31.000Z",

    "updated_at": "2020-03-24T07:14:55.000Z"

  }

}}


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
