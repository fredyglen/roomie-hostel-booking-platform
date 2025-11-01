Learn how to use Paystack to verify your customer's identity.
Verify Account Number

Validate the authenticity of a customer's account number before sending money
Resolve Card BIN

Get more info about a debit or credit card using its first 6-digits
Validate Customer

Confirm the identity of your customer before assigning an account

Verify Account Number
In a nutshell

The account validation APIs allow merchants to confirm the authenticity of a customer’s account number before sending money to the customer.
Introduction

Before sending money to a customer, you need to ensure the customer’s account details are correct. This is to ensure you aren’t sending money to the wrong person. In order to achieve this, we provide the following APIs:
Name	Availability	Description
Resolve Account Number	Nigeria, Ghana	Used for the confirmation of personal bank accounts
Account Validation	South Africa	Used for the validation of personal and business bank accounts

Account number verification allows you to:

    Confirm a customer’s bank details before creating a transfer recipient
    Automate your KYC process

Resolve Account Number
Gentle reminder

This feature is available to business in Nigeria and Ghana.

The Resolve Account NumberAPI takes the customer’s account number and bank code and returns the account details of the customer. To resolve an account number, make a GET request to the /bank/resolve endpoint:
Hide Response

curl https://api.paystack.co/bank/resolve?account_number=0001234567&bank_code=058

-H "Authorization: Bearer YOUR_SECRET_KEY"

-X GET

{

  "status": true,

  "message": "Account number resolved",

  "data": {

    "account_number": "0001234567",

    "account_name": "Doe Jane Loren",

    "bank_id": 9

  }

}

Pricing

This endpoint is free for use.
Account Validation
Gentle Reminder

This feature is only available to businesses in South Africa.

The Validate AccountAPI allows merchant validate both personal and business accounts. It checks if the provided customer’s details are correct and returns the status of the check. However, not all banks support account verification, so you need to confirm if the customer's bank supports it.
Fetch supported banks

To confirm the banks that supports account validation, make a request to the List BankAPI endpoint, passing the enabled_for_verification query parameter:
Hide Response

curl https://api.paystack.co/bank?currency=ZAR&enabled_for_verification=true

-H "Authorization: Bearer YOUR_SECRET_KEY"

-X GET

{

  "status": true,

  "message": "Banks retrieved",

  "data": [

    {

      "id": 140,

      "name": "Absa Bank Limited, South Africa",

      "slug": "absa-za",

      "code": "632005",

      "longcode": "632005",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 141,

      "name": "African Bank Limited",

      "slug": "african-bank-za",

      "code": "430000",

      "longcode": "430000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 146,

      "name": "Capitec Bank Limited",

      "slug": "capitec-bank-za",

      "code": "470010",

      "longcode": "470010",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "personal"

      ]

    },

    {

      "id": 147,

      "name": "Discovery Bank Limited",

      "slug": "discovery-bank-za",

      "code": "679000",

      "longcode": "679000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 151,

      "name": "First National Bank",

      "slug": "first-national-bank-za",

      "code": "250655",

      "longcode": "250655",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 152,

      "name": "Grindrod Bank",

      "slug": "grindrod-bank-za",

      "code": "584000",

      "longcode": "584000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 153,

      "name": "Investec Bank Ltd",

      "slug": "investec-bank-za",

      "code": "580105",

      "longcode": "580105",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 157,

      "name": "Nedbank",

      "slug": "nedbank-za",

      "code": "198765",

      "longcode": "198765",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 161,

      "name": "SASFIN Bank",

      "slug": "sasfin-bank-za",

      "code": "683000",

      "longcode": "683000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 163,

      "name": "Standard Bank South Africa",

      "slug": "standard-bank-za",

      "code": "051001",

      "longcode": "051001",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 165,

      "name": "TymeBank",

      "slug": "tymebank-za",

      "code": "678910",

      "longcode": "678910",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    }

  ]

}

The data object in the response contains the banks that support account validation. The supported_types in each bank object contains an array of the account type that can be validated. Some banks only support personal accounts while others support both personal and business accounts. If the customer's bank is returned in this response, then you can go ahead with account validation, else, the account validation can be skipped.
Validate account

To validate an account, make a POST request to the /bank/validate endpoint:
Hide Response

curl https://api.paystack.co/bank/validate

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ 

      "bank_code": "632005",

      "country_code": "ZA",

      "account_number": "0123456789",

      "account_name": "Ann Bron",

      "account_type": "personal",

      "document_type": "identityNumber",

      "document_number": "1234567890123"

    }'

-X POST

{

  "status": true,

  "message": "Personal Account Verification attempted",

  "data": {

    "verified": true,

    "verificationMessage": "Account is verified successfully"

  }

}

The /bank/validate endpoint can be used for both personal and business account validation by using the following request parameters:
Name	Type	Description
account_name	String	Customer's first and last name registered with their bank
account_number	String	Customer’s account number
account_type	String	This can take one of: [personal, business]
bank_code	String	The bank code of the customer’s bank. You can fetch the bank codes by using our List BankAPI.
country_code	String	The two digit ISO code of the customer’s bank
document_type	String	Customer’s mode of identity. This could be one of: [identityNumber, passportNumber, businessRegistrationNumber]
document_number	String	Customer’s mode of identity number

When validating a personal account number, the customer can either provide their passport or identity number. You can specify the mode of identity by passing either identityNumber or passportNumber as the document_type parameter.

For business account validation the document_type should be businessRegistrationNumber.
Pricing

This endpoint costs ZAR 3 per successful request regardless of the account validation status.

Resolve Account Number
Gentle reminder

This feature is available to business in Nigeria and Ghana.

The Resolve Account NumberAPI takes the customer’s account number and bank code and returns the account details of the customer. To resolve an account number, make a GET request to the /bank/resolve endpoint:
Hide Response

curl https://api.paystack.co/bank/resolve?account_number=0001234567&bank_code=058

-H "Authorization: Bearer YOUR_SECRET_KEY"

-X GET

{

  "status": true,

  "message": "Account number resolved",

  "data": {

    "account_number": "0001234567",

    "account_name": "Doe Jane Loren",

    "bank_id": 9

  }

}

Pricing

This endpoint is free for use.
Account Validation
Gentle Reminder

This feature is only available to businesses in South Africa.

The Validate AccountAPI allows merchant validate both personal and business accounts. It checks if the provided customer’s details are correct and returns the status of the check. However, not all banks support account verification, so you need to confirm if the customer's bank supports it.
Fetch supported banks

To confirm the banks that supports account validation, make a request to the List BankAPI endpoint, passing the enabled_for_verification query parameter:
Hide Response

curl https://api.paystack.co/bank?currency=ZAR&enabled_for_verification=true

-H "Authorization: Bearer YOUR_SECRET_KEY"

-X GET

{

  "status": true,

  "message": "Banks retrieved",

  "data": [

    {

      "id": 140,

      "name": "Absa Bank Limited, South Africa",

      "slug": "absa-za",

      "code": "632005",

      "longcode": "632005",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 141,

      "name": "African Bank Limited",

      "slug": "african-bank-za",

      "code": "430000",

      "longcode": "430000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 146,

      "name": "Capitec Bank Limited",

      "slug": "capitec-bank-za",

      "code": "470010",

      "longcode": "470010",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "personal"

      ]

    },

    {

      "id": 147,

      "name": "Discovery Bank Limited",

      "slug": "discovery-bank-za",

      "code": "679000",

      "longcode": "679000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 151,

      "name": "First National Bank",

      "slug": "first-national-bank-za",

      "code": "250655",

      "longcode": "250655",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 152,

      "name": "Grindrod Bank",

      "slug": "grindrod-bank-za",

      "code": "584000",

      "longcode": "584000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 153,

      "name": "Investec Bank Ltd",

      "slug": "investec-bank-za",

      "code": "580105",

      "longcode": "580105",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 157,

      "name": "Nedbank",

      "slug": "nedbank-za",

      "code": "198765",

      "longcode": "198765",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 161,

      "name": "SASFIN Bank",

      "slug": "sasfin-bank-za",

      "code": "683000",

      "longcode": "683000",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 163,

      "name": "Standard Bank South Africa",

      "slug": "standard-bank-za",

      "code": "051001",

      "longcode": "051001",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    },

    {

      "id": 165,

      "name": "TymeBank",

      "slug": "tymebank-za",

      "code": "678910",

      "longcode": "678910",

      "gateway": null,

      "pay_with_bank": false,

      "active": true,

      "country": "South Africa",

      "currency": "ZAR",

      "type": "basa",

      "is_deleted": false,

      "createdAt": "2020-09-04T10:38:56.000Z",

      "updatedAt": null,

      "supported_types": [

        "business",

        "personal"

      ]

    }

  ]

}

The data object in the response contains the banks that support account validation. The supported_types in each bank object contains an array of the account type that can be validated. Some banks only support personal accounts while others support both personal and business accounts. If the customer's bank is returned in this response, then you can go ahead with account validation, else, the account validation can be skipped.
Validate account

To validate an account, make a POST request to the /bank/validate endpoint:
Hide Response

curl https://api.paystack.co/bank/validate

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ 

      "bank_code": "632005",

      "country_code": "ZA",

      "account_number": "0123456789",

      "account_name": "Ann Bron",

      "account_type": "personal",

      "document_type": "identityNumber",

      "document_number": "1234567890123"

    }'

-X POST

{

  "status": true,

  "message": "Personal Account Verification attempted",

  "data": {

    "verified": true,

    "verificationMessage": "Account is verified successfully"

  }

}

The /bank/validate endpoint can be used for both personal and business account validation by using the following request parameters:
Name	Type	Description
account_name	String	Customer's first and last name registered with their bank
account_number	String	Customer’s account number
account_type	String	This can take one of: [personal, business]
bank_code	String	The bank code of the customer’s bank. You can fetch the bank codes by using our List BankAPI.
country_code	String	The two digit ISO code of the customer’s bank
document_type	String	Customer’s mode of identity. This could be one of: [identityNumber, passportNumber, businessRegistrationNumber]
document_number	String	Customer’s mode of identity number

When validating a personal account number, the customer can either provide their passport or identity number. You can specify the mode of identity by passing either identityNumber or passportNumber as the document_type parameter.

For business account validation the document_type should be businessRegistrationNumber.
Pricing

This endpoint costs ZAR 3 per successful request regardless of the account validation status.