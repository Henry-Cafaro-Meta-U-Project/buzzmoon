import * as React from 'react';
import Parse from 'parse/dist/parse.min.js'
import DevTools from '../../DevTools/DevTools';

import { Center, Heading, Spinner, Select, VStack, Text, HStack, Box, Icon,
         Table, Thead, Th, Tr, Td, TableContainer, Tbody, Checkbox, Button} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { BsTrash } from "react-icons/bs";


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
                        <option key={schema.className} value={schema.className}>{schema.className}</option>
                    ))}
                </Select>
            </HStack>
            {selectedClass ?
                <DatabaseTable key={selectedClass}
                    classSchema={databaseSchema.find((e) => (e.className == selectedClass))}
                    /> : null}
            </VStack>
        </VStack>
    )
}

function DatabaseTable(props) {
    const navigate = useNavigate();

    const [data, setData] = React.useState();
    const [objsToDelete, setObjsToDelete] = React.useState([]);
    const [fetchTrigger, setFetchTrigger] = React.useState(false);

    const addToDelete = (obj) => {
        if(!objsToDelete.includes(obj)){
            setObjsToDelete(objsToDelete.concat([obj]));
        }
    }

    const removeFromDelete = (obj) => {
        if(objsToDelete.includes(obj)){
            setObjsToDelete(objsToDelete.filter((elem) => (elem !== obj)));
        }
    }

    const tableHeaders = Object.keys(props.classSchema.fields);

    React.useEffect(() => {
        const fetchData = async () => {
            const cloudData = await DevTools.getClassData(props.classSchema.className)
            setData(cloudData);
        }

        fetchData();
    }, [fetchTrigger]);

    if(!data){
        return <Spinner/>
    }

    return (
        <VStack align={'start'} maxW={'90vw'} overflowX={'auto'}>
            {objsToDelete.length > 0 &&
                <Button colorScheme={'red'} onClick={async () => {
                    await DevTools.deleteObjList(objsToDelete);
                    setObjsToDelete([]);
                    setFetchTrigger(!fetchTrigger);
                }}>
                    Delete
                </Button>}
            <TableContainer>
                <Table >
                    <Thead>
                        <Tr>
                            <Th><Icon as={BsTrash}></Icon></Th>
                            {
                            tableHeaders.map((e) => (
                                <Th key={e}>{e}</Th>
                            ))}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {data.map((obj, idx) => (
                                <TableRow
                                    key={obj.id}
                                    tableHeaders={tableHeaders}
                                    obj={obj}
                                    idx={idx}
                                    addToDelete={addToDelete}
                                    removeFromDelete={removeFromDelete}></TableRow>
                            ))}
                    </Tbody>
                </Table>
            </TableContainer>
        </VStack>
    )
}

function TableRow(props) {
    let rowValues = new Array(props.tableHeaders.length).fill(null);
    rowValues[0] = props.obj.id;
    Object.keys(props.obj.attributes).map((key) => {
        const mutIndex = props.tableHeaders.findIndex((elem) => (elem === key));
        rowValues[mutIndex] = props.obj.attributes[key];
    })


    return (
        <Tr key={props.obj.id}>
            <Td><Checkbox
                colorScheme={'red'}
                onChange={(e) => {
                    if(e.target.checked) {
                        props.addToDelete(props.obj);
                    } else {
                        props.removeFromDelete(props.obj)
                    }

                }}></Checkbox></Td>
            {
                rowValues.map((e, idx) => (
                    <Td maxW={'250px'} overflow={'auto'} key={idx}>{e ? (e.id || e.toString()) : "null"}</Td>
                ))
            }
        </Tr>
    )
}
