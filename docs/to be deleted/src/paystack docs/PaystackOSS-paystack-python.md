
https://github.com/PaystackOSS/paystack-python


Code
Issues 1
Pull requests
Actions
Projects
Security

    Insights

PaystackOSS/paystack-python
Name	Last commit message
	Last commit date
damilola-paystack
damilola-paystack
Merge pull request #8 from johnugbor/patch-1
d95dc8d
 · 
Apr 3, 2025
.github
	
Add Issue and PR templates
	
Sep 1, 2022
.openapi-generator
	
Chore: Clean up for publishing
	
Jun 8, 2022
docs
	
Fix customer validation method with typo in method name
	
Sep 28, 2022
paystack
	
Fix customer validation method with typo in method name
	
Sep 28, 2022
test
	
Chore: Clean up for publishing
	
Jun 8, 2022
.gitignore
	
Add Issue and PR templates
	
Sep 1, 2022
.gitlab-ci.yml
	
Feat: Generate alpha version of library
	
Mar 10, 2022
.openapi-generator-ignore
	
Chore: Clean up for publishing
	
Jun 8, 2022
.travis.yml
	
Feat: Generate alpha version of library
	
Mar 10, 2022
LICENSE
	
Initial repo setup
	
Mar 3, 2022
README.md
	
Update README.md
	
Apr 2, 2025
git_push.sh
	
Feat: Generate alpha version of library
	
Mar 10, 2022
requirements.txt
	
Feat: Generate alpha version of library
	
Mar 10, 2022
setup.cfg
	
Feat: Update ReadME
	
Apr 7, 2022
setup.py
	
Fix customer validation method with typo in method name
	
Sep 28, 2022
test-requirements.txt
	
Feat: Generate alpha version of library
	
Mar 10, 2022
test.py
	
Feat: Generate alpha version of library
	
Mar 10, 2022
tox.ini
	
Feat: Generate alpha version of library
	
Mar 10, 2022
Repository files navigation

README

    MIT license

paystack

A Python client library for consuming the Paystack API.
Prerequisite

This library is supported on Python 2.7 and 3.4+. Also, you need to create a Paystack account, if you don't have one already, to get your test and live secret keys.
Installation

pip install paystack-sdk

You may need to run pip with root permission: sudo pip install
Getting Started

import paystack
from pprint import pprint

paystack.api_key = 'sk_domain_xxxxx'

response = paystack.Customer.create(
        email="larry@james.com",
        first_name="Larry",
        last_name="James"
    )
pprint(response)

Documentation for API Endpoints

All URIs are relative to https://api.paystack.co
Class 	Method 	HTTP request 	Description
Balance 	fetch 	GET /balance 	Fetch Balance
Balance 	ledger 	GET /balance/ledger 	Balance Ledger
BulkCharge 	charges 	GET /bulkcharge/{code}/charges 	Fetch Charges in a Batch
BulkCharge 	fetch 	GET /bulkcharge/{code} 	Fetch Bulk Charge Batch
BulkCharge 	initiate 	POST /bulkcharge 	Initiate Bulk Charge
BulkCharge 	list 	GET /bulkcharge 	List Bulk Charge Batches
BulkCharge 	pause 	GET /bulkcharge/pause/{code} 	Pause Bulk Charge Batch
BulkCharge 	resume 	GET /bulkcharge/resume/{code} 	Resume Bulk Charge Batch
Charge 	check 	GET /charge/{reference} 	Check pending charge
Charge 	create 	POST /charge 	Create Charge
Charge 	submit_address 	POST /charge/submit_address 	Submit Address
Charge 	submit_birthday 	POST /charge/submit_birthday 	Submit Birthday
Charge 	submit_otp 	POST /charge/submit_otp 	Submit OTP
Charge 	submit_phone 	POST /charge/submit_phone 	Submit Phone
Charge 	submit_pin 	POST /charge/submit_pin 	Submit PIN
Customer 	create 	POST /customer 	Create Customer
Customer 	deactivate_authorization 	POST /customer/deactivate_authorization 	Deactivate Authorization
Customer 	fetch 	GET /customer/{code} 	Fetch Customer
Customer 	list 	GET /customer 	List Customers
Customer 	risk_action 	POST /customer/set_risk_action 	White/blacklist Customer
Customer 	update 	PUT /customer/{code} 	Update Customer
Customer 	validate 	POST /customer/{code}/identification 	Validate Customer
DedicatedVirtualAccount 	add_split 	POST /dedicated_account/split 	Split Dedicated Account Transaction
DedicatedVirtualAccount 	available_providers 	GET /dedicated_account/available_providers 	Fetch Bank Providers
DedicatedVirtualAccount 	create 	POST /dedicated_account 	Create Dedicated Account
DedicatedVirtualAccount 	deactivate 	DELETE /dedicated_account/{account_id} 	Deactivate Dedicated Account
DedicatedVirtualAccount 	fetch 	GET /dedicated_account/{account_id} 	Fetch Dedicated Account
DedicatedVirtualAccount 	list 	GET /dedicated_account 	List Dedicated Accounts
DedicatedVirtualAccount 	remove_split 	DELETE /dedicated_account/split 	Remove Split from Dedicated Account
Dispute 	download 	GET /dispute/export 	Export Disputes
Dispute 	evidence 	POST /dispute/{id}/evidence 	Add Evidence
Dispute 	fetch 	GET /dispute/{id} 	Fetch Dispute
Dispute 	list 	GET /dispute 	List Disputes
Dispute 	resolve 	PUT /dispute/{id}/resolve 	Resolve a Dispute
Dispute 	transaction 	GET /dispute/transaction/{id} 	List Transaction Disputes
Dispute 	update 	PUT /dispute/{id} 	Update Dispute
Dispute 	upload_url 	GET /dispute/{id}/upload_url 	Get Upload URL
Integration 	fetch_payment_session_timeout 	GET /integration/payment_session_timeout 	Fetch Payment Session Timeout
Integration 	update_payment_session_timeout 	PUT /integration/payment_session_timeout 	Update Payment Session Timeout
Page 	add_products 	POST /page/{id}/product 	Add Products
Page 	check_slug_availability 	GET /page/check_slug_availability/{slug} 	Check Slug Availability
Page 	create 	POST /page 	Create Page
Page 	fetch 	GET /page/{id} 	Fetch Page
Page 	list 	GET /page 	List Pages
Page 	update 	PUT /page/{id} 	Update Page
PaymentRequest 	archive 	POST /paymentrequest/archive/{id} 	Archive Payment Request
PaymentRequest 	create 	POST /paymentrequest 	Create Payment Request
PaymentRequest 	fetch 	GET /paymentrequest/{id} 	Fetch Payment Request
PaymentRequest 	finalize 	POST /paymentrequest/finalize/{id} 	Finalize Payment Request
PaymentRequest 	list 	GET /paymentrequest 	List Payment Request
PaymentRequest 	notify 	POST /paymentrequest/notify/{id} 	Send Notification
PaymentRequest 	totals 	GET /paymentrequest/totals 	Payment Request Total
PaymentRequest 	update 	PUT /paymentrequest/{id} 	Update Payment Request
PaymentRequest 	verify 	GET /paymentrequest/verify/{id} 	Verify Payment Request
Plan 	create 	POST /plan 	Create Plan
Plan 	fetch 	GET /plan/{code} 	Fetch Plan
Plan 	list 	GET /plan 	List Plans
Plan 	update 	PUT /plan/{code} 	Update Plan
Product 	create 	POST /product 	Create Product
Product 	delete 	DELETE /product/{id} 	Delete Product
Product 	fetch 	GET /product/{id} 	Fetch Product
Product 	list 	GET /product 	List Products
Product 	update 	PUT /product/{id} 	Update product
Refund 	create 	POST /refund 	Create Refund
Refund 	fetch 	GET /refund/{id} 	Fetch Refund
Refund 	list 	GET /refund 	List Refunds
Settlement 	fetch 	GET /settlement 	Fetch Settlements
Settlement 	transaction 	GET /settlement/{id}/transaction 	Settlement Transactions
Split 	add_subaccount 	POST /split/{id}/subaccount/add 	Add Subaccount to Split
Split 	create 	POST /split 	Create Split
Split 	fetch 	GET /split/{id} 	Fetch Split
Split 	list 	GET /split 	List/Search Splits
Split 	remove_subaccount 	POST /split/{id}/subaccount/remove 	Remove Subaccount from split
Split 	update 	PUT /split/{id} 	Update Split
Subaccount 	create 	POST /subaccount 	Create Subaccount
Subaccount 	fetch 	GET /subaccount/{code} 	Fetch Subaccount
Subaccount 	list 	GET /subaccount 	List Subaccounts
Subaccount 	update 	PUT /subaccount/{code} 	Update Subaccount
Subscription 	create 	POST /subscription 	Create Subscription
Subscription 	disable 	POST /subscription/disable 	Disable Subscription
Subscription 	enable 	POST /subscription/enable 	Enable Subscription
Subscription 	fetch 	GET /subscription/{code} 	Fetch Subscription
Subscription 	list 	GET /subscription 	List Subscriptions
Subscription 	manage_email 	POST /subscription/{code}/manage/email 	Send Update Subscription Link
Subscription 	manage_link 	POST /subscription/{code}/manage/link 	Generate Update Subscription Link
Transaction 	charge_authorization 	POST /transaction/charge_authorization 	Charge Authorization
Transaction 	check_authorization 	POST /transaction/check_authorization 	Check Authorization
Transaction 	download 	GET /transaction/export 	Export Transactions
Transaction 	event 	GET /transaction/{id}/event 	Get Transaction Event
Transaction 	fetch 	GET /transaction/{id} 	Fetch Transaction
Transaction 	initialize 	POST /transaction/initialize 	Initialize Transaction
Transaction 	list 	GET /transaction 	List Transactions
Transaction 	partial_debit 	POST /transaction/partial_debit 	Partial Debit
Transaction 	session 	GET /transaction/{id}/session 	Get Transaction Session
Transaction 	timeline 	GET /transaction/timeline/{id_or_reference} 	Fetch Transaction Timeline
Transaction 	totals 	GET /transaction/totals 	Transaction Totals
Transaction 	verify 	GET /transaction/verify/{reference} 	Verify Transaction
Transfer 	bulk 	POST /transfer/bulk 	Initiate Bulk Transfer
Transfer 	disable_otp 	POST /transfer/disable_otp 	Disable OTP requirement for Transfers
Transfer 	disable_otp_finalize 	POST /transfer/disable_otp_finalize 	Finalize Disabling of OTP requirement for Transfers
Transfer 	download 	GET /transfer/export 	Export Transfers
Transfer 	enable_otp 	POST /transfer/enable_otp 	Enable OTP requirement for Transfers
Transfer 	fetch 	GET /transfer/{code} 	Fetch Transfer
Transfer 	finalize 	POST /transfer/finalize_transfer 	Finalize Transfer
Transfer 	initiate 	POST /transfer 	Initiate Transfer
Transfer 	list 	GET /transfer 	List Transfers
Transfer 	resend_otp 	POST /transfer/resend_otp 	Resend OTP for Transfer
Transfer 	verify 	GET /transfer/verify/{reference} 	Verify Transfer
TransferRecipient 	bulk 	POST /transferrecipient/bulk 	Bulk Create Transfer Recipient
TransferRecipient 	create 	POST /transferrecipient 	Create Transfer Recipient
TransferRecipient 	fetch 	GET /transferrecipient/{code} 	Fetch Transfer recipient
TransferRecipient 	list 	GET /transferrecipient 	List Transfer Recipients
TransferRecipient 	transferrecipient_code_delete 	DELETE /transferrecipient/{code} 	Delete Transfer Recipient
TransferRecipient 	transferrecipient_code_put 	PUT /transferrecipient/{code} 	Update Transfer recipient
Verification 	avs 	GET /address_verification/states 	List States (AVS)
Verification 	fetch_banks 	GET /bank 	Fetch Banks
Verification 	list_countries 	GET /country 	List Countries
Verification 	resolve_account_number 	GET /bank/resolve 	Resolve Account Number
Verification 	resolve_card_bin 	GET /decision/bin/{bin} 	Resolve Card BIN
Documentation For Models

    Accepted
    Bank
    BulkChargeInitiate
    ChargeCreate
    ChargeSubmitAddress
    ChargeSubmitBirthday
    ChargeSubmitOTP
    ChargeSubmitPhone
    ChargeSubmitPin
    CustomerCreate
    CustomerDeactivateAuthorization
    CustomerRiskAction
    CustomerUpdate
    CustomerValidate
    CustomerValidation
    DedicatedVirtualAccountCreate
    DedicatedVirtualAccountSplit
    DisputeEvidence
    DisputeResolve
    DisputeUpdate
    EFT
    Error
    MobileMoney
    PageCreate
    PageProduct
    PageUpdate
    PaymentRequestCreate
    PaymentRequestUpdate
    PlanCreate
    PlanUpdate
    ProductCreate
    ProductUpdate
    RefundCreate
    Response
    SplitCreate
    SplitSubaccounts
    SplitUpdate
    SubaccountCreate
    SubaccountUpdate
    SubscriptionCreate
    SubscriptionToggle
    TransactionChargeAuthorization
    TransactionCheckAuthorization
    TransactionInitialize
    TransactionPartialDebit
    TransferBulk
    TransferFinalize
    TransferFinalizeDisableOTP
    TransferInitiate
    TransferRecipientBulk
    TransferRecipientCreate
    TransferRecipientUpdate
    TransferResendOTP
    USSD
    VerificationBVNMatch

Issues