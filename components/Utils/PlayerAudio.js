import axios from 'axios'
import { Box, Image } from '@chakra-ui/react';
import { useRef, useState } from 'react';
import { useEffect } from 'react';

const PlayerAudio = ({ audioSrc, createObjectURL }) => {
    const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;
    const url_gc = process.env.NEXT_PUBLIC_LINK_GC;

    const [urlSrc, setUrlSrc] = useState(null);

    // Verify Url
    const verifyUrl = async () => {
        await axios.get(url_fleek + audioSrc)
            .then(() => {
                setUrlSrc(url_fleek + audioSrc)
            })
            .catch(() => {
                setUrlSrc(url_gc + audioSrc)
            })
    }

    useEffect(() => {
        if (audioSrc && createObjectURL === true) {
            setUrlSrc(audioSrc)
        } else {
            verifyUrl()
        }
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
            <Box onClick={(!createObjectURL && !playing ? play : stop)} cursor="pointer" h='90%'>
                <Image
                    alt={'Logo'}
                    w={'100%'}
                    h={createObjectURL ? '95%' : '480px'}
                    src={'/static/images/audiologo.png'}
                    fallbackSrc={'/static/images/audiologo.png'}
                />
                <audio
                    className='audioPlayer'
                    src={urlSrc}
                    ref={audioPlayer}
                    onTimeUpdate={onPlaying}
                    controls
                >
                    Your browser does not support the
                    <code>audio</code> element.
                </audio>
            </Box>
        </>
    )
}

export default PlayerAudio;