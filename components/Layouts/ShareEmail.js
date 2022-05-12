import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { MdKeyboardArrowRight } from 'react-icons/md';


const ShareEmail = () => {
  return (
    <>
      <InputGroup backgroundColor={'white'} borderRadius="5px" width={"300px"}>
        <Input
          variant="filled"
          backgroundColor={'white'}
          color="black"
          focusBorderColor={'transparent'}
          size="md"
          placeholder={`Contact me, share us your e-mail`}
        />
        <InputRightElement
          color="gray.300"
          pointerEvents="none"
          justifyContent={'left'}
          fontSize="1.4em"
          children={<>|</>}
        />
        <InputRightElement
          pointerEvents="none"
          children={<MdKeyboardArrowRight color="black" w={'1.2em'} h={'1.1em'} />}
        />
      </InputGroup>
    </>
  );
};

export default ShareEmail;
