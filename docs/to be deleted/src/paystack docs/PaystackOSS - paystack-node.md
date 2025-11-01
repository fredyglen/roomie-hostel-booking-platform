https://github.com/PaystackOSS/paystack-node

Code
Issues 3
Pull requests 3
Actions
Projects
Security

    Insights

PaystackOSS/paystack-node
Name	Last commit message
	Last commit date
damilola-paystack
damilola-paystack
Chore: Update npmignore
a464e7c
 · 
Sep 4, 2024
.github
	
Add Issue and PR templates
	
Sep 1, 2022
.openapi-generator
	
Patch: Module resolution bug
	
Jun 24, 2024
src
	
Patch: (DX) Type export for autocomplete
	
Sep 3, 2024
.gitignore
	
Add Issue and PR templates
	
Sep 1, 2022
.npmignore
	
Chore: Update npmignore
	
Sep 4, 2024
.openapi-generator-ignore
	
Generate version 0.5.1
	
Feb 14, 2022
LICENSE
	
Add LICENSE
	
Feb 7, 2022
README.md
	
Patch: Compilation from TS to JS with support for ESM and CJS
	
Jun 25, 2024
package-lock.json
	
Patch: Compilation from TS to JS with support for ESM and CJS
	
Jun 25, 2024
package.json
	
Patch: (DX) Type export for autocomplete
	
Sep 3, 2024
tsconfig.cjs.json
	
Patch: Module resolution bug
	
Jun 24, 2024
tsconfig.esm.json
	
Patch: Module resolution bug
	
Jun 24, 2024
tsconfig.json
	
Patch: Module resolution bug
	
Jun 24, 2024
tsconfig.types.json
	
Patch: Module resolution bug
	
Jun 24, 2024
Repository files navigation

README

    MIT license

Paystack Node Library

A Node client library for consuming the Paystack API
Prerequisite

Your need to create a Paystack account, if you don't have one already, to get your test and live secret keys.
Installation

npm install @paystack/paystack-sdk --save

Usage

Import and initialize the library:

const { Paystack } = require('@paystack/paystack-sdk')
const paystack = new Paystack("sk_test_xxxxxx")

paystack.transaction.initialize({email: "test@example.com", amount: 20000})
                    .then(response => console.log(response))
                    .catch(error => console.log(error))

Import and initialize the library using ES module with async/await:

import { Paystack } from '@paystack/paystack-sdk'
const paystack = new Paystack("sk_test_xxxxxx")

const initialize = async(email, amount) => {
  const response = await paystack.transaction.initialize({
    email,
    amount
  })

  console.log(response)
}

const email = 'test@example.com'
const amount = 2000
initialize(email, amount)

Typescript

import { Paystack } from '@paystack/paystack-sdk';
const paystack = new Paystack("sk_test_xxxxxx");

const initialize = async(email, amount) => {
  const response = await paystack.transaction.initialize({
    email,
    amount
  });

  console.log(response);
}

const email = 'test@example.com';
const amount = 2000;
initialize(email, amount);

Issues

Kindly open an issue if you discover any bug or have problems using this library.
License
This repository is made available under the MIT license. Kindly read the LICENSE file for more information.