import { Flex, Image, Tooltip } from "@chakra-ui/react"

const ListBadges = ({badges}) => {
    return (
        <>
            <Flex mt="5px">
            {badges && badges.length > 0 && badges.map((badge, i) => {
                if (badge.status == true) {
                    return (
                        <Tooltip key={i} label={badge.protocol} aria-label={badge.protocol}>
                            <Image
                                alt="Badge"
                                height={'45px'}
                                width={'40px'}
                                objectFit={'initial'}
                                src={`/static/images/${badge.protocol}.png`}
                                mr="1em"
                            />
                        </Tooltip>
                    )
                }
            })}
            </Flex>
        </>
    )
}

export default ListBadges;