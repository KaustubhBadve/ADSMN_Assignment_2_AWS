# ADSMN_Assignment_2

This assignment is entirely backend-focused, leveraging robust frameworks, JavaScript libraries, SQL database, and AWS features including API Gateway, AWS Lambda, and S3 bucket. The primary objective is to create a game platform with comprehensive functionalities.

# Features

<ul>User Registration and Authentication </ul>
<li>User can easily registered by passing valid active OTP and some basic details</li>
<li>JWT tokens are generated upon successful registration for both authentication and authorization purposes.</li>
<br>
<ul>Dashboard Features</ul>
<li>Users are limited to saving their score a maximum of three times per day, between midnight (12:00 AM) and the following midnight (12:00 AM).</li>
<li>Users have the capability to retrieve their overall score accumulated until the current date, along with their ranking among all other users.</li>
<li>Users also have access to week-wise reports, where they can view the week's number, the total score for that week, and their ranking among other users for that specific week. (Week 1 starts from March 1st, and subsequent weeks are calculated accordingly)</li>
<br>

# Access Postman Collection

<ul>Detailed API documentation is accessible through Postman. Simply import the following URL into Postman to gain access to the Postman collection for this assignment:</ul>
<li>This assignment has been deployed using AWS services, including AWS API Gateway, Lambda, and S3. These services provide scalable and efficient infrastructure for hosting the backend application. Furthermore, the database has been deployed to AWS RDS, ensuring efficient data management and accessibility.</li>
<li><a href="https://api.postman.com/collections/20520271-8895071a-814c-4345-9904-3fb7a31d16ac?access_key=PMAT-01HRYTH25QX7DSK9WP48FBQPRT">Postman Collection URL</a></li>


# API Documentation
<ul>For the savescore, userprogress, and weeklyreport APIs, a distinct Bearer token is required. Users can obtain this token after a successful registration or login process.</ul>
<li>  POST : /api/sendotp - For user registration as well as login otp generation api</li>
<li>  POST : /api/registration - For user registration with unique mobileNo, email, name and OTP</li>
<li>  POST : /api/login - To Login by passing mobileNo and OTP</li>
<li>  POST : /api/savescore - To save score of given user(3 times max per day)</li>
<li>  GET  : /api/userprogress - To retrive overall user score and ranking among all other users.</li>
<li>  GET  : /api/weeklyreport  - To retrieve a week-wise report for a given user, this api provides the week's name, the total score for that week, and the user's ranking among other users for that specific week.</li>


# Technologies Used
<li>Node.js</li>
<li>Express.js</li>
<li>JWT (JSON Web Tokens): Authentication and authorization mechanism./li>
<li>MySQL: Relational database management system.</li>
<li>Sequelize: ORM for MySQL</li>
<li>express-validator : express middleware for better error handling</li>
<li>AWS Feautures - LAMBDA Function, API-GATEWAY, S3 Bucket, RDS</li>


# Getting Started
<li>Clone the repository.</li>
<li>Navigate to the project directory.</li>
<li>Install dependencies: npm install</li>
<li>The index.js file contains the handler function for AWS Lambda, where can find the logic for each route of the given backend application</li>
