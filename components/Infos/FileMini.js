import { Box, Center, Link, Text } from "@chakra-ui/react";
import FileIcon from "./FileIcon";

const FileMini = ({ file }) => {
    //const url_gc = process.env.NEXT_PUBLIC_LINK_GC;
    const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

    console.log(file, "file")
    return (
        <>
            <Box p="4px" bg="gray.400" minW={"75px"} w={"75px"}>
                <Center>
                    <Link href={url_fleek + "evidences/" + file.filename}>
                        <FileIcon type={file.mimetype} />
                    </Link>
                </Center>
                <Center>
                    <Text fontSize={"0.7em"}
                    >{file && file.filename.slice(0, 9)}</Text>
                </Center>
            </Box>
        </>
    )
}

export default FileMini;

