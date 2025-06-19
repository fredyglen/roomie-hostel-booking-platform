Name	Last commit message
	Last commit date
tolu-paystack
tolu-paystack
Merge pull request #34 from PaystackOSS/dependabot/npm_and_yarn/json5…
caecf21
 · 
Mar 28, 2023
.github/workflows
	
Create codeql-analysis.yml
	
Mar 3, 2021
public
	
Initialize project using Create React App
	
Jun 11, 2020
src
	
add alert to show transaction reference on success
	
Sep 23, 2022
.env.example
	
Add env.example, LICENSE, and updated README
	
Sep 23, 2022
.gitignore
	
add alert to show transaction reference on success
	
Sep 23, 2022
LICENSE.md
	
Add env.example, LICENSE, and updated README
	
Sep 23, 2022
README.md
	
Update README.md
	
Sep 23, 2022
package.json
	
Chore: Bump libraries with vulnerabilities
	
Mar 3, 2021
yarn.lock
	
Merge pull request #34 from PaystackOSS/dependabot/npm_and_yarn/json5…
	
Mar 28, 2023
Repository files navigation

README

    MIT license

Getting Started with Paystack and React

This repository includes a sample application that shows how to integrate Paystack payments to your React apps.

The sample app is a simple checkout form to purchase an item and check out using the Paystack Popup checkout. It uses iamraphson's react-paystack library.

The library offers 3 integration methods:

    Using hooks
    Using a <PaystackButton/> component
    Using the Context API

This sample uses the <PaystackButton/> component, but you can swap it out for any of the other methods. All 3 methods will bear the same results
Demo

View a live demo of the app here
Get Started

    Clone this repo:

git clone https://github.com/PaystackOSS/sample-react.git

    Navigate to the root directory and install dependencies

cd sample-react
yarn install

Usage

    Rename the .env.example file to .env and add your Paystack public key:

REACT_APP_PAYSTACK_PUBLIC_KEY=pk_domain_xxxxxx

    Start the application

yarn start

    Visit http://localhost:3000 in your browser, if React doesn't automatically open it for you. You should now see your checkout form, and be able to make a purchase.

Note: This is a simple client-side integration, that uses a callback to perform post-payment logic. For a more stable, robust solution, you should use webhooks to listen for transaction success and perform any post-payment logic on your server.
Contributing

If you notice any issues with this app, please open an issue. PRs are also more than welcome, so feel free to submit a PR to fix an issue, or add a new feature!
License
This repository is made available under the MIT license. Read LICENSE.md for more information.