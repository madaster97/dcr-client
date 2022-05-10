import * as React from 'react'
import { useAsync } from 'react-async'
import {
  ChakraProvider,
  Box,
  Text,
  Link,
  VStack,
  Code,
  Grid,
  theme,
  Textarea,
  ButtonGroup,
  Heading,
  Spacer,
  Button,
  useClipboard,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Divider,
  Flex
} from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon
} from '@chakra-ui/react'
import { ColorModeSwitcher } from './ColorModeSwitcher'
import ClientTable from './components/ClientTable'
import ClientForm from './components/ClientForm'
import ClientAccess from './components/ClientAccess'
import { ClientStore } from 'dcr-client'

// const MyComponent = () => {
//   const { data, error, isPending } = useAsync(promiseFn)
//   const { hasCopied, onCopy } = useClipboard(data || '')

//   if (isPending) return <>{'Loading...'}</>
//   if (error) return <>{`Something went wrong: ${error.message}`}</>
//   return (
//     <VStack>
//       <Flex minWidth='max-content' alignItems='center' gap='2'>
//         <Box p='2'>
//           <Heading size='md'>Copy Public Key</Heading>
//         </Box>
//         <Spacer />
//         <ButtonGroup gap='2'>
//           <Button colorScheme='teal' isDisabled={!!error} onClick={onCopy}>
//             {hasCopied ? 'Copied' : 'Copy'}
//           </Button>
//         </ButtonGroup>
//       </Flex>
//       <Textarea isReadOnly resize='vertical' value={data} h='210px' />
//     </VStack>
//   )
// }

export const App = () => {
  const [tabIndex, setTabIndex] = React.useState<number | number[]>(0)
  const [client, setClientInternal] = React.useState<ClientStore.Client>()

  const setClient = (c: ClientStore.Client) => {
    setTabIndex(2)
    setClientInternal(c)
  }

  React.useEffect(() => {
    if (client) {
      setTabIndex(2)
    }
  }, [client])

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Flex>
          <Box as='header' mx={'4px'} mt={'4px'}>
            SMART Dynamic Client App
          </Box>
          <Spacer />
          <ColorModeSwitcher />
        </Flex>

        <Accordion allowToggle index={tabIndex} onChange={e => setTabIndex(e)}>
          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  Search Existing Clients
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <ClientTable chooseClient={setClient} />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem>
            <Heading>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  Register a New Client
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              <ClientForm chooseClient={setClient} />
            </AccordionPanel>
          </AccordionItem>

          <AccordionItem isDisabled={!client}>
            <Heading>
              <AccordionButton>
                <Box flex='1' textAlign='left'>
                  Get Access with Current Client
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </Heading>
            <AccordionPanel pb={4}>
              {!client ? (
                <Text>No client found. Please choose or register a client</Text>
              ) : (
                <ClientAccess client={client} />
              )}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>

        {/* <Tabs
          as='nav'
          variant='enclosed'
          index={tabIndex}
          onChange={handleTabsChange}
        >
          <TabList>
            <Tab>Search Clients</Tab>
            <Tab>Register New Client</Tab>
            <Tab isDisabled={!client}>Request Access</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <ClientTable
                chooseClient={c => {
                  setClient(c)
                  setTabIndex(2)
                }}
                clients={[]}
              />
            </TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              {!!client ? <MyComponent /> : <Text>No client!</Text>}
            </TabPanel>
          </TabPanels>
        </Tabs> */}
      </Box>
    </ChakraProvider>
  )
}
