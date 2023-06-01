# ChatApp

This is a real-time messaging application that allows you to create channels, register users, edit users, log in, log out, and have profile pictures. It is built using the following technologies:

- HTML
- CSS
- JavaScript
- EJS (Embedded JavaScript)
- Socket.IO
- Express

## Features

- Channel Creation: You can create chat channels for different topics or groups.
- User Registration: Users can register in the application by providing their username, email, and password.
- User Editing: Users can edit their profile, including their username, email, and profile picture.
- Login: Users can log in to the application using their email and password.
- Logout: Users can log out of the application to keep their account secure.
- Profile Pictures: Users can upload and display profile pictures on their user profile.

## Technologies Used

### HTML
HTML is used to create the structure and content of the application's web pages.

### CSS
CSS is used to style and design the application's web pages, allowing customization of element appearance and providing a pleasant visual experience.

### JavaScript
JavaScript is used to add interactivity to the application. It enables actions such as sending real-time messages, validating forms, handling events, and dynamically updating page content.

### EJS (Embedded JavaScript)
EJS is a template engine that allows dynamically generating HTML using JavaScript. It is used in this application to render views and dynamically display data.

### Socket.IO
Socket.IO is a JavaScript library that facilitates bidirectional real-time communication between the server and the client. It is used in this application to enable real-time chat between users.

### Express
Express is a Node.js web application framework that simplifies web application development. It is used in this application to create the server, handle routes, and manage HTTP requests and responses.

## System Requirements

- Modern web browser compatible with HTML5, CSS3, and JavaScript.
- Node.js installed in the development environment.

## Installation

1. Clone the application repository.
2. Open a terminal and navigate to the root directory of the application.
3. Run the following command to install the dependencies:

   ```
   npm install
   ```

4. Go to the `config.js` file and configure a port.

5. Set the following environment variables:
- MONGO_URI=`YourMongoDBURIHere`
- SESSION_SECRET=`YourSessionSecretHere`

6. Run the following command to start the application:

   ```
   npm start
   ```

7. Open a web browser and access the application at `http://localhost:PORT`.

## Contributions

Contributions are welcome. If you would like to contribute to the development of this application, you can submit pull requests with your enhancements, bug fixes, or other improvements.