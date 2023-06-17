import { Box } from "@chakra-ui/react"

export const Console = ({ message, loading }) => {

  const getLoadingDots = () => {
    if (message) {
      return '\n...'
    }
    return '...'
  }

  return (
    <Box borderRadius="md" padding="4" style={{ backgroundColor: 'grey' }} color="backgroundPrimary">
      <Box style={{ fontFamily: 'monospace' }}>Output:</Box>
        <Box as="pre" style={{ fontFamily: 'monospace', whiteSpace: "break-spaces", overflowWrap: "anywhere" }} >
          {message}
          {loading && getLoadingDots()}
          {<Box display="inline-block" fontSize="large" lineHeight="4" style={{ top: '-4px', position: 'relative' }}>_</Box>}
        </Box>
    </Box>
  )
}
