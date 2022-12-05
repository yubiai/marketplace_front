import { Image } from "@chakra-ui/react";

const PlayerImage = ({ imageSrc }) => {
  const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;
  const url_gc = process.env.NEXT_PUBLIC_LINK_GC;

  return (
    <Image
      alt={imageSrc && imageSrc.name ? imageSrc.name : imageSrc.filename}
      height={'full'}
      width={'full'}
      objectFit={'cover'}
      src={imageSrc && imageSrc.filename ? url_fleek + imageSrc.filename : imageSrc}
      fallbackSrc={imageSrc && imageSrc.filename ? url_gc + imageSrc.filename : imageSrc}
    />
  )
}

export default PlayerImage;