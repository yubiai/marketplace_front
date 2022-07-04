const parseNoti = (type) => {

  let message = null;
  let path = null;

  switch (type) {
    case 'Sale':
      path = 'profile/orders/as-seller'
      message = 'New Sale!'
      break
    case 'Channel':
      path = 'profile/mailboxs'
      message = 'New Message!'
      break
    default:
      return null
  }

  return {
    message,
    path,
  }
}

export { parseNoti }
