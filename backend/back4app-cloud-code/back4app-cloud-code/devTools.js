
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

const validateRootCloud = async (request) => {
  const good = await validateRoot(request);
  if(!good){
    throw "You don't have the permissions to perform this action";
  }

  return;
}

// this function returns the schema of the entire database
Parse.Cloud.define("getCompleteSchema", async (request) => {
 const schema = await Parse.Schema.all({useMasterKey: true});


  return schema;
}, validateRootCloud);

// this function returns all data for a given class name
Parse.Cloud.define("getClassData", async (request) => {
  const query = new Parse.Query(request.params.className);
  const data = await query.find({useMasterKey: true});
  return data;
}, validateRootCloud);

// this function deletes a given object from the database
Parse.Cloud.define("deleteObject", async (request) => {
  const query = new Parse.Query(request.params.cName);
  const obj = await query.get(request.params.id);

  await obj.destroy({useMasterKey: true});
}, validateRootCloud);


// this function checks whether a user has root privileges
Parse.Cloud.define("validateRoot", async (request) => {
  const response = await validateRoot(request);
  return response;
});