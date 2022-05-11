import * as React from 'react'
import {
  ChakraProvider,
  Box,
  Text,
  theme,
  Heading,
  Spacer,
  Flex,
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
      </Box>
    </ChakraProvider>
  )
}
