import ReactPlayer from 'react-player';

const PlayerVideoEditItem = ({ videoSrc }) => {
    const url_gc = process.env.NEXT_PUBLIC_LINK_GC;
    const url_fleek = process.env.NEXT_PUBLIC_LINK_FLEEK;
        
    return (
        <>
            <ReactPlayer url={videoSrc && videoSrc.filename && url_fleek + videoSrc.filename} fallback={videoSrc && videoSrc.filename && url_gc + videoSrc.filename} width="100%" height="100%" controls={true} muted={true} />
        </>
    )
}

export default PlayerVideoEditItem;