import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";

const TimeForClaimInfo = ({t}) => {

    return (
        <>
            <Tooltip hasArrow label={t("TimeForClaimInfo")} placement='top' bg='gray.300' color='black'>
                <InfoOutlineIcon />
            </Tooltip>
        </>
    )
}

export default TimeForClaimInfo;