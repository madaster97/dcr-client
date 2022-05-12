import * as React from 'react'
import { ClientStore } from 'dcr-client'
import { useAsync } from 'react-async'
import { exportJWK } from '../lib/keys'
import { Button, useClipboard, Box, Heading, Text } from '@chakra-ui/react'

const JwksButton: React.FC<{ client: ClientStore.Client }> = ({ client }) => {
  const getJwks = React.useCallback(async () => {
    const jwk = await exportJWK(client.publicKey)
    return JSON.stringify(
      {
        keys: [
          {
            ...jwk,
            kid: client.kid
          }
        ]
      },
      null,
      2
    )
  }, [client])
  const { data, error, isLoading } = useAsync(getJwks)
  const { hasCopied, onCopy } = useClipboard(data || '')
  if (error) {
    return <Text>Error loading JWKS: {error.message}</Text>
  } else {
    return (
      <Button
        isLoading={isLoading}
        loadingText='Loading JWKS...'
        onClick={onCopy}
      >
        {hasCopied ? 'Copied' : 'Copy JWKS'}
      </Button>
    )
  }
}

const ClientAccess: React.FC<{ client: ClientStore.Client }> = ({ client }) => {
  return (
    <Box>
      <Heading>Stored Client Object</Heading>
      <pre>{JSON.stringify(client, null, 2)}</pre>
      <Heading>Client Public Key</Heading>
      <JwksButton client={client} />
    </Box>
  )
}
export default ClientAccess
