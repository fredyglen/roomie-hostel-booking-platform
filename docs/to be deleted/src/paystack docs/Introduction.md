earn how to integrate our APIs into your application.
API Basics
Before you begin!

You should create a free Paystack account that you can test the API against. We will provide you with test keys that you can use to make API calls.

The Paystack API gives you access to pretty much all the features you can use on our dashboard and lets you extend them for use in your application. It strives to be RESTful and is organized around the main resources you would be interacting with - with a few notable exceptions.
HTTP Methods
Method	Type	Description
POST	String	Creates a new resource on the server.
GET	String	Retrieves a representation of a resource.
PUT	String	Updates an existing resource or creates it if it doesn't exist.
DELETE	String	Deletes a specified resource.
Sample Requests

We provide sample API calls next to each method using cURL. All you need to do is insert your specific parameters, and you can test the calls from the command line. See this tutorial on using cURL with APIs.

You can also use Postman if you aren't familiar with cURL. Postman is an easy to use API development and testing platform. You can explore the Paystack Postman Collection to understand how our APIs work.
Requests and Responses

Both request body data and response data are formatted as JSON. Content type for responses will always be application/json. Generally, all responses will be in the following format:
Keys
status
Boolean
	This lets you know if your request was succesful or not. We recommend that you use this in combination with HTTP status codes to determine the result of an API call.
message
String
	This is a summary of the response and its status. For instance when trying to retrieve a list of customers, message might read “Customers retrieved”. In the event of an error, the message key will contain a description of the error as with the authorization header situation above. This is the only key that is universal across requests.
data
Object
	This contain the results of your request. It can either be an object, or an array depending on the request made. For instance, a request to retrieve a single customer will return a customer object in the data key, while the key would be an array of customers if a list is requested instead.

    Response Format

{

  "status": "[boolean]",

  "message": "[string]",

  "data": "[object]"

}

Meta Object

The meta key is used to provide context for the contents of the data key. For instance, if a list of transactions performed by a customer is being retrieved, pagination parameters can be passed along to limit the result set. The meta key will then contain an object with the following attributes:
Keys
total
Number
	This is the total number of transactions that were performed by the customer.
skipped
Number
	This is the number of records skipped before the first record in the array returned.
perPage
Number
	This is the maximum number of records that will be returned per request. This can be modified by passing a new value as a perPage query parameter. Default: 50
page
Number
	This is the current page being returned. This is dependent on what page was requested using the page query parameter. Default: 1
pageCount
Number
	This is how many pages in total are available for retrieval considering the maximum records per page specified. For context, if there are 51 records and perPage is left at its default value, pageCount will have a value of 2.

    Meta Key Structure

{

  "meta": {

    "total": 2,

    "skipped": 0,

    "perPage": 50,

    "page": 1,

    "pageCount": 1

  }

}

Supported Currency

Paystack makes use of the ISO 4217 format for currency codes. When sending an amount, it must be sent in the subunit of that currency.

Sending an amount in subunits simply means multiplying the base amount by 100. For example, if a customer is supposed to make a payment of NGN 100, you would send 10000 = 100 * 100 in your request.
Currency code	Base unit	Description	Transaction minimum
NGN	Kobo	Nigerian Naira	₦ 50.00
USD	Cent	US Dollar	$ 2.00
GHS	Pesewa	Ghanaian Cedi	₵ 0.10
ZAR	Cent	South African Rand	R 1.00
KES	Cent	Kenyan Shilling	Ksh. 2.00