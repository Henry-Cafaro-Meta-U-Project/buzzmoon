import * as Parse from 'parse/dist/parse.min.js'

Parse.initialize('nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs', 'juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf');
Parse.serverURL = 'https://parseapi.back4app.com/';

export default class DevTools{

    // validates that the current user has root privileges
    static async validateRoot() {
        const response = await Parse.Cloud.run("validateRoot");
        return response;
    }

}