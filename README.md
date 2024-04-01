# Cyborg-Euchre
This project is intended for use in a "Cyborg Euchre" tournament with Ohio University's ACM student chapter. The tournament consists of games of Euchre, where each team has a human player with a bot that they have written as their teammate. 

The Euchre bots will be integrated into the games by a mediator -- a third person who uses the applications in this repository to input events in the game and make game decisions output by the bots. The mediator does this through the Angular application in the game-mediator folder. game-mediator then makes calls to the Express backend in mediator-backend, which then has access to the players' bots in the euchre-bots directory. 

## Use for gameplay 
To use for cyborg euchre gameplay, first deploy the backend from within mediator-backend,

    node app.js

then deploy the frontend to port 4200 from within game-mediator 

    npm run start
