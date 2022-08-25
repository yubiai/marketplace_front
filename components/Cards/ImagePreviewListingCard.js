import { Center, Image } from "@chakra-ui/react";

const ImagePreviewListingCard = ({ file, setSelectFile, img }) => {

    return (
        <Center m="1px">
            <Image
                alt="Img Item"
                rounded={'lg'}
                height={'70px'}
                width={'100px'}
                cursor="pointer"
                objectFit={'cover'}
                src={img ? img : URL.createObjectURL(file)}
                onClick={() => setSelectFile(file)}
            />
        </Center>
    )
}

export default ImagePreviewListingCard;
