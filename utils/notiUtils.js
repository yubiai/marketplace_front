const parseNoti = (type, t) => {

  let message = null;
  let path = null;

  switch (type) {
    case 'Sale':
      path = 'profile/orders/as-seller'
      message = t ? t("New Sale!") : "New Sale!"
      break
    case 'Publish':
      path = 'item'
      message = t ? t("Your Item was accepted and published") : "Your Item was accepted and published"
      break
    case 'ORDER_PAID':
      path = 'profile/orders/as-seller'
      message = t ? t("Order Paid") : "Order Paid"
      break
    case 'ORDER_DISPUTE_RECEIVER_FEE_PENDING':
      path = 'profile/orders/as-seller'
      message = t ? t("Order dispute receiver fee pending") : "Order dispute receiver fee pending"
      break
    case 'ORDER_DISPUTE_IN_PROGRESS':
      path = 'profile/orders/as-seller'
      message = t ? t("Order dispute in progress") : "Order dispute in progress"
      break
    case 'ORDER_DISPUTE_FINISHED_SELLER':
      path = 'profile/orders/as-seller'
      message = t ? t("Order dispute finished") : "Order dispute finished"
      break
    case 'ORDER_DISPUTE_IN_PROGRESS_BUYER':
      path = 'profile/orders/detail'
      message = t ? t("Order dispute finished") : "Order dispute finished"
      break
    case 'ORDER_DISPUTE_APPEALABLE':
      path = 'profile/orders/as-seller'
      message = t ? t("Order dispute appealable") : "Order dispute appealable"
      break
    case 'ORDER_COMPLETED_BY_SELLER':
      path = 'profile/orders/detail'
      message = t ? t("Work completed by seller!") : "Work completed by seller!"
      break
    case 'ORDER_REFUNDED':
      path = 'profile/orders/detail'
      message = t ? t("Order Reimbursed!") : "Order Reimbursed!"
      break
    case 'Channel':
      path = 'profile/mailboxs'
      message = t ? t("New Message!") : "New Message!"
      break
    case 'NewQuestion':
      path = 'profile/questions/question'
      message = t ? t("New Question!") : "New Question!"
      break
    case 'NewAnswer':
      path = 'profile/questions/question'
      message = t ? t("New Answer!") : "New Answer!"
      break
    case 'ActionQuestion':
      path = 'profile/questions/question'
      message = t ? t("Question status change") : "Question status change" 
      break
    default:
      path = 'profile'
      message = t ? t("New Notification N/A") : "New Notification N/A"
      return null
  }

  return {
    message,
    path,
  }
}

export { parseNoti }
