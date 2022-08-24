import { Image } from '@chakra-ui/react';
import ReactAudioPlayer from 'react-audio-player';

const PlayerAudio = ({ audioSrc }) => {

    return (
        <>
            <Image
                alt={'Logo'}
                w={'100%'}
                h={'70%'}
                src={'/static/images/audiologo.png'}
                fallbackSrc={'/static/images/audiologo.png'}
            />
            <ReactAudioPlayer
                src={audioSrc}
                controls
                style={{ width: "100%", heigth: "30%" }}
            />
        </>
    )
}

export default PlayerAudio;