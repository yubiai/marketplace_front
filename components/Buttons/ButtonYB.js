import { Box, useStyleConfig } from "@chakra-ui/react"

const ButtonYB = (props) => {
  const { size, variant, ...rest } = props

  // 2. Reference `Button` stored in `theme.components`
  const styles = useStyleConfig("ButtonYB", { size, variant })

  // 3. Pass the computed styles into the `sx` prop
  return <Box as="button" sx={styles} {...rest} />
}

export default ButtonYB;