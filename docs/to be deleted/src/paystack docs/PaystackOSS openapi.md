https://github.com/PaystackOSS/openapi

damilola-paystack
damilola-paystack
Add response objects
375cd00
 · 
Sep 30, 2024
.github
	
Fix GA uses error
	
Sep 9, 2022
.vscode
	
Feat: Consolidate all resources and schemas to one file
	
Jun 27, 2024
base
	
Add response objects
	
Sep 30, 2024
dist
	
generate all examples
	
Jun 12, 2024
main
	
Add list transfers example
	
Jun 12, 2024
sdk
	
Chore: Update plan schema
	
Apr 12, 2023
use_cases
	
Chore: Update endpoint using transaction verify
	
Apr 12, 2023
.gitignore
	
Update git ignore
	
Aug 25, 2022
.spectral.yaml
	
Update spec and components
	
Feb 16, 2022
LICENSE
	
Initial commit
	
Jan 26, 2022
README.md
	
Update ReadMe
	
Sep 1, 2022
package.json
	
Chore: Switch to pnpm
	
Sep 6, 2024
pnpm-lock.yaml
	
Chore: Switch to pnpm
	
Sep 6, 2024
ruleset-recommended.yaml
	
Feat: Set up linting with vacuum and fix all errors
	
Jul 4, 2024
vacuum.conf.yaml
	
Feat: Set up linting with vacuum and fix all errors
	
Jul 4, 2024
Repository files navigation

README

    MIT license

Paystack OpenAPI Specification

License: MIT

The OpenAPI specification for the Paystack API.
Getting Started

The OpenAPI specification provides another alternative to test the Paystack API. You can download the specification and make use of it on:

    SwaggerHub
    OpenAPI (Swagger) Editor

Components

There are three main folders of interest in this repo:

    main: This contains a comprehensive specification of the Paystack API:
        resources: This contains individual endpoints in each API category
        responses: This contains the models for responses
        schemas: This contains models for each endpoint
        paystack.yml: This is the entry point for all components
    dist: Not all OpenAPI readers can read from different file sources, so we built a single file from all the components in the main directory.
    sdk: This is a single file specification being used for client library generation. It contains just enough parameters for our client libraries.
    use_cases: This is a collection of specifications containing APIs for common use cases of the Paystack API. For example, the wallet.yaml contains the APIs needed to build a wallet feature into your application. The specifications in this directory are used to create the collections in our Postman Workspace.

Contributing

Here are some of the ways to contribute to this repository:

    Create a use case
    Raise an issue
    Suggest an improvement

Issues

Kindly open an issue if you discover any bug or have problems using this library.
License
This repository is made available under the MIT license. Kindly read the LICENSE file for more information.


https://www.postman.com/paystack-developers/paystack-api/overview
