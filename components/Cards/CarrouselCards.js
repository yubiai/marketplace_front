import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md'
import { Button, Container, Text } from '@chakra-ui/react'
import React from 'react'
import Slider from 'react-slick'
import ItemCard from './ItemCard'
import { useTranslation } from 'react-i18next'

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
      right={{base: '-10px', sm: '-20px', md: '-20px', lg: '-20px', xl: '-10px', '2xl': '-5px'}}
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
      left={{base: '-10px', sm: '-20px', md: '-20px', lg: '-20px', xl: '-10px', '2xl': '-5px'}}
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
  const { t } = useTranslation("listing");


  return (
    <Container display={{ base: "contents" }} maxW="full" mt="2em">
      <Text color={"#727272"} fontSize="19px" mt="2em">{title}</Text>
      <Slider {...settings} >
        {items && items.length > 0 && items.map((item, i) => {
          return (
            <ItemCard item={item} t={t} key={i} />
          )
        })}
      </Slider>
    </Container>
  )
}

export default CarrouselCards;