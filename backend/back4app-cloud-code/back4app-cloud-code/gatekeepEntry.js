const validateRoot = async (request) => {
  if(!request.user){
    return false;
  }
  
  const queryRole = new Parse.Query(Parse.Role);
  queryRole.equalTo("name", "Root");
  
  const role = await queryRole.first({useMasterKey: true});
  
  const roleRelation = new Parse.Relation(role, "users");
  const queryRoots = roleRelation.query();
  queryRoots.equalTo("objectId", request.user.id);
  const result = await queryRoots.first({useMasterKey: true});

  if(result){
    return true;
  } else{
    return false;
  }
}

Parse.Cloud.define("checkEntryMode", async (request) => {
 const isRoot = await validateRoot(request);
 if(isRoot){
   return {modes: ["results", "play"]};
 }
 const {gameID} = request.params;
 
 
 const query = new Parse.Query("GameResult");
 
 const gameQuery = new Parse.Query("Game");
 const gameRef = await gameQuery.get(gameID);
 
 const endDate = await gameRef.get("endDate");
 
 if(endDate) {
   const currDate = new Date();
   if(currDate > endDate){
     return {modes: ["results"]};
   }
 }
 
 query.equalTo("player", request.user).equalTo("game", gameRef);
 
 const response = await query.first();
 if(response) {
   return {modes: ["results"]};
 }
 else {
   return {modes: ["play"]};
 }
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

