
const stepsTour = (t) => {
  const listSteps = [
    {
      selector: '.step-sell',
      content: t('Head on and publish your service')
    },
    {
      selector: '.step-category',
      content: t('Search an item by categories and subcategories')
    },
    {
      selector: '.step-favourites',
      content: t('Take a look at your favorite posts')
    },
    {
      selector: '.step-help',
      content: t('Click here for help!')
    },
    {
      selector: '.step-bridge',
      content: t('To make a bridge')
    },
    {
      selector: '.step-usermenu',
      content: t('Dive on to your profile')
    },
    {
      selector: '.step-notifications',
      content: t('View your notifications')
    }
  ];
  return listSteps
}

export {
  stepsTour
}