Automate the process of handling and responding to disputes with our API

When using the Disputes API, you need to:

    Retrieve all pending disputes. These are disputes that have been lodged against you but have not yet been handled.
    Retrieve applicable receipts and other documents that you can use to defend against the dispute.
    Upload all relevant receipts and documents for the dispute
    Resolve the dispute with the applicable resolution

For a list of all the endpoints and parameters, see the DisputesAPI endpoints.
Before you begin

Before starting your Disputes API integration, make sure that you:

    Understand the disputes process.
    Know the scenarios when Paystack automatically handles disputes on your behalf.
    Setup a receipts repository on your server. For more information about acceptable receipts, please see here.
    Learn about the type of disputes we have.
    Have a copy of your Secret API Key, as this will be used for API calls to the endpoints.

Understanding the disputes process

A dispute occurs when a cardholder contacts their card issuing bank and demands to have their money returned. Disputes are a feature of the card networks intended to protect cardholders from fraudulent activity.

Disputes may arise for a number of reasons including:

    Not as described, where the cardholder claims to have never received the goods (debited but no value), or the goods were materially different from their expectations.
    Not recognized, where the cardholder has no recollection of what the charge in their bank statement relates to.
    Fraud, where the cardholder claims they did not authorize the purchase (e.g. their card information was stolen and used fraudulently).
    Admin error, such as duplicate billing, incorrect amount billed, or a refund which was promised but never received.

Scenarios when Paystack auto handles disputes on your behalf
Responding to a chargeback

All disputes raised against your integration/business should be handled within 16 hours (please see this article for more information)

In a case where this time elapses, we will automatically accept these on your behalf, and refunds to the affected customers are triggered from your Paystack Balance.
Setting up a receipts repository on your server

On your application backend, you can have a folder that contains internally generated receipts (preferably in .pdf format). It is our recommendation that these receipts can be generated either on receipt of the charge.success webhook notification or on verifying the success of the transaction using GET /transaction/{reference}.

These receipts should be saved (ideally) with the transaction reference as the name of the file. For example, if you have a transaction with reference my-demo-transaction-xxx, then the name of the file for the generated receipt would be my-demo-transaction-xxx.pdf. You will understand how this factors in the automated process later on.
Types of disputes

There are two types of disputes:

    Chargebacks
    Fraud Claims

Chargebacks usually occur when the customer paid for a product or service and did not get value for that service but had his bank account debited by you, the merchant, for that service.

Fraud happens when an authorized transaction is made using a customer's payment information by a bad actor. Fraud is a major reason why a customer can raise a dispute at their bank.
Automating the disputes process

You may decide to create a background task to run this at an interval, or at a certain time every day, or you may just have a button to run this at any time you choose.
Step 1: Get pending disputes

You can do this by calling our List DisputesAPI endpoint. There are 3 major parameters for this:
Parameter	Description
from	The datetime from which to start searching for disputes. The recommended format is yyyy-MM-ddTHH:mm:ss.SSS[Z]
to	The datetime to which to end searching for disputes. The recommended format is yyyy-MM-ddTHH:mm:ss.SSS[Z]
status	The status of the dispute. For this process, the status should be awaiting-merchant-feedback
Tip

For datetime search, let the start date be at midnight of the date in question (eg. 2020-01-13T00:00:00.000Z), and let the end date be a second before midnight of the following day (eg 2020-01-13T23:59:59.999Z).
Step 2: Upload Dispute Evidence

Remember when we suggested that you save your receipts with the reference number of the transaction that generated the receipt over here? Now we get to put that to use.

Taking each dispute from the array of disputes obtained from the previous step, we will need the dispute id and the transaction reference. The dispute id will be used to upload the receipt, while the transaction reference will be used to get the receipt from the repository.
Where do I upload this receipt to?

You will need to generate a URL that will be used to upload the receipt. You can do this by calling our Get Upload URLAPI endpoint.

This returns a signedUrl where the receipt can be uploaded to and the filename that should be used to identify the upload when resolving the dispute.
URL Validity

Please note that the signedUrl is only valid for 30 minutes.

Once this URL has been obtained, you can then upload the corresponding receipt as evidence that the customer was given value for the charge for which the dispute was raised.
Acceptable Format

Acceptable document formats are .jpg (image/jpg), .jpeg (image/jpeg) and .pdf (application/pdf).

To upload the receipt, make a PUT request with the signedUrl as illustrated with the sample code below.

    Node

var request = require("request");

var fs = require("fs");


fs.readFile('./transaction_reference.pdf', function (err, data) {

  var options = {

    method: "PUT",

    url: signedUrl,

    'Content-Type': 'application/pdf',

    body: data

  }


  request(options, function (error, response, body) {

    if (error) throw new Error(error);

    console.log(body);

    console.log("Status code: ", response.statusCode);

  });

});

If the upload is successful, there will be an empty string in the response, so it will be a good idea to see the status code returned.
What if the dispute is a fraud claim?

You will also be required to provide evidence about the product or service rendered to your customer, as this will be used while investigating the claim. To do this, you will call our Add EvidenceAPI endpoint.
Step 3: Resolve the dispute

This is where you respond to disputes, either accepting or declining the dispute. To accept a dispute, you send a resolution value of merchant-accepted while to decline, you send a resolution value of declined. If accepting a dispute, you can set the amount (either full or partial) you want to refund the customer with. To reject the dispute, the filename of the upload (done in the previous step) will be required in the request.

You can resolve disputes by calling our Resolve DisputeAPI endpoint. Kindly note the following:

    The uploaded_filename property is the same value we got when creating the upload URL for the transaction receipt.
    The evidence property is the id obtained when we created an evidence in the previous step. If the dispute is not a fraud claim, you can leave this as an empty string.
    The amount should be in the subunit of the supported currency.

Handle Webhook

Paystack sends a charge.dispute.create event when a dispute is logged on your business. We'll also send a charge.dispute.remind event every 4 hours for chargebacks that are not resolved. The charge.dispute.resolve event is sent once the dispute is resolved. Learn more about Webhooks.