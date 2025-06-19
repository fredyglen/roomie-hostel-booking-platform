This endpoint takes the first 6 digits of a card PAN and returns the following details about the card:

    Card Type
    Bin
    Brand
    Sub-brand
    Bank
    Country code
    Country name

Hide Response

curl https://api.paystack.co/decision/bin/539983

-H "Authorization: Bearer YOUR_SECRET_KEY"

-X GET

{

  "status": true,

  "message": "Bin resolved",

  "data": {

    "bin": "539983",

    "brand": "Mastercard",

    "sub_brand": "",

    "country_code": "NG",

    "country_name": "Nigeria",

    "card_type": "DEBIT",

    "bank": "Guaranty Trust Bank",

    "linked_bank_id": 9

  }

}

You can use this endpoint to determine the country of issue of a card.
Pricing

This endpoint is free.