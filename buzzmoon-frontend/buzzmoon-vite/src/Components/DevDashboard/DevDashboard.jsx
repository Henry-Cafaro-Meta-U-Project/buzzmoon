import * as React from 'react';
import * as Parse from 'parse/dist/parse.min.js'
import DevTools from '../../devtools/devtools';

import { Center, Text, Spinner} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default function DevDashboard() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const validatePrivileges = async () => {
            const isAllowed = await DevTools.validateRoot();
            if(isAllowed){
                setIsVisible(true);
            } else{
                navigate(-1);
            }
        }

        validatePrivileges();
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
