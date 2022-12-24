const statusNumber = (action) => {

    switch (action) {
        case 0:
            return "Save"
        case 1:
            return "Review"
        case 2:
            return "Published"
        case 3:
            return "Unpublish"
        case 4:
            return "Archived"
        case 5:
            return "Reject"
        case 6:
            return "Deleted"
        default:
            return null;
    }
}


export default {
    statusNumber
};