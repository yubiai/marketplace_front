
import { TourProvider } from '@reactour/tour';
import { profileService } from '../services/profileService';
import { stepsTour } from '../utils/tourGuideUtils';
import { useGlobal } from './globalProvider';

const TourGuideProvider = ({ children }) => {
    const global = useGlobal();

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
            <TourProvider steps={stepsTour} beforeClose={() => handleTourClose()}>
                {children}
            </TourProvider>
        </>
    )
}

export default TourGuideProvider;