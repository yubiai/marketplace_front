import ReactPlayer from 'react-player';

const PlayerVideo = ({ videoSrc, createObjectURL }) => {
    const url_gc = process.env.NEXT_PUBLIC_LINK_GC;
    const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;

    return (
        <>
            <ReactPlayer url={createObjectURL ? videoSrc : url_fleek + videoSrc} fallback={createObjectURL ? '/static/images/videologo.png' : url_gc + videoSrc} width="100%" height="100%" controls={true} />
        </>
    )
}

export default PlayerVideo;