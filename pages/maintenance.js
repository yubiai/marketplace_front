import { Box, Heading, Text } from "@chakra-ui/react";


const Maintenance = () => {
    return (
        <>
            <Box h="100vh">
                <Box mt="1em" textAlign={"center"}>
                <Heading>Site under maintenance</Heading>
                <Text>We are working to improve our website. Please come back soon.</Text>
                <Heading mt="1em">Sitio en mantenimiento</Heading>
                <Text>Estamos trabajando para mejorar nuestro sitio web. Por favor, vuelva a visitarnos pronto.</Text>
                </Box>
            </Box>
        </>
    )
}

export default Maintenance;