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
      bg="white"
      color="#00ABD1"
      borderRadius={'54px'}
      boxShadow={'0px 3px 6px #00000029'}
      fontSize={'2em'}
      width={'45px'}
      height={'45px'}
      position={'absolute'}
      top={'40%'}
      right={'0%'}
      zIndex={'99'}
    >
      <MdKeyboardArrowRight  />
    </Button>
  )
}

function SamplePrevArrow(props) {
  const { onClick } = props

  return (
    <Button
      onClick={onClick}
      bg="white"
      color="#00ABD1"
      borderRadius={'40px'}
      fontSize={'2em'}
      boxShadow={'0px 3px 6px #00000029'}
      width={'45px'}
      height={'45px'}
      position={'absolute'}
      top={'40%'}
      zIndex={'99'}
    >
      <MdKeyboardArrowLeft />
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
      breakpoint: 1024,
      settings: {
        slidesToShow: 3,
        slidesToScroll: 3,
        infinite: true,
        dots: false,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 480,
      settings: {
        slidesToShow: 1,
        slidesToScroll: 1,
      },
    },
  ],
}

const CarouselCards = ({title}) => {
  return (
    <Container display={{base:"contents"}} maxW="full" mt="2em">
      <Text color={"#727272"} fontSize="19px">{title}</Text>
      <Slider {...settings} >
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </Slider>
    </Container>
  )
}

export default CarouselCards;