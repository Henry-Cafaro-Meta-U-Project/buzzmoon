import * as React from 'react';
import * as Parse from 'parse/dist/parse.min.js'
import DevTools from '../../DevTools/DevTools';

import { Center, Heading, Spinner, Select, VStack, Text, HStack, Box, Table, Thead, Th} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

Parse.initialize(`nUrzDufzLEaJ3sjzvcvNHvw1hD46jOt4yEipaWHs`, `juaO5lbdY5jTtDXGpzEr2mGtggC0wf2Es11cEruf`);
Parse.serverURL = 'https://parseapi.back4app.com/';

export default function DevDashboard() {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = React.useState(false);
    const [databaseSchema, setDatabaseSchema] = React.useState([]);
    const [selectedClass, setSelectedClass] = React.useState(undefined);

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
        <VStack mt={'20'} mx={'5%'} align={'start'}>
            <VStack align={'start'}>
            <Heading>Database</Heading>
            <HStack>
                <Text>Class:</Text>
                <Select
                    placeholder="Select Class"
                    value={selectedClass}
                    onChange={(event) => {setSelectedClass(event.target.value);}}>
                    {databaseSchema.map((schema) => (
                        <option value={schema.className}>{schema.className}</option>
                    ))}
                </Select>
            </HStack>
            {selectedClass ?
                <DatabaseTable
                    classSchema={databaseSchema.find((e) => (e.className == selectedClass))}
                    /> : null}
            </VStack>
        </VStack>
    )
}

function DatabaseTable(props) {
    return (
        <Box maxW={'90vw'} overflowX={'auto'}>
        <Table >
            <Thead>
                {
                    Object.keys(props.classSchema.fields).map((key) => (
                        <Th>{key}</Th>
                    ))
                }

            </Thead>

        </Table>
        </Box>
    )
}
