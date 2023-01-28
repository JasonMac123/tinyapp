# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly). It uses cookie-sessions 
tracking users and their urls. Made with ejs templates to render pages and scripts for server-side rendering. Tracks how many times a link is visisted,
how many unique visitors, and displays a list of users clicking on the link and the date.


## Final Product

!["Screenshot of URLs page"](https://github.com/JasonSnow123/tinyapp/blob/main/docs/TinyApp_URLPage.png?raw=true)
!["Screenshot of editing Url page"](https://github.com/JasonSnow123/tinyapp/blob/main/docs/TinyApp_EditingURL.png?raw=true)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session
- method-override
- dotenv

## Getting Started

- Install all dependencies (using the `npm install` command).
- Uses the environment variables from the .env file for the keys for the cookies
- Need to create a .env file and set environment variables to run the server
- Cookie keys have been set already
- Run the development web server using the `node express_server.js` command.
