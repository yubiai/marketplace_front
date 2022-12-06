const parseNoti = (type) => {

  let message = null;
  let path = null;

  switch (type) {
    case 'Sale':
      path = 'profile/orders/as-seller'
      message = 'New Sale!'
      break
    case 'Publish':
      path = 'item'
      message = 'Your Item was accepted and published.'
      break
    case 'ORDER_PAID':
      path = 'profile/orders/as-seller'
      message = 'Order Paid'
      break
    case 'ORDER_DISPUTE_RECEIVER_FEE_PENDING':
      path = 'profile/orders/as-seller'
      message = 'Order dispute receiver fee pending.'
      break
    case 'ORDER_DISPUTE_IN_PROGRESS':
      path = 'profile/orders/detail'
      message = 'Order dispute in progress.'
      break
    case 'ORDER_DISPUTE_FINISHED_SELLER':
      path = 'profile/orders/as-seller'
      message = 'Order dispute finished.'
      break
    case 'ORDER_DISPUTE_IN_PROGRESS_BUYER':
      path = 'profile/orders/detail'
      message = 'Order dispute finished.'
      break
    case 'ORDER_DISPUTE_APPEALABLE':
      path = 'profile/orders/as-seller'
      message = 'Order dispute appealable.'
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
