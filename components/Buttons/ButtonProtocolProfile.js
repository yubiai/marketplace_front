import { Button } from "@chakra-ui/button";
import { Image } from "@chakra-ui/image";
import { Link } from "@chakra-ui/layout";
import { Tooltip } from "@chakra-ui/tooltip";
import useTranslation from "next-translate/useTranslation";

const ButtonProtocolProfile = ({ profile, protocol }) => {

    const { t } = useTranslation("profilepage");

    let linkProfile = protocol === "poh" ? `https://app.proofofhumanity.id/profile/${profile && profile.eth_address}` : `https://www.lensfrens.xyz/${profile && profile.lens_info.handle}`
    let imageProtocol = protocol === "poh" ? '/static/images/poh.png' : '/static/images/lenslogo.png';
    let toolTipText = protocol === "poh" ? "View POH profile" : "View Lens profile";

    return (
        <>
            <Link
                href={linkProfile}
                isExternal
            >
                <Tooltip label={t(toolTipText)} aria-label={t(toolTipText)}>
                    <Button mr="10px">
                        <Image
                            alt="Img Item"
                            height={'25px'}
                            width={'20px'}
                            objectFit={'initial'}
                            src={imageProtocol}
                        />
                    </Button>
                </Tooltip>
            </Link>
        </>
    )
}

export default ButtonProtocolProfile;