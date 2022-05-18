import {
  Box,
  Button,
  Center,
  Container,
  Divider,
  Flex,
  Image,
  Text
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ItemCard from '../../components/Cards/ItemCard'
// import { FaBeer } from 'react-icons/fa';
import { MdOutlineStar } from "react-icons/md";

const ItemById = () => {
  const router = useRouter()
  const { id } = router.query

  const IMAGE =
    'https://images.unsplash.com/photo-1587089879249-87bf7d2972df?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2952&q=80'

  return (
    <>
      <Container maxW="container.xl">
        Item de tal: {id}
        <Flex width={'full'} direction={{ base: 'column', md: 'row' }}>
          <Box width={{ base: '100%', md: '66%' }} m="5px">
            <Box padding="5px">
              <Center>
                <Image
                  alt="Img Item"
                  rounded={'lg'}
                  height={'600px'}
                  width={'full'}
                  objectFit={'cover'}
                  src={IMAGE}
                />
              </Center>
            </Box>
            <Box>
              <Divider />
              <Box>
                <Flex>
                  <ItemCard />
                  <ItemCard />
                  <ItemCard />
                </Flex>
              </Box>
            </Box>
          </Box>
          <Box
            padding="5px"
            m="5px"
            width={{ base: '100%', md: '33%' }}
            h="546px"
            border={'solid 1px #bababa;'}
            borderRadius={'5px'}
          >
            <Text
            color="#323232"
            fontSize="14px"
            fontWeight="300"
            >New</Text>
            <Text
            fontSize="20px"
            fontWeight="600"
            >Enlego English Courses</Text>
            <Text
            color="#01abd0"
            fontSize="14px"
            fontWeight="600"
            >Sell by Englego</Text>
            <Box
            display={'flex'}
            flexDirection={'row'}
            mt="5px"
            alignItems={"center"}
            >
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <MdOutlineStar color="00abd1" />
              <Text
            color="#323232"
            fontSize="14px"
            fontWeight="300"
            >3 Opinions</Text>
            </Box>
            <Text>45 DAIs</Text>
            <Text>0% addtional for Yubiai Fee</Text>
            <Text>0.6% additional for UBI Burner Fee</Text>
            <Box
            display={'flex'}
            h="-webkit-fill-available"
            alignItems={'center'}
            justifyContent={'center'}
            >
              <Button
                bg="#00abd1" color="white"
                w="312px"
                h="32px"
                fontSize={"16px"}
                fontWeight={"600"}
              >
                Buy Now
              </Button>
            </Box>  
          </Box>
        </Flex>
        <Divider />
        <Box m="1em">
          <Text mt="10px">Course description</Text>
          <Text mt="10px">
            Specialized in personalized spoken English “Conversation” classes,
            in which our teachers will engage you in discussion of topics of
            your choice, ranging from politics and economics, science, music,
            history, culture, sports and anything else that might tickle your
            fancy. Our conversation classes include reading contemporary
            articles via Skype, with particular attention to pronunciation, new
            vocabulary, grammar structures and common expressions of the English
            language. Our native speaker teachers are reliable professionals
            willing to go the extra mile to make sure you are satisfied with the
            quality of conversations you are having!
          </Text>
          <Text mt="10px">
            Our educators tailor-fit their English lessons to individual
            student’s needs. We focus on developing our students’ communicative
            proficiency in order to prepare them for real-life encounters with
            other English speakers. Our insistence on employing only the best
            English teachers, and following strict recruitment criteria, has
            ensured quality as the foundation of the system. Teachers guide and
            support students throughout their studies, providing engaging and
            interactive English lessons and offering helpful feedback. We make
            English classes as enjoyable as possible to immerse students in the
            skills they are practicing and to ensure every student reaches his
            full potential. Every English lesson is geared towards providing
            opportunities for learners to use the target structure. Teachers
            will employ communicative teaching techniques which best suit the
            age, level, and ability of each student. Other key benefits are
            accurate and natural pronunciation and intonation as well as
            appropriation in the use of vocabulary, grammar, and functional
            language. A combination of these approaches by native-English
            teachers yields incredible results! Mission We commit to ensure that
            our English language learners receive rigorous curriculum standards
            and achieve high levels of academic success Vision Enlego seeks to
            provide a learning environment which is caring, motivating and
            supportive allowing all cultures within our school to achieve their
            personal best and to become excellent English speakers.
          </Text>
        </Box>
      </Container>
    </>
  )
}

export default ItemById
