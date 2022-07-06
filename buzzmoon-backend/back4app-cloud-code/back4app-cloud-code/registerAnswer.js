

Parse.Cloud.define("checkEntryMode", async (request) => {
  const {gameID} = request.params;
  
  const query = new Parse.Query("GameResult");
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  query.equalTo("player", request.user).equalTo("game", gameRef);
  
  const response = await query.first();
  if(response) {
    return {mode:"results"};
  }
  else {
    return {mode:"play"};
  }
});

Parse.Cloud.define("registerGameEntry", async (request) => {
  const {gameID} = request.params;
  
  //const query = new Parse.Query("")
  
  const newGameResult = new Parse.Object("GameResult");
  
  newGameResult.set("player", request.user);
  newGameResult.set("answers", []);
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  newGameResult.set("game", gameRef);
  
  await newGameResult.save(null, { useMasterKey: true });
  
  return {message:"successful entry"};
  
})