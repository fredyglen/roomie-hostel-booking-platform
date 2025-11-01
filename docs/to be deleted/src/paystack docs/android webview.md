https://github.com/PaystackOSS/sample-android-webview

Name	Last commit message
	Last commit date
damilola-paystack
damilola-paystack
Chore: Add some instructions to the READMe
3c3c9ed
 · 
Jun 24, 2022
.idea
	
Implement Webview to load checkout
	
Jun 24, 2022
app
	
Implement Webview to load checkout
	
Jun 24, 2022
gradle/wrapper
	
Initial project setup
	
Jun 24, 2022
.gitignore
	
Initial project setup
	
Jun 24, 2022
README.md
	
Chore: Add some instructions to the READMe
	
Jun 24, 2022
build.gradle
	
Initial project setup
	
Jun 24, 2022
gradle.properties
	
Initial project setup
	
Jun 24, 2022
gradlew
	
Initial project setup
	
Jun 24, 2022
gradlew.bat
	
Initial project setup
	
Jun 24, 2022
settings.gradle
	
Initial project setup
	
Jun 24, 2022
Repository files navigation

    README

sample-android-webview

This is a sample application that shows how to use a webview to load the Paystack checkout in your Android application. The app also shows how to handle the post-payment process.
Getting started

A webview is a mini-browser that loads a URL. So the first order of business is getting the URL that the webview will load. To do this, you need to:

    Initiate a transaction from your server
    Parse the response
    Load the authorization URL

Initiate a transaction

To intiate a transaction, make a POST request from your server to the Transaction Initialize endpoint, passing the following parameters:

{
    "email": "sample@email.com",
    "amount": "20000",
    "currency": "NGN",
    "callback_url": "https://your-callback-url.com/",
    "metadata": {
        "cancel_action": "https://your-cancel-url.com/"
    }
}

The callback_url will be used to handle a successful payment while the cancel_action will be used to handle a scenario where the user cancels the transaction.
Parse the response

On a successfulrequest, you get a response like this:

{
    "status": true,
    "message": "Authorization URL created",
    "data": {
        "authorization_url": "https://checkout.paystack.com/n0yw50p3agba6qp",
        "access_code": "n0yw50p3agba6qp",
        "reference": "xwr15n5f0w"
    }
}

You need to get the authorization_url, which will be loaded on your webview.
Load the authorization URL
Depending on your application structure, you can now fetch and load the authorization_url your app's webview