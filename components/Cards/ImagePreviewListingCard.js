import { Center, Image, Spinner } from "@chakra-ui/react";

const ImagePreviewListingCard = ({ file, setSelectFile, img }) => {
    const url_gc = process.env.NEXT_PUBLIC_LINK_GC;
    const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

    return (
        <Center m="1px">
            <Image
                alt="Img Item"
                rounded={'lg'}
                height={'70px'}
                width={'100px'}
                cursor="pointer"
                objectFit={'cover'}
                src={img ? img : (file.filename ? url_fleek + file.filename : URL.createObjectURL(file))}
                fallbackSrc={img ? img : (file.filename ? url_gc + file.filename : <Spinner size='xs' />)}
                onClick={() => setSelectFile(file)}
            />
        </Center>
    )
}

export default ImagePreviewListingCard;
