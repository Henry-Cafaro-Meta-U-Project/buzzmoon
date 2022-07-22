 
 
 // returns the data of all GameResult objects associated with a particular game 
 // need to add input validation for security
 Parse.Cloud.define("fetchAllGameResults", async (request) => {
  const {gameID} = request.params; 
  
  const resultQuery = new Parse.Query("GameResult");
  
  const gameQuery = new Parse.Query("Game");
  const gameRef = await gameQuery.get(gameID);
  
  
  resultQuery.equalTo("game", gameRef);
  
  const results = await resultQuery.find();
  
  
  
  const cleanedResults = await Promise.all(results.map(async (e) => {
    const answers = e.get("answers");
    const playerRef = e.get("player")
    
    const playerQuery = new Parse.Query("User");
    const player = await playerQuery.get(playerRef.id);
    const name = player.get("realName");
    
    return {answers, name};
   }));
 
 return cleanedResults;
});