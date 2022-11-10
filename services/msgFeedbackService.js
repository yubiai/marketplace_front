import axios from 'axios'


/**
  New Message Feedback
 */
async function newMessageFeedback(msg) {
  return await axios.post('/msgfeedback', msg)
}

export const messageFeedback = {
  newMessageFeedback
}