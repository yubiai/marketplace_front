import axios from 'axios'
import { Box, Image } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useEffect } from 'react';

const PlayerAudioEditItem = ({ audioSrc }) => {
    const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;
    const url_gc = process.env.NEXT_PUBLIC_LINK_GC;

    const [urlSrc, setUrlSrc] = useState(null);

    // Verify Url
    const verifyUrl = async () => {
        await axios.get(url_fleek + audioSrc.filename)
            .then(() => {
                setUrlSrc(url_fleek + audioSrc.filename)
            })
            .catch(() => {
                setUrlSrc(url_gc + audioSrc.filename)
            })
    }

    useEffect(() => {
        verifyUrl()
    }, [])

    // Player
    const audioPlayer = useRef();
    const [playing, setPlaying] = useState(false);

    const play = () => {
        if (urlSrc) {
            setPlaying(true);
            audioPlayer.current.play();
        }
    };

    const stop = () => {
        if (urlSrc) {
            audioPlayer.current.pause();
            audioPlayer.current.currentTime = 0;
        }
    };

    const onPlaying = () => {
        if (audioPlayer.current.paused) setPlaying(false);
    }

    return (
        <>
            <Box onClick={!playing ? play : stop} cursor="pointer" h='100%' w='100%'>
                <Image
                    alt={'Logo'}
                    w={'100%'}
                    h={'94%'}
                    src={'/static/images/audiologo.png'}
                    fallbackSrc={'/static/images/audiologo.png'}
                />
                <audio
                    className='audioPlayer'
                    src={urlSrc}
                    ref={audioPlayer}
                    onTimeUpdate={onPlaying}
                    muted={true}
                    controls
                >
                    Your browser does not support the
                    <code>audio</code> element.
                </audio>
            </Box>
        </>
    )
}

export default PlayerAudioEditItem;