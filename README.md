<h1 align='center'>A simplified version of an inhouse enterprise management system build with a nodeJS backend and a React frontend</h1>

<div align='center'>Auto formatted with Prettier, not yet tested</div>

<div>To be used in conjunction with the frontend <a href="https://github.com/FrancoisvanRensburg/ems_frontend.git">React Frontend</a></div>

## What is this and who is this for 🤷‍♀️

I am a chemical engineer turned management consultant turned web developer that realised that there are no business vision, resource and project management tools available that is either not scalable, doesn't require a tech wizz to set up, keeps track of a company vision and manages resources effectively available that can manage projects in either traditional prince2 and agile methodologies.

This public repo, built in my spare time, is a section of the project to showcase my web development abilities. It’s a very good example of a modern, real-world, web development codebase. This is the backend, built with express and mongoDB.

There are many showcase/example React projects out there but most of them are way too simple. I like to think that this codebase contains enough complexity to offer valuable insights to React developers of all skill levels while still being _relatively_ easy to understand.

## Features

- Proven, scalable, and easy to understand project structure,
- REST Api build wit express
- JWT authentication
- Written in modern javascript
- Dual linked database models to improve query performance

## Setting up dev environment

- Install a local instance of mongo or use mongo atlas uri to store data if you don’t have it set up already.
- Clone this repo with git
- Create a .env file in the root directory containing:
  o NODE_END=development
  o PORT=5000
  o DATABASE={insert your uri}
- Run npm install
- Run npm start, your local server should run on port 5000

## Authentication system

Currently JWT web token is used without the activation through sendgrid or nodemon for the dev environment
