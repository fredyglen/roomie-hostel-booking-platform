Name	Last commit message
	Last commit date
Andrew-Paystack
Andrew-Paystack
Merge pull request #103 from PaystackOSS/fix/update-preauth
bf6cb56
 · 
May 29, 2025
.github/workflows
	
Add file for workflow
	
Jun 26, 2023
dist
	
update preauth responses
	
May 29, 2025
src
	
update preauth responses
	
May 29, 2025
.gitignore
	
Chore: Update .gitignore
	
May 12, 2023
README.md
	
Reset head
	
Jun 7, 2023
package-lock.json
	
Implement language merge for doc
	
May 10, 2023
package.json
	
Reset head
	
Jun 7, 2023
Repository files navigation

    README

Paystack Logo
Paystack's Documentation Code Snippets

Code snippets for the Paystack's Developer Documentation. This aim of this project is to separate code snippets from the design and content of the documentation so code management processes can be put in place to ensure code correctness.
🚀 Quick start

Clone repo

# Clone repo
git clone git@github.com:PaystackOSS/doc-code-snippets.git

Install dependencies

Navigate into the project folder and run the command below

# Install dependencies
npm install

Open the source code and start editing!

Open the project in your code editor and make the required changes. When done, run the command below:

# Build dist
npm run build

You can now push and open a PR if you want to contribute to the project.
🧱 Code structure

Here's a high-level overview of the directories and files in this project:

.
├── .github
├── dist
├── node_modules
├── src
   ├── api
   ├── doc
   ├── index.js
├── .gitignore
├── package-lock.json
├── package.json
└── README.md

    .github: This directory contains the workflow to notify the documentation when a change occurs.

    dist: This directory contains the JS literals and JSON that the documentation can consume directly (You shouldn't change the content of this directory manually).

    /node_modules: This directory contains all of the modules of code that your project depends on (npm packages) are automatically installed.

    /src: This directory contains the code snippets in the default language for the documentation (doc), the API Reference (api) and an index.js file that converts contents of both directories into the dist directory.

    .gitignore: This file tells git which files it should not track / not maintain a version history for.

    package-lock.json (See package.json below, first). This is an automatically generated file based on the exact versions of your npm dependencies that were installed for your project. (You won’t change this file directly).

    package.json: A manifest file for Node.js projects, which includes things like metadata (the project’s name, author, etc). This manifest is how npm knows which packages to install for your project.

    README.md: A text file containing useful reference information about the project.
