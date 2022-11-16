import { ChevronDownIcon } from '@chakra-ui/icons';
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    Button
} from '@chakra-ui/react'
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie'

const listChains = [
    {
        id: 1,
        chainID: "0x1",
        title: "Ethereum",
        currency: "ETH"
    },
    {
        id: 5,
        chainID: "0x5",
        title: "Görli",
        currency: "ETH"
    },
    {
        id: 100,
        chainID: "0x64",
        title: "Gnosis",
        currency: "xDAI"
    }
];

const ButtonSwitchNetwork = () => {
    const router = useRouter();

    const [netWork, setNetwork] = useState(null);

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
                console.log("chainChanged")

                if (chainid == 0x1 || chainid == 0x5 || chainid == 0x64) {
                    return window.location.reload();
                }
                localStorage.removeItem('Yubiai')
                Cookies.remove('Yubiai')
                setTimeout(() => {
                    return window.location.reload();
                }, 500);
            });
            window.ethereum.on("accountsChanged", () => {
                console.log("accountsChanged")
                router.push('/logout');
            });
        }
    });


    useEffect(() => {
        if (window.ethereum) {
            const networkVersion = window.ethereum.networkVersion;
            const data = getNetwork(networkVersion)
            setNetwork(data)
            return
        }
    }, []);

    const onChangeSwitchNetwork = async (id) => {
        const data = getNetwork(id)

        if (data) {
            await window.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: data.chainID }],
            })
            setNetwork(data)
        }
    }


    return (
        <Menu>
            <MenuButton backgroundColor={'white'}
                color={'#00abd1'}
                rounded={'full'}
                ml="1em"
                disabled={!listChains || listChains.length === 0}
                cursor={'pointer'} as={Button} rightIcon={<ChevronDownIcon />}>
                {netWork && netWork.title ? netWork.title : "Network not allowed"}
            </MenuButton>
            <MenuList>
                {listChains && listChains.length > 0 && listChains.map((chain, i) => {
                    if (!netWork) {
                        return (
                            <MenuItem key={i} onClick={() => onChangeSwitchNetwork(chain.id)}>{chain.title}</MenuItem>
                        )
                    }
                    if (netWork.title !== chain.title) {
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