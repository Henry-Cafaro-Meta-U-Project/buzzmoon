 
 
 // this interface should not expose any sensitive data
 // so validation is not required
 
 async function fetchGameData(gameID) {
  const query = new Parse.Query("Game");
  const gameRef = await query.get(gameID);
  
  const numQuestions = gameRef.get("numQuestions");
  const title = gameRef.get("title");
  const createdAt = gameRef.get("createdAt");
  const description = gameRef.get("description");
  
  const authorQuery = new Parse.Query("User");
  const author = await authorQuery.get(gameRef.get("author").id);
  
  const authorName = author.get("realName");
  
  return {
    gameID,
    numQuestions,
    title,
    createdAt,
    description,
    authorName
  };
}

// fetch data of game given gameID
Parse.Cloud.define("fetchGameDataCloud", async (request) => {
  const {gameID} = request.params; 
  const gameData = await fetchGameData(gameID);
  return gameData;
});

// fetch data of all available games 
Parse.Cloud.define("fetchAvailableGames", async (request) => {
  const query = new Parse.Query("Game");
  const games = await query.find();
  
  const gamesData = await Promise.all(
                           games.map(async (e) => {
                             const response = await fetchGameData(e.id);
                             return response;}));
  return gamesData;
});
