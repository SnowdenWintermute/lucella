# Lucella - Battle Room

#### A simple [Real-time strategy](https://en.wikipedia.org/wiki/Real-time_strategy) in the web browser game with ranked matchmaking

Visit the live demo at [lucella.org](https://lucella.org)

![CI Workflow Badge](https://github.com/SnowdenWintermute/lucella/actions/workflows/ci.yml/badge.svg)

## Built With

- [Socket.IO](https://socket.io/docs/v4//) - for chat and muliplayer game packets
- [Protocol Buffers](https://developers.google.com/protocol-buffers/) - for packet serialization
- [Redis](https://redis.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Next.js](https://nextjs.org/)
- [Matter.js](https://brm.io/matter-js/) - a 2D physics engine for the web

## How to set get set up for development 💻

- Install and set up VS Code
  - Install the following extensions: "Prettier - Code formatter", "ESlint", "Live Sass Compiler"
  - Optional but useful extension: "ES7+ React/Redux/React-Native snippets"
  - Open VS Code settings
  - Enable "Format on Save" option
  - Set "Default Formatter" option to prettier
  - Set "Print Width" option to 160
  - Select Extensions -> Live Sass Compiler -> Edit settings in JSON, then add

```json
  "liveSassCompile.settings.formats": [
    {
	"format": "expanded",
	"extensionName": ".css",
	"savePath": "/packages/client/styles/sassOutput"
    }
]
```

- Install nodejs
- Install typescript globally using the terminal
  > npm install -g typescript
- Install yarn (npm will not work because packages are managed with yarn workspaces)
  > npm install --global yarn
- Install docker (linux) or docker desktop (windows/mac)
  - Linux must install docker-compose seperately
  - Windows must enable WSL2 and install a linux distro in the linux subsystem: https://learn.microsoft.com/en-us/windows/wsl/install
- Install protoc - (some versions are broken with the npm package we use, this one seems to be working: https://github.com/protocolbuffers/protobuf/releases/tag/v3.19.6)
  - If on windows, add protoc to the path environtment variable and restart computer: https://zwbetz.com/how-to-add-a-binary-to-your-path-on-macos-linux-windows/#windows-gui
- Clone the repository https://github.com/SnowdenWintermute/lucella.git
- Open a terminal in the top level directory of the cloned repo and run
  > yarn install
- Create .env files in client and server package folders based on the templates provided. **DO NOT delete the templates. Contact mike for api keys.**
- Launch docker desktop (if on windows/mac) or check that docker server is running (linux)
  _ On windows you may need to click the bug icon then "clean / purge data" to get docker desktop to start
  _ If on windows or mac, open a terminal in the /packages/server directory and run
  > docker compose up -d
      * if on linux, instead run
  > docker-compose up -d
      * Then run
  > docker ps
      * you should see that the redis and postgres containers are now running.
- Open a terminal or cd into /packages/common directory and run
  > tsc
- Open vs code in the top level directory and click "watch sass" in the bottom blue bar. Confirm that files were compiled in /packages/client/styles/sassOutput folder.
- Run tsc from the /packages/common directory
- Go to the /packages/server directory and run the following migration command found in the env template. This will add all the tables and enums to your postgres instance.
  > DATABASE_URL=postgres://username:password@localhost:5432/dbname yarn run migrate up) from the /packages/server directory, making sure to replace the name, password and dbname with the variables you assigned in the .env file. This adds all the tables and enums to your local postgres instance.
- Go to the top level directory of the repo and if on linux or mac run
  > yarn dev
- If you are on windows, instead run
  > dev-windows
- The above command uses a different script to compile protobuf files. It should auto-compile the protobuf and watch typescript in all packages for changes and automatically recompile to js and restart the server.
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
