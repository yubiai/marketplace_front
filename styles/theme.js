// importing the required chakra libraries
import { extendTheme } from "@chakra-ui/react";

// Example Button
const ButtonYB = {
  // The styles all button have in common
  baseStyle: {
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  // Two sizes: sm and md
  sizes: {
    sm: {
      fontSize: "12px",
      padding: "16px",
    },
    md: {
      fontSize: "16px",
      padding: "24px",
    },
  },
  // Two variants: outline and solid
  variants: {
    outline: {
      border: "2px solid",
      borderColor: "green.500",
    },
    solid: {
      bg: "green.500",
      color: "white",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
}

const config = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  components: {
    ButtonYB,
  },
  textStyles: {
    body: {
      fontFamily: "Libre Baskerville, sans-serif",
    },
    test: {
      fontFamily: "Open Sans"
    }
  },
  colors: {
    peru: {
      100: "#f7fafc",
      700: "#d49943",
    }
  }
});

// export our theme
export default theme;
