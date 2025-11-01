In a nutshell

The Flutter SDK provides methods and models that allow you to accept payment in your Flutter app.
Beta Release

The Flutter SDK is currently a beta release. If you encounter any issues or have suggestions while using it, you can create an issue to let us know about it or open a PR to add a feature.
Introduction

Paystack Flutter SDK provides methods that allow developers to build a secure, and convenient payment flow for their Flutter applications. Integration is a two-step process:

    Initiate the transaction on the server
    Complete it on the SDK

The benefit of this flow is that you keep your secret key away from the client side, which is a secure standard practice.
Project Requirements

Paystack Flutter SDK adopts recent patterns in Android and iOS which limits the older versions of these OSs that we can support. When building with the Flutter SDK, ensure your project meets these requirements:

    Flutter >= 3.0.0
    iOS >= 13
    Android: Min SDK - 23 and Compile SDK - 34

Android activity requirement

At the moment, Flutter 3.3.0 below extends the FlutterActivity as the base class for Android. The FlutterActivity doesn't have the ComponentActivity, a compulsory necessity for loading the payment views with the SDK, in its ancestral tree. To fix this, change the FlutterActivity to FlutterFragmentActivity in the MainActivity in the android folder of your project.
Getting Started

To add the Paystack Flutter SDK to your project, run the command below in your terminal:

    Terminal

flutter pub add paystack_flutter_sdk

This command adds the paystack_flutter_sdk to your package’s dependencies in the pubspec.yaml file and installs it for usage in your project. To use the library, import it in your .dart file as shown below:

    Dart

import 'package:paystack_flutter_sdk/paystack_flutter_sdk.dart';

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
Paystack Class

The Paystack class provides methods for managing payments in your app. With the SDK imported into your project, you need to initialize this class to access its methods:

    Initialization

final _paystack = Paystack();

The Paystack class comes with the following methods, available via its instance:

    initialize()
    launch()

initialize()

This method allows you set the configuration for how the SDK operates. The method signature is:

    Method Signature

Future<bool> initialize(String publicKey, bool enableLogging)

It is an asynchronous method that returns a boolean value and accepts the following parameters:
Parameter	Type	Required	Description
publicKey	String	Yes	This is the public key gotten from Paystack Dashboard. It should be the one tied to the secret key used to initialize the transaction.
enableLogging	Boolean	No	This is used to indicate if you’d like to get the logs of the Android and iOS platforms.

Here’s an example of using the initialize method:

    Method usage

String publicKey = "pk_domain_xxxxxx";


try {

  final response = await _paystack.initialize(publicKey, true); // allow logging

  if (response) {

    log("Sucessfully initialised the SDK");

  } else {

     log("Unable to initialise the SDK");

  }

} on PlatformException catch (e) {

   log(e.message!);

}

launch()

This method is used for completing the transaction that you previously initialized on your server. It loads the payment UI which your customers interact with when completing their payment. The method signature is:

    Method Signature

Future<TransactionResponse> launch(String accessCode)

It is an asynchronous method that returns a TransactionResponse and accepts the following parameter:
Parameter	Type	Required	Description
accessCode	String	Yes	This is the access_code in the response from the transaction initialization request.

Here’s an example of using the launch method:

    Method Signature

String reference = "";


try {

  final response = await _paystack.launch(_accessCode);

  if (response.status == "success") {

    reference = response.reference;

    log(reference);

  } else if(response.status == "cancelled") {

    log(response.message);

  } else {

    log(response.message);

  }

} on PlatformException catch (e) {

  log(e.message!);

}

When your integration is done right, you would need to handle the TransactionResponse model. However, there are cases where you could experience some integration bugs. Exceptions are used for handling integration errors in the Paystack class methods, all consolidated into the PaystackException model. The sections below describe how to handle both the TransactionResponse and PaystackException.
TransactionResponse

The TransactionResponse model is returned when you've successfully integrated the SDK and able to get the payment UI. It is tied to the transaction lifecycle and has the following parameters:
Parameter	Type	Description
status	String	Indicates the state of the transaction. Possible values are: success | cancelled | failed.
message	String	This is a short detail about the status of the transaction.
reference	String	This is a unique identifier used to manage post-payment processes. It is only returned when the status is success.
PaystackException

Exceptions are thrown during your integration process. There are mostly issues surrounding the development process. PaystackException makes use of the platform-specific FlutterError model which has the following parameters:
Parameter	Type	Description
code	String	This indicates the category of error.
message	String	This is a short description of the error.
details	String	This currently returns nil. In a future update, we can use it to provide details about fixing the error.

This means you can parse any exception as shown below:

    Exception handling

try {

  final response = await _paystack.launch(_accessCode);

  // rest of code

} on PlatformException catch (e) {

  log(e.code!);

  log(e.message!);

}

The following are the error codes that the PaystackException returns:
Error code	Description
INVALID_ARGUMENT	This occurs when you aren't passing the required parameter(s) to set up the SDK.
INITIALIZATION_ERROR	This occurs when the SDK cannot be initialized with the parameters passed.
UNSUPPORTED_VERSION	This occurs when your projects doesn't conform to the SDK requirements.
MISSING_VIEW	This occurs when the SDK cannot find a view controller (iOS) or Activity (Android) to attach to.
LAUNCH_ERROR	This occurs when the payment UI cannot be loaded.