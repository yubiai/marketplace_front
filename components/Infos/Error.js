import { Center } from '@chakra-ui/react';
import Link from 'next/link';

export default function Error({error}) {
  return (
    <>
      <Center h="100px" color="blue">
        <h1>{error}</h1>
        <Link href="/">
            Back
        </Link>
      </Center>
    </>
  );
}
