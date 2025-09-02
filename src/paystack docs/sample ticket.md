Name	Last commit message
	Last commit date
damilola-paystack
damilola-paystack
Add demo
7547e84
 · 
Aug 7, 2020
.idea
	
Add README
	
Aug 5, 2020
app
	
Implement form for card details
	
Aug 3, 2020
gradle/wrapper
	
Implement form for card details
	
Aug 3, 2020
.gitignore
	
Remove ignored files
	
Feb 3, 2020
README.md
	
Add demo
	
Aug 7, 2020
build.gradle
	
Implement form for card details
	
Aug 3, 2020
gradlew
	
Initialize project
	
Feb 2, 2020
gradlew.bat
	
Initialize project
	
Feb 2, 2020
sample_movie_ticket.gif
	
Add demo
	
Aug 7, 2020
settings.gradle
	
Initialize project
	
Feb 2, 2020
Repository files navigation

    README

sample-movie-ticket

A simple application that shows how to integrate Paystack into your Android app.

Project setup

This project makes use of the MovieDB API to fetch movies. Here are the steps for setting up the project

    Create an account on MovieDB. You need an API key to make requests to MovieDB
    Clone this project and open in Android Studio
    Open the gradle.properties file and add the following params:
        MOVIE_DB_API_KEY="your_movie_db_api_key"
        PSTK_PUBLIC_KEY="your_paystack_public_key"
    Sync project
    Run project when sync is successful

Code Structure

The project made use of the default Android architecture and the Java programming language. The project package consists of the following directories:

    adapter: This contains custom adapters for the recycler views
    model: This contains the custom types for data returned from network calls
    network: This contains the network configurations and API endpoints
    utils: This holds classes that are used in multiple places
    view: This holds all the activities code. There are four activities used in this project
