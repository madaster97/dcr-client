import * as React from 'react'
import { ClientStore } from 'dcr-client'
import { useAsync } from 'react-async'
import { exportJWK } from '../lib/keys'
import { Button, useClipboard, Box, Heading, Text } from '@chakra-ui/react'

// const JwksButton: React.FC<{ client: ClientStore.Client }> = ({ client }) => {
//   const { hasCopied, onCopy } = useClipboard(data || '')
//   if (error) {
//     return <Text>Error loading JWKS: {error.message}</Text>
//   } else {
//     return (
//       <Button
//         isLoading={isLoading}
//         loadingText='Loading JWKS...'
//         onClick={onCopy}
//       >
//         {hasCopied ? 'Copied' : 'Copy JWKS'}
//       </Button>
//     )
//   }
// }

const ClientAccess: React.FC<{ client: ClientStore.Client }> = ({ client }) => {
  //   const { data, error, isLoading } = useAsync(() => {})
  //   const {
  //     data: jwksString,
  //     error: jwksError,
  //     isLoading: jwksIsLoading
  //   } = useAsync(async () => {
  //     const { publicKey, kid } = client
  //     const jwk = await exportJWK(publicKey)
  //     return JSON.stringify(
  //       {
  //         jwks: [{ ...jwk, kid }]
  //       },
  //       null,
  //       2
  //     )
  //   })

  return (
    <Box>
      <Heading>Stored Client Object</Heading>
      <pre>{JSON.stringify(client, null, 2)}</pre>
      <Heading>Client Public Key</Heading>
      {/* <JwksButton client={client} /> */}
    </Box>
  )
}
export default ClientAccess
