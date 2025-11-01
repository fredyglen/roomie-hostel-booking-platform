Learn how to validate identification details for your customers
Availability

This is only required if you're using the Dedicated Virtual Accounts feature and your business falls under any of these categories - Betting, Financial services, and General Services.
Introduction

The customer validation endpoint is used to verify identification details provided by your customers. You can validate a customer by sending a POST request to the Validate CustomerAPI endpoint.
Bank Account Validation

Bank account validation requires that you provide the customer's BVN and a bank account connected to that BVN.
Hide Response

curl https://api.paystack.co/customer/{customer_code}/identification

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ 

	"country": "NG",

	"type": "bank_account",

	"account_number": "0123456789",

	"bvn": "200123456677",

	"bank_code": "007",

	"first_name": "Asta",

	"last_name": "Lavista"

}'

-X POST

{

  "status": true,

  "message": "Customer Identification in progress"

}

Testing

Customers can only be validated with live keys. However, for testing purposes during your integration, you can make make use of this credential with your test key:

    Test Credential

{

  "country": "NG",

  "type": "bank_account",

  "account_number": "0111111111",

  "bvn": "222222222221",

  "bank_code": "007",

  "first_name": "Uchenna",

  "last_name": "Okoro"

}

Listen for verification status

The verification of the details provided happens asynchronously, and we will send a customeridentification.success or customeridentification.failed event to your webhook URL when the verification is complete.
Prerequisite

You need a basic knowledge of webhooks before proceeding with this section.

    Customer Identification SuccessCustomer Identification Failed

{

  "event": "customeridentification.success",

  "data": {

    "customer_id": "9387490384",

    "customer_code": "CUS_xnxdt6s1zg1f4nx",

    "email": "bojack@horsinaround.com",

    "identification": {

      "country": "NG",

      "type": "bank_account",

      "bvn": "200*****677",

      "account_number": "012****789",

      "bank_code": "007"

    }

  }

}

{

  "event": "customeridentification.failed",

  "data": {

    "customer_id": 82796315,

    "customer_code": "CUS_XXXXXXXXXXXXXXX",

    "email": "email@email.com",

    "identification": {

      "country": "NG",

      "type": "bank_account",

      "bvn": "123*****456",

      "account_number": "012****345",

      "bank_code": "999991"

    },

    "reason": "Account number or BVN is incorrect"

  }

}

Reasons to validate a customer

    Local regulations require that customer information is validated before creating account numbers on their behalf.
    It allows us name the bank account using the name registered to the provided BVN.