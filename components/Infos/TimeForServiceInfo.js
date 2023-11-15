import { InfoOutlineIcon } from "@chakra-ui/icons";
import { Tooltip } from "@chakra-ui/react";

const TimeForServiceInfo = ({t}) => {

    return (
        <>
            <Tooltip hasArrow label={t("TimeForServiceInfo")} placement='top' bg='gray.300' color='black'>
                <InfoOutlineIcon />
            </Tooltip>
        </>
    )
}

export default TimeForServiceInfo;