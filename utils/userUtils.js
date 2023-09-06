
const logoutUser = () => {
    console.log("Logout User")
}

const loginProfile = (address) => {
    return new Promise(async (resolve, reject) => {
        console.log("address", address);
        const res = await profileService.login(address)
            .catch((err) => {
                if (err && err.response && err.response.data && err.response.data.error) {
                    console.error(err)
                    toast({
                        title: t('Failed to login'),
                        description: err.response.data && err.response.data.error ? err.response.data.error : t("Failed"),
                        position: 'top-right',
                        status: 'warning',
                        duration: 5000,
                        isClosable: true,
                    })
                    dispatch({
                        type: 'AUTHERROR',
                        payload: t('To connect it is necessary to be registered in Proof of Humanity and have your status as registered.')
                    });
                    onModalClose()
                    setIsLoading(false)
                    return
                }
            })

        if (!res) {
            setIsLoading(false)
            return
        }

        return
    })
}

export {
    loginProfile,
    logoutUser
}