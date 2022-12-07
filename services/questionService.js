import axios from 'axios'

async function newQuestion(payload, token) {
  return await axios.post(
    `/questions/`, payload,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

async function newAnswer(question_id, payload, token) {
  return await axios.put(
    `/questions/answer/${question_id}`, payload,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

async function getQuestionById(id, token) {
  return await axios.get(
    `/questions/${id}`,
    token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : null
  )
}

async function getQuestionsByItemId(itemId, limit) {
  return await axios.get(`/items/questions/${itemId}?limit=${limit}`)
};

async function getQuestionsCountByItemId(itemId) {
  return await axios.get(`/items/questions/count/${itemId}`)
}

export const questionService = {
  newQuestion,
  newAnswer,
  getQuestionsByItemId,
  getQuestionsCountByItemId,
  getQuestionById
}
