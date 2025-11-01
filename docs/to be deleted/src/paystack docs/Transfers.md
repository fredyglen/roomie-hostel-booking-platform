Learn how to send money with Paystack.
Getting started
How Transfers Work

Understand the stages a transfer goes through from initiation to completion
Transfer Recipients

Create reusable beneficiaries that you intend to send money to
Single Transfers

Send money to bank accounts and mobile money accounts
Bulk Transfers

Pay multiple recipients at once with Paystack bulk transfer feature

How Transfers Work
In a nutshell

A transfer goes through a sequence of processes from initiation to completion.
Image of a transfer lifecycle

When a transfer request is initiated, it goes through a sequence of processes:

    Request validation
    Transfer creation
    Approval checks
    Queue transfer
    Await processor

Each process determines the status of a transfer at a particular time. When a transfer has been created, its status can be gotten from the data.status parameter. The meaning of each status is described in the table below:
Status	Meaning	Conclusive?
pending	Transfer is being processed.	No
success	Transfer has been successfully processed. A successfully processed transfer doesn’t equate to instant credit to the customer.	Yes
reversed	Transfer couldn’t be processed. Typically, this means the customer’s bank is unable to receive money at that moment. The transfer amount is returned. Merchant can retry the transfer later.	Yes
failed	Transfer could not be processed. This typically happens when the processor is down. You can retry again.	Yes
otp	The transfer requires an addition approval step before processing can continue. OTP is sent to email and/or phone number.	No
abandoned	This happens when OTP is not provided within 30 mins. Transfer won’t be processed afterwards.	Yes
blocked	This happens when the merchant’s server fails to perform either an approval or rejection on the transfer request.	Yes
rejected	This happens when the merchant’s server declines a transfer request.	Yes
received	A transfer has this status when it requires approval from the merchants server and the approval request has been sent.	No

A conclusive status is one in which no further action can be performed on. When a transfer has a conclusive status, it means we are done processing such a request.
Avoiding double credit

Before retrying a transfer, ensure you’ve gotten a conclusive status. If you’ve not gotten a conclusive status for a particular transfer and need to retry, you should use the same transfer reference.
Request validation

At this point, we run a series of checks on your integration to ensure you are able to make a transfer. The checks include:

    Business type: We check if your business is a starter business or a registered business. Only registered businesses are allowed to use the transfer feature. Starter businesses can be upgraded to a registered business to use the transfer feature.
    Payout on hold: An integration payout might be on hold for different reasons. Transfer cannot be processed when payout is on hold.
    Invalid amount: An amount is invalid if it’s below the minimum transfer amount or above the maximum transfer amount. You should confirm the allowable transfer amount before making a transfer request.
    Recipient validity: This check is to ensure the recipient code and details are valid.
    Balance sufficiency: Before a transfer can be performed, we check if you have the transfer amount plus the transfer fee in your Paystack balance.

If any of the validation checks fails, we return an error message with the cause of the error.
Transfer not found

If you call the Verify Transfer endpoint at this stage, you’ll get an error because the transfer hasn’t been created. This is why you should rely on webhooks for updates.
Transfer creation

On a successful request validation, we need to create a DB entry for the request. To create an entry, we require a transfer reference which is going to be used to keep a track of the transfer lifecycle. If a transfer reference isn’t provided, we go ahead to create one. Else, we use the transfer reference you provided. The transfer is then added to the DB and it’s status set to pending.

At this stage, we also deduct the transfer amount and the transfer fee.
Generate your transfer reference

Always generate a transfer reference in order to track, manage and reconcile each transfer. Check out how to Generate a transfer reference section to learn more.
Approval checks

There are two types of approval that can be used to secure a transfer request:

    OTP: This is a code we send to the merchant’s email and/or phone to confirm that the request was initiated by the merchant.
    URL: OTP approval requires manual intervention which could be tedious for certain use cases. With URL approval, a merchant creates a verification endpoint that is used to confirm the authenticity of the transfer. For each transfer request, we send an approval request to the merchant’s server to confirm further processing.

As an extra level of security, a merchant might have turned on either or both approval steps. We do a check to confirm is OTP is required or not. If OTP is required, we send an OTP to the merchant’s email and/or phone and set the transfer status to OTP. If the OTP isn’t received or used within 30 minutes, we mark the transfer as abandoned. If the merchant puts in the wrong the OTP, we mark the transfer as failed.

After the OTP process, we check for the URL approval. When we send an approval request to the merchant’s approval URL, we set the transfer status to received while we await a response. The merchant’s server needs to respond with either a 200 or a 400:
Response code	Meaning	Status
200	Transfer approved	pending
400	Transfer rejected	rejected

If the merchant server doesn’t respond within a few seconds, we mark the transfer as blocked and stop further processing.
Queue transfer

Transfers are added to a queue for multiple reasons. The two primary reasons include:

    Conforming to the processor’s requirements
    Resilience

Transfers in the queue are removed in batches and sent to the processor. If we are unable to get a definite response (success, failed, reversed) from the processor, we add the transfer back to the queue. We keep trying until we reach our retry limit. At this point, we mark the transfer as failed. We send a transfer.failed event via your webhook URL.
Await processor

The processor is in charge of pushing the transfer to your customers. They make the request to the customer’s bank to credit the customer’s account. If the processor is able to credit the customer’s account, a successful response is sent back. This is propagated back to your integration via the transfer.success event. If we are unable to get conclusive feedback from the processor, we keep retrying till we hit our retry limit. At this point, we mark the transfer as failed and send the transfer.failed event.

Sometimes, the processor might send a reversal notice due to their inability to credit the customer’s account. When we get this notice, we send a transfer.reversed event and credit your Paystack balance back.
Troubleshooting

When building or maintaining your transfer integration, you should keep the following integration checklist in mind:

    Ensure you have enough funds in your Paystack balance to carry out the request(s)
    Ensure you are sending amount in the smallest denomination of your currency
    Ensure you have generated a transfer reference
    Implement a webhook URL to receive updates
    Ensure the recipient details are valid
    Ensure there are no long running tasks in your approval URL

Despite checking all items in the checklist, things might still not work as they should. If you encounter any issue with your integration, the first step is to check the status of the transfer.

Typically, issues occur during the validation phase or when there a multiple occurrences of an unsuccessful status. Validation errors come with descriptive messages and solutions are easy to fix. Here are some errors and solutions to them:
Error	Resolution
Your reference contains illegal special characters	Ensure that the reference contains lowercase alphanumeric characters and the only special characters are hyphen ("-") and underscore ( "_")
Your balance is not enough to fulfil this request	Top up your Paystack Balance and try again
Sorry, we can't make the transfer to this recipient at the moment	The customer should reach out to the bank to resolve the issues with their account
Account closed	The customer should reach out to the bank if they did not close the account
Bank code is invalid	Ensure that you're passing the correct bank code. Use the list bankAPI Endpoint to get the list of all available banks and their corresponding bank codes

A transfer request could also be stuck in an unsuccessful status. Here’s how to handle unsuccessful status:

    pending: A transfer might remain in this state for a long time if there is an issue communicating with the recipient's bank. This is one of the reasons why we use queues. We keep retrying through different channels till we've exhausted all options and the transfer fails. You can also check our status page to confirm that there’s no incident.
    blocked: This happens when your server fails to respond to approval request within a few seconds. If multiple transfers keeps returning this status. You should check your approval logic to ensure that there are no long running task.
    abandoned: A high rate of abandoned transfer means there’s an OTP issue. OTP is either not being delivered or you are not using the OTP within 30 minutes. If you are going to use OTP for approval, we recommend turning on both email and phone channels. This is to increase the chances of OTP delivery.


![alt text](transfer-lifecycle-1.png)


Creating Transfer Recipients
In a nutshell

To send money from your integration, you need to collect the customer’s details to create a beneficiary.

A transfer recipient is a beneficiary created on your integration in order to allow you send money. Before sending money from your integration, you need to collect the customer’s details and use their details to create a transfer recipient.

We support the following recipient types:
Type	Description	Currency
ghipss	This means Ghana Interbank Payment and Settlement Systems. It represents bank account in Ghana.	GHS
mobile_money	Mobile Money or MoMo is an account tied to a mobile number.	GHS/KES
kepss	This is the Kenya Electronic Payment and Settlement System. It represents bank accounts in Kenya.	KES
nuban	This means the Nigerian Uniform Bank Account Number. It represents bank accounts in Nigeria.	NGN
basa	This means the Banking Association South Africa. It represents bank accounts in South Africa.	ZAR
authorization	This is a unique code that represents a customer’s card. We return an authorization code after a user makes a payment with their card.	All

To create the transfer recipient, make a POST request to the transfer recipientAPI passing one of the following customer’s detail:

    Bank account
    Mobile money
    Authorization code

Bank account

When creating a transfer recipient with a bank account, you need to collect the customer’s bank details. Typically, the account number and associated bank should suffice, but some countries require more details particularly for account verification. You should design your user interface to allow the collection of the necessary details in the country of operation.
List banks

When creating your user interface (UI) to collect the user’s bank details, you’ll need to populate the UI with a list of banks. We provide a list bankAPI endpoint that you can use to populate your UI with available banks in your country.

To fetch a list of banks in a country, make a GET request passing the currency in the query parameter:
Hide Response

curl https://api.paystack.co/bank?currency=NGN

-H "Authorization: Bearer YOUR_SECRET_KEY"

-X GET

{

  "status": true,

  "message": "Banks retrieved",

  "data": [

    {

      "name": "Abbey Mortgage Bank",

      "slug": "abbey-mortgage-bank",

      "code": "801",

      "longcode": "",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "is_deleted": false,

      "country": "Nigeria",

      "currency": "NGN",

      "type": "nuban",

      "id": 174,

      "createdAt": "2020-12-07T16:19:09.000Z",

      "updatedAt": "2020-12-07T16:19:19.000Z"

    }

  ]

}

Ghanaian bank transfer support

At the moment, transfers cannot be made to the Bank of Ghana. We recommend that you exclude it from the list of banks as we work on supporting transfers to it.
Verify the account number

You need to collect the destination account number and confirm that it’s valid. This is to ensure you don’t send money to the wrong or invalid account.

As stated earlier, account verification requires different details in different countries. You can follow the process for account verification for the country of operation in the table below:
Currency	Verification
NGN/GHS	Resolve Account Number
ZAR	Validate Account
Create recipient

With the verification completed, you can pass the customer’s bank details and the recipient type to the Create Transfer recipientAPI endpoint:
Hide Response

curl https://api.paystack.co/transferrecipient

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ "type": "nuban", 

      "name": "John Doe", 

      "account_number": "0001234567", 

      "bank_code": "058", 

      "currency": "NGN"

    }'

-X POST

{

  "status": true,

  "message": "Transfer recipient created successfully",

  "data": {

    "active": true,

    "createdAt": "2020-05-13T13:59:07.741Z",

    "currency": "NGN",

    "domain": "test",

    "id": 6788170,

    "integration": 428626,

    "name": "John Doe",

    "recipient_code": "RCP_t0ya41mp35flk40",

    "type": "nuban",

    "updatedAt": "2020-05-13T13:59:07.741Z",

    "is_deleted": false,

    "details": {

      "authorization_code": null,

      "account_number": "0001234567",

      "account_name": null,

      "bank_code": "058",

      "bank_name": "Guaranty Trust Bank"

    }

  }

}

Mobile money
Feature availability

This feature is currently available to businesses in Ghana and Kenya.

Mobile money allows a merchant send money to a customer’s mobile number. To start with, you need to collect the customer’s phone number and telco. To fetch a list of supported telcos for mobile money, you can add currency (either KES or GHS) and type in the query parameters for the list bankAPI endpoint:
Hide Response

curl https://api.paystack.co/bank?currency=GHS&type=mobile_money

-H "Authorization: Bearer YOUR_SECRET_KEY"

-X GET


{

  "status": true,

  "message": "Banks retrieved",

  "data": [

    {

      "name": "AirtelTigo",

      "slug": "atl-mobile-money",

      "code": "ATL",

      "longcode": "",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "is_deleted": null,

      "country": "Ghana",

      "currency": "GHS",

      "type": "mobile_money",

      "id": 29,

      "createdAt": "2018-03-29T12:54:59.000Z",

      "updatedAt": "2020-01-24T10:01:06.000Z"

    },

    {

      "name": "MTN",

      "slug": "mtn-mobile-money",

      "code": "MTN",

      "longcode": "",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "is_deleted": null,

      "country": "Ghana",

      "currency": "GHS",

      "type": "mobile_money",

      "id": 28,

      "createdAt": "2018-03-29T12:54:59.000Z",

      "updatedAt": "2019-10-22T11:04:46.000Z"

    },

    {

      "name": "Vodafone",

      "slug": "vod-mobile-money",

      "code": "VOD",

      "longcode": "",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "is_deleted": null,

      "country": "Ghana",

      "currency": "GHS",

      "type": "mobile_money",

      "id": 66,

      "createdAt": "2018-03-29T12:54:59.000Z",

      "updatedAt": "2019-10-22T11:05:08.000Z"

    }

  ]

}

With the customer’s mobile number, you can then create a recipient by using the telco code as the bank_code and the mobile number as the account_number:
Hide Response

curl https://api.paystack.co/transferrecipient

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ "type": "mobile_money", 

      "name": "Abina Nana", 

      "account_number": "0551234987", 

      "bank_code": "MTN", 

      "currency": "GHS"

    }'

-X POST

{

  "status": true,

  "message": "Transfer recipient created successfully",

  "data": {

    "active": true,

    "createdAt": "2022-02-21T12:57:02.156Z",

    "currency": "GHS",

    "domain": "test",

    "id": 25753454,

    "integration": 519035,

    "name": "Abina Nana",

    "recipient_code": "RCP_u2tnoyjjvh95pzm",

    "type": "mobile_money",

    "updatedAt": "2022-02-21T12:57:02.156Z",

    "is_deleted": false,

    "isDeleted": false,

    "details": {

      "authorization_code": null,

      "account_number": "0551234987",

      "account_name": null,

      "bank_code": "MTN",

      "bank_name": "MTN"

    }

  }

}

Kenyan businesses have several mobile money options for the bank_code:

    MPESA for individual Mpesa users
    MPPAYBILL for Paybill numbers and requires additional information during disbursement
    MPTILL for business Till numbers

The recipient type for Paybill and Till numbers is mobile_money_business.
Hide Response

#!/bin/sh

curl https://api.paystack.co/transferrecipient

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ "type": "mobile_money_business",

      "name": "Till Transfer",

      "bank_code": "MPTILL",

      "account_number": "247247",

      "currency": "KES"

    }'

-X POST

{

  "status": true,

  "message": "Transfer recipient created successfully",

  "data": {

    "active": true,

    "createdAt": "2024-11-28T09:28:50.000Z",

    "currency": "KES",

    "description": null,

    "domain": "test",

    "email": null,

    "id": 92176030,

    "integration": 845995,

    "metadata": null,

    "name": "Till Transfer Example",

    "recipient_code": "RCP_5vl8b2yma7xdnjp",

    "type": "mobile_money_business",

    "updatedAt": "2024-11-28T09:28:50.000Z",

    "is_deleted": false,

    "isDeleted": false,

    "details": {

      "authorization_code": null,

      "account_number": "247247",

      "account_name": null,

      "bank_code": "MPTILL",

      "bank_name": "M-PESA Till"

    }

  }

}

Authorization code

An authorization code is returned after a successful card payment by a customer. Combining the authorization code with the email address used for payment, you can create a transfer recipient:
Hide Response

curl https://api.paystack.co/transferrecipient

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ "type": "authorization", 

      "name": "Revs Ore", 

      "email": "revs@ore.com", 

      "authorization_code": "AUTH_ncx8hews93"

    }'

-X POST

{

  "status": true,

  "message": "Transfer recipient created successfully",

  "data": {

    "active": true,

    "createdAt": "2022-02-21T11:35:59.302Z",

    "currency": "NGN",

    "domain": "test",

    "email": "revs@ore.com",

    "id": 25747878,

    "integration": 463433,

    "name": "Revs Ore",

    "recipient_code": "RCP_wql6bj95bll7m6h",

    "type": "authorization",

    "updatedAt": "2022-02-21T11:35:59.302Z",

    "is_deleted": false,

    "isDeleted": false,

    "details": {

      "authorization_code": "AUTH_ncx8hews93",

      "account_number": null,

      "account_name": null,

      "bank_code": "057",

      "bank_name": "Zenith Bank"

    }

  }

}

Account Number Association

If an account number isn’t associated with the authorization code, we return a response with a message: Account details not found for this authorization. If you get this error, kindly request the customer’s account details and follow the process to create a transfer recipient using a bank account.
Save the recipient code

The recipient_code in the data object of the response is the unique identifier for the customer and would be used to make transfers to the specified account. This code should be saved with the customer’s records in your database.

{

	"status": true,

	"message": "Transfer recipient created successfully",

	"data": {

		"active": true,

		"createdAt": "2022-02-21T11:35:59.302Z",

		"currency": "NGN",

		"domain": "test",

		"email": "revs@ore.com",

		"id": 25747878,

		"integration": 463433,

		"name": "Revs Ore",

		"recipient_code": "RCP_wql6bj95bll7m6h",

		"type": "authorization",

		"updatedAt": "2022-02-21T11:35:59.302Z",

		"is_deleted": false,

		"isDeleted": false,

		"details": {

			"authorization_code": "AUTH_ncx8hews93",

			"account_number": null,

			"account_name": null,

			"bank_code": "057",

			"bank_name": "Zenith Bank"

		}

	}

}