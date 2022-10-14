
import { TourProvider } from '@reactour/tour';
import { stepsTour } from '../utils/tourGuideUtils';

const TourGuideProvider = ({ children }) => {

    return (
        <>
            <TourProvider steps={stepsTour}>
                {children}
            </TourProvider>
        </>
    )
}

export default TourGuideProvider;