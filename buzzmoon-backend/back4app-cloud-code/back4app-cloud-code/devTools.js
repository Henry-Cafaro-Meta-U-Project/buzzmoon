
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


  // this function validates that a user has root privileges
  Parse.Cloud.define("validateRoot", async (request) => {
    const response = await validateRoot(request);
    return response;
  });
