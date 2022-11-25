import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { Button, Container, Text } from '@chakra-ui/react'
import React from 'react'
import Slider from 'react-slick'
import ItemCard from './ItemCard'

function SampleNextArrow(props) {
  const { onClick } = props
  return (
    <Button
      onClick={onClick}
      position={'absolute'}
      bg="white"
      color="#00ABD1"
      borderRadius={'54px'}
      boxShadow={'0px 3px 6px #00000029'}
      paddingRight={'0px'}
      paddingLeft={'0px'}
      top={'40%'}
      right={{base: '0px', sm: '-20px', md: '-20px', lg: '15px'}}
      zIndex={'8'}
    >
      <MdKeyboardArrowRight fontSize={'2.6em'} />
    </Button>
  )
}

function SamplePrevArrow(props) {
  const { onClick } = props

  return (
    <Button
      onClick={onClick}
      position={'absolute'}
      bg="white"
      color="#00ABD1"
      borderRadius={'54px'}
      boxShadow={'0px 3px 6px #00000029'}
      paddingRight={'0px'}
      paddingLeft={'0px'}
      top={'40%'}
      left={{base: '0px', sm: '-20px', md: '-20px', lg: '15px'}}
      zIndex={'8'}
    >
      <MdKeyboardArrowLeft fontSize={'2.6em'} />
    </Button>
  )
}

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 6,
  slidesToScroll: 1,
  initialSlide: 0,
  nextArrow: <SampleNextArrow />,
  prevArrow: <SamplePrevArrow />,
  responsive: [
    {
      breakpoint: 2256,
      settings: {
        slidesToShow: 7,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 1024,
      settings: {
        slidesToShow: 5,
        slidesToScroll: 1,
        infinite: false,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 1,
      },
    },
  ],
}

const CarrouselCards = ({ title, items }) => {

  return (
    <Container display={{ base: "contents" }} maxW="full" mt="2em">
      <Text color={"#727272"} fontSize="19px">{title}</Text>
      <Slider {...settings} >
        {items && items.length > 0 && items.map((item, i) => {
          return (
            <ItemCard item={item} key={i} />
          )
        })}
      </Slider>
    </Container>
  )
}

export default CarrouselCards;