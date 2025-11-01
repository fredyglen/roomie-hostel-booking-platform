The Android SDK provides UI components and methods that allow you accept payment in your Android app.
Beta Release

The Android SDK is currently a beta release. If you encounter any issues or have suggestions while using it, don't hesitate to reach out. We’d love to hear from you!
Introduction

The Android SDK is collection of methods and interfaces that allow developers to build a secure, and convenient payment flow for their Android applications. Integration is a two-step process:

    Initiate the transaction on the server
    Complete it on the SDK

Project Requirements

Paystack Android SDK is designed to support Android 6.0 (API level 23) and above. We do not support OS versions below Android 6.0. Before using the SDK, you need to ensure your app meets the following requirements:

    Android 6.0 (API level 23) and above
    Android Gradle Plugin 7.2 and above
    Gradle 7.1.3 and above
    AndroidX

Installation

To use the SDK, add the paystack-ui in the dependencies block of your app-level build file:
Latest dependency version

You should check Maven Central to get the latest version before installation.

    build.gradle

dependencies {

  implementation 'com.paystack.android:paystack-ui:0.0.9'

}
Paystack.builder()

        .setPublicKey("pk_domain_xxxxxxxx")

        .setLoggingEnabled(true)

        .build();

private PaymentSheet paymentSheet;

    Java

private void makePayment() {

  // Pass access_code from transaction initialize call on the server

  paymentSheet.launch("br6cgmvflhn3qtd");

}

@Override

protected void onCreate(Bundle savedInstanceState) {

  super.onCreate(savedInstanceState);

  setContentView(R.layout.activity_main);


  // library initialization code snippets and others go here


  paymentSheet = new PaymentSheet(this, this::paymentComplete);


  // other code snippet

}

    Java

import com.paystack.android.ui.paymentsheet.PaymentSheetResult;


private void paymentComplete(PaymentSheetResult paymentSheetResult) {


}
    Java

private void paymentComplete(PaymentSheetResult paymentSheetResult) {

  String message;


  if (paymentSheetResult instanceof PaymentSheetResult.Cancelled) {

    message = "Cancelled";

  } else if (paymentSheetResult instanceof PaymentSheetResult.Failed) {

    PaymentSheetResult.Failed failedResult = (PaymentSheetResult.Failed) paymentSheetResult;

    Log.e("Payment failed",

        failedResult.getError().getMessage() != null ? failedResult.getError().getMessage() : "Failed",

        failedResult.getError());

    message = failedResult.getError().getMessage() != null ? failedResult.getError().getMessage() : "Failed";

  } else if (paymentSheetResult instanceof PaymentSheetResult.Completed) {

    Log.d("Payment successful",

        ((PaymentSheetResult.Completed) paymentSheetResult).getPaymentCompletionDetails().toString());

    message = "Successful";

  } else {

    message = "You shouldn't be here";

  }


  Toast.makeText(this, "Payment " + message, Toast.LENGTH_SHORT).show();

}

Ensure you sync the project to download the SDK into your project. On successful installation, you’d have access to the UI components and methods to accept payment in your Android app.
Paystack Builder

The Paystack class uses a builder pattern to handle housekeeping and foundational tasks before the UI components can be used. It is part of the core library:

    KotlinJava

import com.paystack.android.core.Paystack

The table below shows the methods available in the Paystack class:
Methods	Description
setPublicKey("public-key")	This method is used to set the public key. Without a public key, you can’t complete a transaction.
setLoggingEnabled(boolean)	This method determines if you get debug logs or not. By default, it’s set to false which means you won’t get any debug log.

    KotlinJava

Paystack.builder()

    .setPublicKey("pk_domain_xxxxxxxx")

    .setLoggingEnabled(true)

    .build()

Initialize Transaction

The SDK requires an access_code to display the UI component that accepts payment. To get the access_code, make a POST request to the Initialize TransactionAPI endpoint from your server:
Hide Response

curl https://api.paystack.co/transaction/initialize

-H "Authorization: Bearer YOUR_SECRET_KEY"

-H "Content-Type: application/json"

-d '{ "email": "customer@email.com", 

      "amount": "500000"

    }'

-X POST

{

  "status": true,

  "message": "Authorization URL created",

  "data": {

    "authorization_url": "https://checkout.paystack.com/nkdks46nymizns7",

    "access_code": "nkdks46nymizns7",

    "reference": "nms6uvr1pl"

  }

}

On a successful initialization of the transaction, you get a response that contains an access_code. You need to return this access_code back to your mobile app.
Secret key safeguarding

Do not make an API request to the Initialize Transaction endpoint directly on your mobile app because it requires your secret key. Your secret key should only be used on your server where stronger security measures can be put in place.
Payment Sheet

The PaymentSheet is the UI component that contains the payment form and the available payment channels. It is part of the UI library that can be imported as shown below:

    KotlinJava

import com.paystack.android.ui.paymentsheet.PaymentSheet

The PaymentSheet class is initialized in the onCreate method of your Activity or Fragment with two arguments:
Arguments	Example	Description
Activity	this	This is the reference to your Activity or Fragment
Callback	paymentResult	This is the method that handles all post-payment processes. It’s argument has the type of PaystackSheetResult

    KotlinJava

private lateinit var paymentSheet: PaymentSheet


override fun onCreate(savedInstanceState: Bundle?) {

  super.onCreate(savedInstanceState)

  setContentView(R.layout.activity_main)


  // library initialization code snippets and others go here


  paymentSheet = PaymentSheet(this, ::paymentComplete)


  // more snippet

}

The PaymentSheet comes with a launch method that allows you trigger the display of the component. The launch method takes the access_code from a previously initialized transaction.

    KotlinJava

fun makePayment() {

  // Pass access_code from transaction initialize call on the server

  paymentSheet.launch("br6cgmvflhn3qtd")

}

Payment Sheet Result

The PaymentSheetResult exposes the different states of a transaction. It is the argument type for the PaymentSheet callback:

    KotlinJava

import com.paystack.android.ui.paymentsheet.PaymentSheetResult


private fun paymentComplete(paymentSheetResult: PaymentSheetResult) {

    

}

The different state that the PaymentSheetResult exposes are:
State	Description
Completed	The customer completed the payment process. We return a paymentCompletionDetails that contains the transaction reference. You should use the transaction reference to verify the transaction status and amount on the server before providing value.
Cancelled	The customer cancelled the payment.
Failed	An error occurred during the payment process. This result contains an error. It may also contain a reference for the transaction.

    KotlinJava

private fun paymentComplete(paymentSheetResult: PaymentSheetResult) {

  val message = when (paymentSheetResult) {

    PaymentSheetResult.Cancelled -> "Cancelled"

    is PaymentSheetResult.Failed -> {

      Log.e("Something went wrong", paymentSheetResult.error.message.orEmpty(), paymentSheetResult.error)

      paymentSheetResult.error.message ?: "Failed"

    }


    is PaymentSheetResult.Completed -> {

      // Returns the transaction reference  PaymentCompletionDetails(reference={TransactionRef})

      Log.d("Payment successful", paymentSheetResult.paymentCompletionDetails.toString())

      "Successful"

    }

  }


  Toast.makeText(this, "Payment $message", Toast.LENGTH_SHORT).show()

}