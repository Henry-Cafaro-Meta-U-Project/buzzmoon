

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

// fetch data of all games created by user
Parse.Cloud.define("fetchCreatedGames", async (request) => {
  const query = new Parse.Query("Game");
  query.equalTo("author", request.user);
  const games = await query.find();


  const gamesData = await Promise.all(
                           games.map(async (e) => {
                             const response = await fetchGameData(e.id);
                             return response;}));
  return gamesData;
})

// fetch data of all games played by user
Parse.Cloud.define("fetchPlayedGames", async (request) => {
  const query = new Parse.Query("Game");

  const games = await query.filter(async (game) => {
    const players = await game.get("players");
    return (players.indexOf(request.user.id) !== -1);

  });
  const gamesData = await Promise.all(
                           games.map(async (e) => {
                             const response = await fetchGameData(e.id);
                             return response;}));
  return gamesData;


})

// fetch data of all games associated with a given  query string
Parse.Cloud.define("searchGames", async (request) => {
  const query = new Parse.Query("Game");
  const games = await query.filter(async (game) => {
    const title = await game.get("title");
    const author = game.get("author");
    const userQuery = new Parse.Query("User");
    const authorObj = await userQuery.get(author.id);
    const authorName = authorObj.get("realName");

    return (title.toLowerCase().includes(request.params.query.toLowerCase()) ||
             authorName.toLowerCase().includes(request.params.query.toLowerCase()));
  });

  const gamesData = await Promise.all(
                           games.map(async (e) => {
                             const response = await fetchGameData(e.id);
                             return response;}));
  return gamesData;
})
