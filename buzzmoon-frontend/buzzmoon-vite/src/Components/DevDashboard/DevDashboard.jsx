import * as React from 'react';

import * as Parse from 'parse/dist/parse.min.js'

import { Center, Text} from '@chakra-ui/react';

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default function DevDashboard() {
    return (
        <Center>
            <Text>
                Dev
            </Text>
        </Center>
    )
}
