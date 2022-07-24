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

const getEntryModes = async (request, gameID) => {
 const isRoot = await validateRoot(request);
 if(isRoot){
   return {modes: ["results", "play", "review"]};
 }
 
 
 const query = new Parse.Query("GameResult");
 
 const gameQuery = new Parse.Query("Game");
 const gameRef = await gameQuery.get(gameID);
 
 
 if(gameRef.get("author").id === request.user.id){
   return {modes: ["results", "play", "review"]};
 }
 
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
};

module.exports = {validateRoot, getEntryModes};
