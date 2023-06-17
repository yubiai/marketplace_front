import React from "react";

import { Box, Text } from "@chakra-ui/react";


export const Group = (props) => {
  const { label, children, style, className } = props;

  return (
    <Box marginTop="10" marginBottom="8" marginX="0" width="full" className={className} style={style}>
      {label && <Box marginBottom="4"><Text color="text80">{label}</Text></Box>}
      <Box>
        {React.Children.map(children, (child, i) => (
          <Box key={i}>{child}</Box>
        ))}
      </Box>
    </Box>
  );
};
