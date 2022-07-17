import * as React from 'react';
import * as Parse from 'parse/dist/parse.min.js'
import DevTools from '../../DevTools/DevTools';

import { Center, Text, Spinner} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default function DevDashboard() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = React.useState(false);
    const [databaseSchema, setDatabaseSchema] = React.useState({});
    console.log("🚀 ~ file: DevDashboard.jsx ~ line 15 ~ DevDashboard ~ databaseSchema", databaseSchema)

    React.useEffect(() => {
        const onMount = async () => {
            const isAllowed = await DevTools.validateRoot();
            if(isAllowed){
                setIsVisible(true);
            } else{
                navigate(-1);
            }

            const schema = await DevTools.getCompleteSchema();
            setDatabaseSchema(schema);

        }

        onMount();
    }, []);

    if(!isVisible){
        return <Center>
            <Spinner />
        </Center>
    }

    return (
        <Center>
            <Text>
                Dev
            </Text>
        </Center>
    )
}
