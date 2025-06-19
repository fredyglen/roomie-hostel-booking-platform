
Code
Issues 6
Pull requests 5
Actions
Projects
Security

    Insights

PaystackOSS/paystack-cli
Name	Last commit message
	Last commit date
lukman-paystack
lukman-paystack
Merge pull request #21 from TobaniEG/master
ea78735
 · 
Aug 31, 2024
.github/workflows
	
Update codeql-analysis.yml
	
Apr 22, 2022
commands
	
fix issues with tunneling webhooks
	
Jan 30, 2024
lib
	
fix issues indexing db
	
Jan 30, 2024
parsers
	
converted modules to ES modules
	
Aug 26, 2023
public
	
ran prettier on the root dir
	
Aug 26, 2023
.gitignore
	
removed DS store and updated gitignore
	
Aug 26, 2023
.prettierrc
	
prettier config file
	
Aug 26, 2023
cli.js
	
remove default export for db
	
Aug 27, 2023
package-lock.json
	
update ngrok version
	
Mar 26, 2024
package.json
	
update ngrok version
	
Mar 26, 2024
readme.md
	
fix issues with tunneling webhooks
	
Jan 30, 2024
Repository files navigation

    README

dev-cli

Paystack Logo

The Paystack CLI helps you build, test, and manage your Paystack integration right from the terminal.

With the Paystack CLI, you can:

Securely test webhooks without relying on third-party tunneling software Trigger webhook events to easily test your integration Create, retrieve, update, and delete API objects Clone real life sample applications with fully integrated payment channels.

And of course the Paystack CLI is open source with a public repository on GitHub. Contributions, features, sample apps from developers are encouraged.
Installation

Paystack requires Node.js v8+ to run.

Install the dependencies and devDependencies and start the instance.

$ npm install -g @paystack-oss/dev-cli
$ paystack
$ login

Get started
API

Paystack CLI allows you to make API calls to the Paystack API right from the terminal, for example to initialize a transaction, run

$ transaction initialize --amount 1000 --email customer@email.com

The terminal's output would look like this

authorization_url - - - -- - -- - - - - - -  - - - -  - https://checkout.paystack.com/9wvzhxlk66uylzp
access_code - - - -- - -- - - - - - -  - - - -  - 9wvzhxlk66uylzp
reference - - - -- - -- - - - - - -  - - - -  - se8b1ty80b

Another example

$ transaction verify --reference T394541625653843 --domain live

output

id - - - -- - -- - - - - - -  - - - -  - 521587687
domain - - - -- - -- - - - - - -  - - - -  - live
status - - - -- - -- - - - - - -  - - - -  - success
reference - - - -- - -- - - - - - -  - - - -  - T394541625653843
amount - - - -- - -- - - - - - -  - - - -  - 100000
gateway_response - - - -- - -- - - - - - -  - - - -  - Approved
paid_at - - - -- - -- - - - - - -  - - - -  - 2020-02-27T17:28:14.000Z
created_at - - - -- - -- - - - - - -  - - - -  - 2020-02-27T17:27:31.000Z
channel - - - -- - -- - - - - - -  - - - -  - card
currency - - - -- - -- - - - - - -  - - - -  - NGN
ip_address - - - -- - -- - - - - - -  - - - -  - 102.67.15.8
fees - - - -- - -- - - - - - -  - - - -  - 1500
plan - - - -- - -- - - - - - -  - - - -  - PLN_q34mm97ac7pnqj1
paidAt - - - -- - -- - - - - - -  - - - -  - 2020-02-27T17:28:14.000Z
createdAt - - - -- - -- - - - - - -  - - - -  - 2020-02-27T17:27:31.000Z
requested_amount - - - -- - -- - - - - - -  - - - -  - 100000
transaction_date - - - -- - -- - - - - - -  - - - -  - 2020-02-27T17:27:31.000Z

Webhook

You can tunnel Paystack webhook events directly to your localhost without any third party software directly from your terminal.

You first need to sign up (or login) on ngrok and obtain your auth token. Then add it as an environment variable NGROK_AUTH_TOKEN

 $ webhook listen localhost:8995/pay/pstk-webhook?country=ng

output

> Tunelling webhook events to localhost:8995/pay/pstk-webhook?country=ng
> Webhook events would now be received at localhost:8995/pay/pstk-webhook?country=ng

NOTE - This command is only avalaible in test mode, and by using this command, the CLI would automatically make changes to the Test Webhook URL set on your Paystack dashboard.

You can also run an health check on your live/test webhook endpoint from your terminal

$ webhook ping --domain live

output

-  - - - - - - -  - - -  - - - -   - - - --  -- - - - - - -
Sending sample charge.success event payload to https://paycash.pstk.xyz/pay/pstk-webhook?country=ng
401 - - Unauthorized
Unauthorized

Sample Apps

We have built different sample apps and embedded them in the CLI, you can setup a sample project in your terminal by running

$ sample sample-react "~/Desktop/Work"

By default, all commands are run in test mode, to switch to live, append the flag "--domain live" at the end of your command
License
MIT