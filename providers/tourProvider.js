
import { TourProvider } from '@reactour/tour';
import { profileService } from '../services/profileService';
import { stepsTour } from '../utils/tourGuideUtils';
import { useGlobal } from './globalProvider';
import useTranslation from 'next-translate/useTranslation';

const TourGuideProvider = ({ children }) => {
    const global = useGlobal();
    const { t } = useTranslation("help");

    const handleTourClose = async () => {
        try {
            await profileService.tourAccepted(global.profile._id, global.profile.token)
            return
        } catch (err) {
            console.error(err);
            return
        }
    }

    return (
        <>
            <TourProvider steps={stepsTour(t)} beforeClose={() => handleTourClose()}>
                {children}
            </TourProvider>
        </>
    )
}

export default TourGuideProvider;