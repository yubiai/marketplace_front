import { FaFileAudio, FaFileDownload, FaFileImage, FaFilePdf, FaFileVideo } from "react-icons/fa";

const FileIcon = ({type}) => {

    if(type && (type === "image/jpeg" || type === "image/jpg" || type === "image/png")){
        return(
            <FaFileImage size={'2.5em'} />
        )
    }

    if(type && (type === "video/mp4")){
        return(
            <FaFileVideo size={'2.5em'} />
        )
    }

    if(type && (type === "audio/mpeg")){
        return(
            <FaFileAudio size={'2.5em'} />
        )
    }

    if(type && (type === "application/pdf")){
        return(
            <FaFilePdf size={'2.5em'} />
        )
    }

    return(
        <FaFileDownload size={'2.5em'} />
    )
}

export default FileIcon;