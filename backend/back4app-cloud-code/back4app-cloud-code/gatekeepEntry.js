const {validateRoot, getEntryModes} = require("./validation.js");
 
Parse.Cloud.define("checkEntryMode", async (request) => {
  
  const {gameID} = request.params;
  const response = await getEntryModes(request, gameID);
  return response;
});

Parse.Cloud.define("registerGameEntry", async (request) => {
  const {gameID} = request.params;
  
  // need to add check if gameResult already exists, and error if so
  
  const newGameResult = new Parse.Object("GameResult");
  
  newGameResult.set("player", request.user);
  newGameResult.set("answers", []);
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  newGameResult.set("game", gameRef);
  
  await newGameResult.save(null, { useMasterKey: true });
  
  let gamePlayers = await gameRef.get("players");
  
  gamePlayers = gamePlayers.concat([request.user.id]);
  gamePlayers = gamePlayers.filter((elem, idx) => gamePlayers.indexOf(elem) === idx);
  gameRef.set("players", gamePlayers);
  
  await gameRef.save(null, { useMasterKey: true }); 
  
  return {message:"successful entry", resultKey:newGameResult.id};
  
});

