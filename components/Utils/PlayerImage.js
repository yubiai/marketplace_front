import { Image } from "@chakra-ui/react";

const PlayerImage = ({ imageSrc }) => {

    return (
        <Image
        alt={imageSrc && imageSrc.name}
        rounded={'lg'}
        height={'full'}
        width={'full'}
        objectFit={'cover'}
        src={imageSrc}
      />
    )
}

export default PlayerImage;