import Link from "next/link";

export default function Custom500() {
  return (
    <Box textAlign="center" py={10} px={6}>
      <Heading
        display="inline-block"
        as="h2"
        size="2xl"
        bgGradient="linear(to-r, teal.400, teal.600)"
        backgroundClip="text"
      >
        500
      </Heading>
      <Text fontSize="18px" mt={3} mb={2}>
        Error
      </Text>
      <Text color={"gray.500"} mb={6}>
        500 - Server-side error occurred
      </Text>

      <Button
        colorScheme="teal"
        bgGradient="linear(to-r, teal.400, teal.500, teal.600)"
        color="white"
        variant="solid"
      >
        <Link href="/">Go to Home</Link>
      </Button>
    </Box>
  );
}
