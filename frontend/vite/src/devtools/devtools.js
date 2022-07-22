import * as Parse from 'parse/dist/parse.min.js'

Parse.initialize('nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs', 'juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf');
Parse.serverURL = 'https://parseapi.back4app.com/';

export default class DevTools{

    // validates that the current user has root privileges
    static async validateRoot() {
        const response = await Parse.Cloud.run("validateRoot");
        return response;
    }

    // returns the complete schema of the database
    static async getCompleteSchema() {
        const response = await Parse.Cloud.run("getCompleteSchema");

        return response;
    }

    // returns the complete data of a given class
    static async getClassData(className){
        const classData = await Parse.Cloud.run("getClassData", {className});
        return classData;
    }

    // deletes a list of objects from the database
    static async deleteObjList(objList){
        await Promise.all(objList.map(async (e) => {
            await Parse.Cloud.run("deleteObject", {id:e.id, cName:e.className});
        }));
    }

}
