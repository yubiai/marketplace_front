import ReactPlayer from 'react-player';

const PlayerVideo = ({ videoSrc }) => {

    return (
        <>
            <ReactPlayer url={videoSrc} width="100%" height="100%" controls={true} />
        </>
    )
}

export default PlayerVideo;