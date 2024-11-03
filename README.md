# Three week project

> [!NOTE]
> As the title says, this project was built in three weeks as a school task. Expect some bugs and inefficient code.

## Requirements

> [!NOTE]
> This part was heavily copied from our task notes, but obviously not verbatim.

- Have a portal with a system in place so that the user can create an acocunt and log in with 2fa.
- Have a few *basic* games for the user to enjoy.
- Have a leaderboard and a display of game popularity, as a pie chart.

## Plan

- Website
  - Svelte
    - Somewhat new to the framework, but I have used it for smaller applications and I am planning on using it for my term task.
  - Should follow the [Nord theme](https://nordtheme.com), because that is the colour palette I prefer
  
- Snake
  - A copy of snake, a "snake" travels around in a field, trying to eat apples along the way.
  - The game board expands once the board is full, and the snake goes back to its initial size. This way, we can insure the game can theoretically go on forever.

- Clicker game
  - A "clone" of cookie clicker. Clicking a button, and having the score go up.
  - Autoclickers allowing the player to get more points faster.

- Platformer
  - The player is trying to get through all the levels in as short of a time as possible. Points are logged as by how __short__ time it takes.
  - Sliding and keeping your momentum should be central in the movement.

## Results

- The website
  - Svelte had a major update in the middle of the project, which ended up with me having to port the entire project over, but this also helped me understand the framework even further.
- Finished all three planned games, with time to spare (to do some polish to the games and the app itself)
  - Neoclicker and Snake stays almost untouched since halfway through the first week (as of 2 weeks in), only being edited to work with the leaderboard and to port the project to Svelte 5.
  - Parkour
    - Managed to add multiple extra features, like a parallaxing background and a level editor.

## Using

|Prerequisites
|-
|[Node.js](https://nodejs.org)


### Production

1. Clone this repository
2. Install packages by running `npm install`
3. Build the project by running `npm run build`
4. To start the server, run `ORIGIN=http://[<YOUR IP ADDRRESS>]:3000 node build/index.js`.
5. Make another server application forward requests to the server.
    - Note these might not work 100%, I only skimmed through them (and i only really use nginx)
    - [Nginx](https://docs.nginx.com/nginx/admin-guide/web-server/reverse-proxy/)
    - [Apache](https://httpd.apache.org/docs/2.4/mod/mod_proxy.html)

### For development

1. Clone this repository
2. Install packages by running `npm install`
3. Start the development server by running `npm run dev`
4. Open <http://localhost:5173>
