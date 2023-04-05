// LOBBY TESTS

// battle room game (casual)
//  - when a user disconnects from the game, they cede the game to their opponent
//  - a score screen is shown in the lobby with player names and scores
//  - score sceen should indicate the game had no effect on ladder ratings or rank
//  - pressing escape closes the score screen
// game list menu
//  - pressing escape closes the game list menu and puts the user back in the main menu
//  - if no games are being hosted, show a message "no games found"
//  - pressing the refresh button updates the game list
//  - full games in the list have their join button disabled
//  - clicking join on a full game (possible if haven't updated game list) shows "game is full" alert and updates game list
//  - clicking join on a game with an open spot shows join button loading then places user in game room menu

// matchmaking queue menu
//  - clicking ranked when not logged in displays "create an account to play ranked" alert
//  - clicking ranked while logged in places user in matchmaking queue menu
//  - matchmaking queue menu displays number of players in queue and current elo diff message
//  - when a new user joins the queue, the players in queue and elo threshold numbers update
//  - when a user leaves the queue, the players in queue and elo diff threshold numbers update
//  - upon finding a match, queue shows match found and game coutdown
//  - if too many games are being played, a waiting list status is shown
//  - if a user leaves the matchmaking queue after being matched (during game start countdown), the player they were matched with is placed back in the queue and their previous chat channel
//  - if a user leaves the matchmaking queue after being matched (during waiting list), the player they were matched with is placed back in the queue and their previous chat channel

// waiting list - review and revise current test

// chat
//  - users can enter a chat message
//  - when one user enters a message another user in the same channel can see it
//  - chat message max length error alert
//  - chat input delay, short for logged in user, longer for guest
//  - clicking channel button shows change channel modal
//  - attempting to join a chat channel prefixed with "game- or ranked-" shows error
//  - clicking one of the preset channel buttons shows loading then changes channel
//  - chat channel sidebar shows current chat channel name
//  - entering a message in the new chat channel is not visible to a user in a different channel
//  - typing in a too long custom chat channel name shows error message
//  - user can type in a valid custom channel name and join that channel
//  - list of users in chat channel sidebar updates when a player leaves or joins the chat channel

// bans
