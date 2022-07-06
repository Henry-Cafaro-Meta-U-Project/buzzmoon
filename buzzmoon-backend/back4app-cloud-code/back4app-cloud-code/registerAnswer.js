

Parse.Cloud.define("checkEntryMode", async (request) => {
  const params = request.params;
  
  const query = new Parse.Query("GameResult");
  
  // refine query 
  
  const response = await query.first();
  
  if(response) {
    return {mode:"play"};
  }
  else {
    return {mode:"results"};
  }
});