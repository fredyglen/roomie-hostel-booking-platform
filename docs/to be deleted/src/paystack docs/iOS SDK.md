The iOS SDK provides UI components and methods that allow you accept payment in your iOS app.
Beta release

The iOS SDK is currently a beta release. If you encounter any issues or have suggestions while using it, don't hesitate to reach out. We’d love to hear from you!
Introduction

The iOS SDK is collection of methods and interfaces that allow developers to build a secure, and convenient payment flow for their iOS applications. Integration is a two-step process:

    Initiate the transaction on the server
    Complete it on the SDK

Project Requirements

Paystack iOS SDK is designed to support iOS 13 and above. We do not support OS versions below iOS 13. Before using the SDK, you need to ensure your app meets the following requirements:

    iOS 13 and above
    Any OS version on any other OS
    Swift Package Manager

Installation

The iOS SDK comes with two packages:

    PaystackCore: This contains the APIs and methods for processing payments.
    PaystackUI: This contains the UI components to collect the customer’s payment information and display the payment status.

You can install these packages via the Swift Package Manager. To add the required packages, ensure you have the latest version of XCode installed and follow these steps:

    Select File > Add Package Dependencies…
    Copy the repo URL and paste it in the search box of the package dependency

You can read the Swift Package Manager documentation to learn more about adding packages to your project.
Paystack Core

The PaystackCore module uses a builder pattern to handle housekeeping and foundational tasks before the UI components can be used.

    Swift

import PaystackCore

The table below shows the methods available in the Paystack class:
Methods	Description
setKey("public-key")	This method is used to set the public key. Without a public key, you can’t complete a transaction.
enableLogging()	This method determines if you get debug logs or not. By default, logging is disabled. Adding this method enables logging.

    Swift

let paystack = try? PaystackBuilder

        .newInstance

        .setKey("pk_domain_xxxxxxxx")

        .build()

Initialize Transaction

The SDK requires an access_code to display the UI component that accepts payment. To get the access_code, make a POST request to the Initialize TransactionAPI endpoint from your server:
Show Response

curl https://api.paystack.co/transaction/initialize

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ "email": "customer@email.com", 

      "amount": "500000"

    }'

-X POST

On a successful initialization of the transaction, you get a response that contains an access_code. You need to return this access_code back to your mobile app.
Secret key safeguarding

Do not make an API request to the Initialize Transaction endpoint directly on your mobile app because it requires your secret key. Your secret key should only be used on your server where stronger security measures can be put in place.
Paystack UI

The PaymentUI modules holds the UI components that manages the payment form and the available payment channels. You can add this module to your project as shown below:

    Swift

import PaystackUI

The PaystackUI module comes with two methods:

    chargeUIButton: This is best suited for SwiftUI.
    presentChargeUI: This is best suited for UIKit.

chargeUIButton

We provide a button that you can customize to trigger the Payment UI. This method takes the following parameters:
Parameter	Type	Description
accessCode	String	This is gotten from your server after initializing a transaction.
onComplete	Callback	This method handles all post-payment processes. It’s argument has the type of TransactionResult.

    SwiftUI

paystack?.chargeUIButton(accessCode: "0peioxfhpn", onComplete: paymentDone) {

      Text("Initiate Payment")

}

presentChargeUI

With this method, you need to create a button that would trigger the display of the Payment UI. The Payment UI requires a view to hook to, so you need to provide a reference to the view controller of the view being displayed, alongside other parameters listed in the table below:
Parameter	Type	Description
on	ViewController	The view controller of the current view.
accessCode	String	This is gotten from your server after initializing a transaction.
onComplete	Callback	This method handles all post-payment processes. It’s argument has the type of TransactionResult.

    UIKit

@IBAction func payButtonTapped(_ sender: Any) {

      paystack?.presentChargeUI(on: self,

                              accessCode: "0peioxfhpn",

                              onComplete: paymentDone)

}

Transaction Result

The TransactionResult exposes the different states of a transaction. It is the argument type for the PaystackUI onComplete callback:
State	Description
Completed	The customer completed the payment process. We return a paymentCompletionDetails that contains the transaction reference. You should use the transaction reference to verify the transaction status and amount on the server before providing value.
Cancelled	The customer cancelled the payment.
Failed	An error occurred during the payment process. This result contains a ChargeError. The ChargeError contains a cause property which details the actual error received and should be used for error handling and logging

    Swift

func paymentDone(_ result: TransactionResult) {

  switch (result){

    case .completed(let details):

      print("Transaction completed with reference: (details.reference)")

    case .cancelled:

      print("Transaction was cancelled")

    case .error(error: let error, reference: let reference):

      print("An error occured: (error.message) with reference: (String(describing: reference))")

  }

}