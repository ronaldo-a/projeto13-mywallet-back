# MyWallet (Back-end)
Back-end for MyWallet app. You can find the app front-end here: https://github.com/ronaldo-a/projeto13-mywallet-front

## About

<h3>Features</h3>

 * Create an account and login to use app
 * After login using a device, you keep logedin until you use the logout button, even leaving the browser or updating page
 * Mainpage shows saved incomings and withdraws with description, date and amount of each transaction, besides current balance. You can also delete transactions.  
 * Separated buttons take user to new incoming or withdraw insert screen. 
 
 <h3>Motivation</h3>
 
 Use all front-end and back-end tools studied until the moment in my first full-stack project.
 
 <h3>Technologies</h3>
 
 Node.js, Express, Joi, Bcrypt, uuid and MongoDB.  

<h3>How to run</h3>
  
  1. You need to connect to a running MongoDB server to run this app.
    
     1.1: To connect the app with the database, in your ".env" file, set the variable "MONGO_URI" with your mongoDB server uri.

  2. Clone this repository
  3. Install all dependencies
  
       ```bash
           npm i
        ```
      
  3. Run app
  
      ```bash
        node index.js
      ```
