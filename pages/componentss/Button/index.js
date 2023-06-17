import React from 'react'

import { Box } from '@chakra-ui/react'

export const Button = ({ children, ...props  }) => (
  <Box as="button" {...props} bg="red">
    {children}
  </Box>
)