import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button,
    Spinner,
    Box
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'
import { listChains } from '../../utils/walletUtils';

const ButtonSwitchNetwork = ({ bg, color }) => {
    const router = useRouter();

    const [netWork, setNetwork] = useState(null);

    const [loading, setLoading] = useState(false);

    const getNetwork = (id) => {

        let dataNetwork = null;

        for (let i = 0; i < listChains.length; i++) {
            if (listChains[i].id == id) {
                dataNetwork = listChains[i]
                return dataNetwork
            }
        }

        return null;
    }

    // Detect change in Metamask account
    useEffect(() => {
        if (window.ethereum) {
            window.ethereum.on("chainChanged", async (chainid) => {
                console.log(chainid, "chainid")
                if (chainid == 0x1 || chainid == 0x5 || chainid == 0x64 || chainid == 0x38 || chainid == 0x56) {
                    return window.location.reload();
                }
                localStorage.removeItem('Yubiai')
                Cookies.remove('Yubiai')
                setTimeout(() => {
                    return window.location.reload();
                }, 500);
            });
            window.ethereum.on("accountsChanged", () => {
                router.push('/logout');
            });
        }
    });


    useEffect(() => {
        setLoading(true)
        setTimeout(() => {
            if (window.ethereum && window.ethereum.networkVersion) {
                const networkVersion = window.ethereum.networkVersion;
                console.log(networkVersion, "networkVersion")
                const data = getNetwork(networkVersion == 56 ? 38 : networkVersion)
                setNetwork(data)
                setLoading(false)
                return
            }
        }, 1000);
    }, []);

    const onChangeSwitchNetwork = async (id) => {
        const data = getNetwork(id)

        if (data) {
            try {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: data.chainID }],
                })
                setNetwork(data)
            } catch (err) {
                if (err.code === 4902) {
                    try {
                        await ethereum.request({
                            method: 'wallet_addEthereumChain',
                            params: [
                                {
                                    chainId: data.chainID,
                                    rpcUrls: data.rpcUrls,
                                    chainName: data.title
                                },
                            ],
                        });
                    } catch (error) {
                        console.error(error)
                        console.error("Operation failed.")
                        return
                    }
                }

            }
        }
    }

    return (
        <Menu>
            {loading ? (
                <Box w="100%" textAlign={"center"} mt="10px">
                    <Spinner
                        thickness="4px"
                        speed="0.65s"
                        emptyColor="gray.200"
                        color="blue.500"
                        size="md"
                    />
                </Box>
            ) : (
                <MenuButton backgroundColor={bg}
                    color={color}
                    rounded={'full'}
                    mr="5px"
                    w="100%"
                    disabled={!listChains || listChains.length === 0}
                    cursor={'pointer'} as={Button} rightIcon={<ChevronDownIcon />}>
                    {netWork && netWork.title ? netWork.title : "Wrong Network"}
                </MenuButton>
            )}

            <MenuList>
                {listChains && listChains.length > 0 && listChains.map((chain, i) => {

                    if (!netWork || !netWork) {
                        return (
                            <MenuItem key={i} onClick={() => onChangeSwitchNetwork(chain.id)}>{chain.title}</MenuItem>
                        )
                    }

                    if (netWork.title != chain.title) {
                        return (
                            <MenuItem key={i} onClick={() => onChangeSwitchNetwork(chain.id)}>{chain.title}</MenuItem>
                        )
                    }
                })}
            </MenuList>
        </Menu>
    )



}

export default ButtonSwitchNetwork;