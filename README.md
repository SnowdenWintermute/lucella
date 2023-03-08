# Battle School

#### A simple [Real-time strategy](https://en.wikipedia.org/wiki/Real-time_strategy) game in the web browser with ranked matchmaking

Visit the live demo at [battleschool.io](https://battleschool.io)

[![Tests](https://github.com/SnowdenWintermute/lucella/actions/workflows/tests.yml/badge.svg?event=pull_request)](https://github.com/SnowdenWintermute/lucella/actions/workflows/tests.yml)

[![Deployment](https://github.com/SnowdenWintermute/lucella/actions/workflows/deployment.yml/badge.svg)](https://github.com/SnowdenWintermute/lucella/actions/workflows/deployment.yml)

## Built With

- [Socket.IO](https://socket.io/docs/v4//) - for chat and muliplayer game packets
- [Protocol Buffers](https://developers.google.com/protocol-buffers/) - for packet serialization
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Next.js](https://nextjs.org/)
- [Matter.js](https://brm.io/matter-js/) - a 2D physics engine for the web

## How to set get set up for development 💻

- Install and set up VS Code

  - Install the following extensions: "Prettier - Code formatter", "ESlint"
  - Optional but useful extension: "ES7+ React/Redux/React-Native snippets"
  - Open VS Code settings
  - Enable "Format on Save" option
  - Set "Default Formatter" option to prettier
  - Set "Print Width" option to 160

- Install nodejs
- Install typescript globally using the terminal
  > npm install -g typescript
- Install yarn (npm will not work because packages are managed with yarn workspaces)
  > npm install --global yarn
- Install docker (linux) or docker desktop (windows/mac)

  - Ubuntu: https://docs.docker.com/engine/install/ubuntu/
  - Windows: must enable WSL2 and install a linux distro in the linux subsystem: https://learn.microsoft.com/en-us/windows/wsl/install

- Clone the repository https://github.com/SnowdenWintermute/lucella.git
- Open a terminal in the top level directory of the cloned repo and run
  > yarn install
- Create a .env.local.development file and a cypress.env.json file in client package folder, and a .env file in the top level directory based on the templates provided. **DO NOT delete the templates. Contact mike for api keys.**
- Launch docker desktop (if on windows/mac) or check that docker is running (linux)
  _ On windows you may need to click the bug icon then "clean / purge data" to get docker desktop to start
  _ Open a terminal in the top level directory and run
  > docker compose -f docker-compose.dev.yml up -d
      * Then run
  > docker ps
      * you should see that the client, server, redis, postgres and toxiproxy containers are now running.
- Go to the /packages/server directory and run the following migration command found in the env template, making sure to replace the name, password and dbname with the variables you assigned in the .env file. This will add all the tables and enums to your postgres local volume (local storage managed by docker).

  > DATABASE_URL=postgres://username:password@localhost:5432/dbname yarn run migrate up

- Install pgAdmin: https://www.pgadmin.org/download/
- Open pgAdmin and add a new server. Address should be localhost and user/password should be the same you used for migrations (same as you put in the server .env file)
- Create a new database named "lucella-test" under the server you added. This will be used by the jest tests.
- Go to the /packages/server directory and run yarn test --watchAll to run all the jest automated tests, they should be passing
- Go to the /packages/client directory and run the following command to launch cypress (a frontend testing framework) for the first time
  > yarn cypress open
- Make sure you created a cypress.env.json and filled it in from the template in the client package
- Close cypress and while still in the client directory run
  > yarn cypress:open
- Commands such as yarn cypress:firefox, or yarn cypress:edge can save you time when opening cypress. You can add other commands in the client package.json using this pattern for the browser you prefer.
- Cypress should open, run all the specs. They should be passing.
- Visit [localhost:3000](http://localhost:3000) in your browser. You should see the website.
  - Click login and then create new account using an email address you can access
  - Click the link in your email to complete registration
- To make your dev user an admin, go to pgAdmin and select your main (not test) database.
  - Right click "schemas" then select query tool. Type
    > SELECT \* FROM users;
  - Click play button or hit f5, you should see your user.
  - Find the column "role" and double click where it says "user". Change it to say "admin".
  - Find and click the "save changes" button or hit f6
  - Go back to the website and refresh. Now when you right click on a user in the left chat sidebar you should see options to ban users.

## Common Error Messages

- Module parse failed: Unexpected token (8:7)
  You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
  - SOLUTION: Search for any "/dist" or "/src" that were added automatically added to import paths by vs code and remove them. Our importing method must use a generic path so it works both in the typescript server editor and after it has been compiled to js.
- code: 'MODULE_NOT_FOUND'
  - SOLUTION: If you created something in the common package and did not export it from common's index.ts, it won't be seen by other packages. All exports from common must be done like this { thingToExport } and cannot be default exports. VS Code's autoimport will still "work" though, and create an incorrect import string (see the error message before this one).
