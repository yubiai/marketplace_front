
import { TourProvider } from '@reactour/tour';
import { profileService } from '../services/profileService';
import { stepsTour } from '../utils/tourGuideUtils';
import { useGlobal } from './globalProvider';
import useTranslation from 'next-translate/useTranslation';
import { useMediaQuery } from '@chakra-ui/media-query';

const TourGuideProvider = ({ children }) => {
    const global = useGlobal();
    const { t } = useTranslation("help");
    const [isResponsive] = useMediaQuery("(max-width: 768px)");

    const handleTourClose = async () => {
        try {
            await profileService.tourAccepted(global.profile._id, global.profile.token)
            return
        } catch (err) {
            console.error(err);
            return
        }
    }

    if(!isResponsive){
        return (
            <>
                <TourProvider steps={stepsTour(t)} beforeClose={() => handleTourClose()} 
                styles={{ popover: (base) => ({ ...base, 
                    color: "black" }) }}
                >
                    {children}
                </TourProvider>
            </>
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }


}

export default TourGuideProvider;