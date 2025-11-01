In a nutshell

The InlineJS library provides a collection of methods that allow you accept payment in your web application.
Introduction

InlineJS is Paystack’s Javascript library that offers a simple, secure, and convenient payment flow for web applications. It provides methods for initiating different types of payments e.g one time, recurring, split etc. and handle payment state, all with a few lines of code.
Browser support

Paystack InlineJS is designed to support all recent versions of major browsers. The library is compiled to ES5 and poly-filled to ensure it can work on as many devices as possible.

We do not support outdated browsers like IE9 nor browsers that disable the use of Javascript, like Opera mini.

    We require TLS 1.2 to be supported by the browser
    We support Chrome and Safari on all platforms
    We support Firefox on desktop platforms
    We support the Android native browser on Android 4.4 and later

Opera Mini support

We don't support Opera Mini because Javascript is disabled in it. However, we support the Opera browser, except in super saver mode where JavaScript is disabled as well.
Installation

Paystack InlineJS can be included in your application via CDN, NPM or Yarn:

    NPMYarn

npm i @paystack/inline-js

yarn add @paystack/inline-js




    CDNNPMYarn

<script src="https://js.paystack.co/v2/inline.js">

If you used NPM or Yarn, ensure you import the library as shown below:

    Initialization

// Add for NPM, Yarn

import Paystack from '@paystack/inline-js';


const popup = new Paystack()

Paystack object

The Paystack object gives access to the methods and interfaces available in InlineJS. It exposes methods, alongside configuration options that can help you accept payment seamlessly in your web application. The methods exposed by the Paystack object include:

    checkout(options): This is an asynchronous method used to create a transaction.
    newTransaction(options): This is a synchronous method used to create a transaction.
    resumeTransaction(accessCode): With this method, you can initiate a transaction from your backend using the initialize endpoint, then complete the transaction in the frontend without redirecting.
    cancelTransaction(id): Sometimes, it might take a while to load a transaction. In such a situation, this method can be used to cancel the transaction.
    preloadTransaction(options): This method is used to load a transaction in the background such that when the user is about to checkout, the Popup loads instantly.
    paymentRequest(options): This is best suited for handling a custom user experience when your users can make a payment from their wallet (e.g. Apple Pay)

Wallet support

Apple Pay is the only wallet we currently support. Unless otherwise stated, all references to wallet in this documentation refers to Apple Pay.
Callbacks

The Paystack object also exposes callbacks that can be used to monitor certain states during the lifecycle of a transaction.
onLoad

This is called when the transaction is successfully loaded and the customer can see the Popup. It returns an object with the following parameters:
Option	Type	Description
id	String	This is the transaction id
accessCode	String	This is a unique payment code used for creating the payment link and loading the Popup
customer	Object	The details of the customer making the payment

    onLoad(response)

onLoad: (response) => {

  // Transaction has loaded

  // You can parse the transaction object if you need to.

}

onSuccess

This is called when the customer successfully completes a transaction. It returns an instance of a transaction object:
Option	Type	Description
reference	String	This is the unique payment reference that can be used for reconciliation
trans	String	This is the transaction id (for backward compatibility)
status	String	The final state of the transaction
message	String	Complimentary note of the transaction status
transaction	String	This is the transaction id
trxref	String	This is the unique payment reference that can be used for reconciliation (for backward compatibility)

    onSuccess(transaction)

onSuccess: (transaction) => {

  // Post payment flow can go here

}

onElementsMount

This is called when the Apple Pay button has been mounted. It returns null in a case where the user's device doesn't support Apple Pay.

    onElementsMount(elements)

onElementsMount: (elements) =>{ // { applePay: true } or null

  if (elements) {

    console.log("Successfully mounted elements: ", JSON.stringify(elements));

  } else {

    console.log('Could not load elements');

  }

}

onCancel

This is called when the transaction is cancelled. It returns no response.

    onCancel()

onCancel: () => {

  console.log("User cancelled")

}

onError

This is called when there is an issue loading the transaction.

    onError(error)

onError: (error) => {

  console.log("Error: ", error.message);

}

Transaction request

With Paystack, a transaction can be initiated for different scenarios such as:

    One-time payment
    Split payment
    Multi-split payment
    Subscriptions

InlineJS provide parameters and methods to to create the different types of transaction. The table below shows the general options that be used when creating a transaction:
Option	Type	Required	Description
key	String	True	Your public key, gotten from your Paystack dashboard in Settings > API Keys & Webhook
amount	Number	True	The amount of the transaction in the lowest denomination of your currency
email	String	True	The customer's email address
currency	Number	False	The currency of the transaction. You can check the API Reference for all supported currency
firstName	String	False	The customer's first name
lastName	String	False	The customer's last name
phone	String	False	The customer's phone number
customerCode	String	False	A valid Paystack customer code. If provided, this overrides all the customer information above
channels	Array	False	An array of payment channels to use. Available channels are ['card', 'bank', 'ussd', 'qr', 'eft', 'mobile_money', 'bank_transfer', ‘apple_pay’]
metadata	Object	False	A valid object of extra information that you want to be saved to the transaction.
reference	String	False	Unique case sensitive transaction reference. Only -, ., = and alphanumeric characters allowed.
One-time transaction

The most basic way to use InlineJS is to accept payment for a one-off transaction. Generally, the payment is non-recurring and requires no special configuration. We provide two methods to accept one-time payments:

    newTransaction(options)
    checkout(options)

newTransaction(options)

This is a synchronous method used to create a transaction. It’s best suited for cases where using an asynchronous flow isn’t necessary. It takes all the general transaction request options and can be used as shown below:

    newTransaction(options)

const popup = new Paystack()


popup.newTransaction({

  key: 'pk_domain_xxxxxx',

  email: 'sample@email.com',

  amount: 23400,

  onSuccess: (transaction) => {

    console.log(transaction);

  },

  onLoad: (response) => {

    console.log("onLoad: ", response);

  },

  onCancel: () => {

    console.log("onCancel");

  },

  onError: (error) => {

    console.log("Error: ", error.message);

  }

})

checkout(options)

Similar to its counterpart but for an asynchronous flow. It takes all the general transaction request options and can be used as shown below:

    checkout(options)

const popup = new Paystack()


popup.checkout({

  key: 'pk_domain_xxxxxx',

  email: 'sample@email.com',

  amount: 23400,

  onSuccess: (transaction) => {

    console.log(transaction);

  },

  onLoad: (response) => {

    console.log("onLoad: ", response);

  },

  onCancel: () => {

    console.log("onCancel");

  },

  onError: (error) => {

    console.log("Error: ", error.message);

  }

})

Payment request

Payment requests are used for handling wallet payments such as Apple Pay. It’s used to create a custom experience by making the wallet option more prominent on your website. For example, you can have an Apple Pay button and another button to load the checkout.
paymentRequest(options)

The paymentRequest method the following options in addition to the general option:
Option	Type	Required	Description
container	String	True	ID of div to mount the payment request button
loadPaystackCheckoutButton	String	False	ID of button to open checkout form
styles	Object	False	CSS style for the wallet button

The styles object takes the following options:
Option	Type	Required	Description
theme	String	False	Option to customize the button background and text color. Available options are dark | light
applePay	Object	False	Styles for the Apple Pay button

The applePay object takes the following options:
Option	Type	Required	Description
width	String	False	Specify the width of the button
height	String	False	Specify the height of the button
borderRadius	String	False	Specify the radius of the button edges
type	String	False	This determines the text that shows on the button
locale	String	False	Set the language of the button

    HTML

<!-- Payment request buttons, styles and event listeners will be injected to this div -->

<div id="paystack-apple-pay"></div>

<button id="paystack-other-channels">More payment options</button>

    paymentRequest(options)

const popup = new Paystack()


const onElementsMount = (elements) => {

  if (elements && elements.applePay) {

    document.querySelector("#pay-button").innerText = "More Payment Options";

  }

}


try {

  await popup.paymentRequest({

    key: 'pk_domain_xxxxxx',

    email: 'testuser@paystack.com',

    amount: 10000,

    currency: "NGN",

    container: 'payment-request-buttons',

    loadPaystackCheckoutButton: 'pay-button',

    styles: {

      theme: 'dark',

      applePay: {

        width: '100%',

        height: '50px',

        borderRadius: '3px',

        type: 'plain',

        locale: 'en'

      }

    },

    onElementsMount,

  });

} catch (error) {


}

Resume transaction

The resume transaction flow allows you to initiate a transaction on your server and complete it in the browser. This flow provides both the security of server initialization and the convenience of the user experience in the browser. To get started, make a POST request from your backend to the Initialize TransactionAPI endpoint:
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

In the data object of the response returned, you need to save the access_code and send it to your frontend.
Secret key safeguarding

Do not make an API request to the Initialize Transaction endpoint directly on your mobile app because it requires your secret key. Your secret key should only be used on your server where stronger security measures can be put in place.
resumeTransaction(accessCode)

In your frontend, you can use this access_code to complete the payment without leaving your site.
Option	Type	Required	Description
accessCode	String	True	Access code returned from the transaction initialization

    resumeTransaction(accessCode)

const popup = new Paystack()


popup.resumeTransaction(access_code)

The resumeTransaction method triggers the checkout in the browser, allowing the user to choose their preferred payment channel to complete the transaction.
Split transaction

Sometimes you need to share a transaction with another business or entity. To do this you can create a subaccount and pass the subaccoutCode from the response when setting up payment:

    Split Transaction

const popup = new Paystack()


popup.newTransaction({

  key: 'pk_domain_xxxxxx',

  email: 'sample@email.com',

  amount: 45000,

  subaccountCode: 'ACCT_dskvlw3y3dsvkmt',

  onSuccess: (transaction) => {

    console.log(transaction);

  },

  onLoad: (response) => {

    console.log("onLoad: ", response);

  },

  onCancel: () => {

    console.log("onCancel");

  },

  onError: (error) => {

    console.log("Error: ", error.message);

  }

})

The table below shows the parameters that can be used to config split payments:
Option	Type	Required	Description
subaccountCode	String	True	A valid Paystack subaccount code e.g. ACCT_8f4s1eq7ml6rlzj
bearer	String	False	This is used to specific the account that bears the Paystack charges. Values can be account or subaccount (defaults to account).
transactionCharge	Number	False	A flat fee (in the smallest denomination of your currency) the main account should take. This overrides the split percentage set when the subaccount was created.
Multi-split transaction

Multi-split payment is used to share a single transaction with multiple partners. Based on your use-case, the split can be created ahead of time via the API or dynamically during the transaction initiation.

If you are certain of your split configuration ahead of time, you can create the split and pass the split_code when setting up the transaction:

    Multi-Split Transaction

const popup = new Paystack()


popup.newTransaction({

  key: 'pk_domain_xxxxxx',

  email: 'split@dynamic.com',

  amount: 35650,

  currency: 'NGN',

  split: {

    type: 'percentage',

    bearer_type: 'account',

    subaccounts: [

      {

        subaccount: 'ACCT_dskvlw3y3dsvkmt',

        share: 30

      },

      {

        subaccount: 'ACCT_eg4sob4590pq9vb',

        share: 20

      }

    ]

  },

  onSuccess: (transaction) => {

    console.log(transaction);

  },

  onLoad: (response) => {

    console.log("onLoad: ", response);

  },

  onCancel: () => {

    console.log("onCancel");

  },

  onError: (error) => {

    console.log("Error: ", error.message);

  }

})

Option	Type	Required	Description
split_code	String	True	A valid Paystack split code with configuration for how payment should be split with partners

Otherwise, you might want to create the split on the fly by passing the split object in the transaction request:

    Multi-Split Dynamic Transaction

const popup = new Paystack()


popup.newTransaction({

  key: 'pk_domain_xxxxxx',

  email: 'multi@split.com',

  amount: 98540,

  split_code: 'SPL_RYUUL4u1hP',

  onSuccess: (transaction) => {

    console.log(transaction);

  },

  onLoad: (response) => {

    console.log("onLoad: ", response);

  },

  onCancel: () => {

    console.log("onCancel");

  },

  onError: (error) => {

    console.log("Error: ", error.message);

  }

})

Option	Type	Required	Description
type	String	True	Takes either flat or percentage to indicate if you want a fixed or variable share
bearer_type	String	True	This is used to indicate the bearer of the transaction fee. It takes one of the following values: all, all-proportional, account or subaccount
subaccounts	Array	True	Takes an array of subaccount objects used to specify the account and share of each account
bearer_subaccount	String	False	Subaccount code of the bearer. It should be specified if bearer_type is subaccount
reference	String	False	Unique reference for the split
Subscriptions

Subscription allows you process recurring billing for your customers. The first time you are setting up payments, you can add the following parameters that tells us to continuously charge the customer:
Option	Type	Required	Description
planInterval	String	True	Interval for the plan. Valid intervals are daily, weekly, monthly, annually
subscriptionLimit	Number	False	The number of times to charge for this subscription
subscriptionStartDate	String	False	The start date for the subscription (after the first charge)

    Subscription

const popup = new Paystack()


popup.newTransaction({

  key: 'pk_domain_xxxxxx',

  email: 'sub@main.com',

  amount: 20000,

  planInterval: 'weekly',

  onSuccess: (transaction) => {

    console.log(transaction);

  },

  onLoad: (response) => {

    console.log("onLoad: ", response);

  },

  onCancel: () => {

    console.log("onCancel");

  },

  onError: (error) => {

    console.log("Error: ", error.message);

  }

})

Subscription amount

The amount specified in the request will be used subsequently for the subscription.

Alternatively, you can create a plan via the API or dashboard and pass the planCode in the transaction request:

    Subscription with Plan

const popup = new Paystack()


popup.newTransaction({

  key: 'pk_domain_xxxxxx',

  email: 'plan@email.com',

  amount: 40000,

  planCode: 'PLN_l6aglbqzebn32c6',

  onSuccess: (transaction) => {

    console.log(transaction);

  },

  onLoad: (response) => {

    console.log("onLoad: ", response);

  },

  onCancel: () => {

    console.log("onCancel");

  },

  onError: (error) => {

    console.log("Error: ", error.message);

  }

})

Option	Type	Required	Description
planCode	String	True	A valid Paystack plan code e.g. PLN_cujsmvoyq2209ws
subscriptionCount	Number	False	The number of subscriptions to create for this plan
Plan amount precedence

While amount is a required parameter, the amount used to create the plan takes precedence when subscribing to a plan.
Preload transaction

Preloading a transaction is similar to creating a new transaction but with a little twist. Rather than waiting till the final moment to make a transaction request, you can load the transaction ahead of time.

This method loads a transaction on the Popup without opening it. It returns a function that can be used to open the Popup at a later time. This allows the Popup to load instantly at the point the user is ready to make a payment.
preloadTransaction(options)

This method takes all the general options of a transaction request:

<button id="make-payment">Make Payment</button>

    Preload Transaction

const popup = new Paystack()


const loadPopup = popup.preloadTransaction({

  key: 'pk_domain_xxxxxx',

  email: 'testuser@paystack.com',

  amount: 10000,

  currency: "NGN"

});


document.querySelector("#make-payment").onclick = loadPopup;

Cancel transaction

There are situations where you want to build a logic to cancel a transaction. The cancelTransaction method allows you to cancel a transaction and hide the checkout iFrame.
cancelTransaction(id)
Option	Type	Required	Description
id	String	True	Transaction ID of the payment to cancel

    Cancel Transaction

const popup = new Paystack()


const transaction = popup.newTransaction({

  key: 'pk_domain_xxxxx', // Replace with your public key

  email: "demo@example.com",

  amount: 10000,

  onLoad: (transaction) => {

    window.clearInterval(redirectTimer);

  }

});


let timeElapsed = 0;

const timeLimit = 2;

const redirectURL = 'https://your.redirecturl.com';

const redirectTimer = setInterval(() => {

  timeElapsed += 1;

  if (timeElapsed === timeLimit) {

    popup.cancelTransaction(transaction.id);

    window.location.href = redirectURL;

  }

}, 1000);