import React, { useState, useEffect } from 'react'

import logoUrl from '../public/static/images/logo.svg'
import { Box, Image, Text } from '@0xsequence/design-system'

import { ethers } from 'ethers'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { formatEther, parseEther } from 'viem'
import { usePublicClient, useWalletClient, useAccount } from 'wagmi'
import { getWalletClient, readContract } from '@wagmi/core'
import { yubiaiArbitrable } from '../utils/escrow-utils/abis';

import { configureLogger } from '@0xsequence/utils'
import { Group } from './componentss/Group'
import { Button } from './componentss/Button'
import { Console } from './componentss/Console'

configureLogger({ logLevel: 'DEBUG' })

const Test = () => {
    const { isConnected } = useAccount()
    const publicClient = usePublicClient()
    const { data: walletClient } = useWalletClient()

    const [consoleMsg, setConsoleMsg] = useState(null)
    const [consoleLoading, setConsoleLoading] = useState(false)

    const appendConsoleLine = (message) => {
        return (setConsoleMsg((prevState => {
            return `${prevState}\n\n${message}`
        })))
    }

    const resetConsole = () => {
        setConsoleMsg(null)
        setConsoleLoading(true)
    }

    const addNewConsoleLine = (message) => {
        setConsoleMsg((() => {
            return (message)
        }))
    }

    const consoleWelcomeMessage = () => {
        setConsoleLoading(false)
        setConsoleMsg('Status: Wallet not connected. Please connect wallet to use Methods')
    }

    const consoleErrorMesssage = () => {
        setConsoleLoading(false)
        setConsoleMsg('An error occurred')
    }

    useEffect(() => {
        if (isConnected) {
            setConsoleMsg('Wallet connected!')
        } else {
            consoleWelcomeMessage()
        }
    }, [isConnected])

    const getChainID = async () => {
        try {
            resetConsole()
            const chainId = await walletClient.getChainId()
            console.log('walletClient.getChainId()', chainId)
            addNewConsoleLine(`walletClient.getChainId(): ${chainId}`)
            setConsoleLoading(false)
        } catch (e) {
            console.error(e)
            consoleErrorMesssage()
        }
    }

    const getBalance = async () => {
        try {
            resetConsole()
            const [account] = await walletClient.getAddresses()
            const balance = await publicClient.getBalance({
                address: account,
            })
            const formattedBalance = formatEther(balance)
            console.log('balance', formattedBalance)
            addNewConsoleLine(`balance: ${formattedBalance}`)

            setConsoleLoading(false)
        } catch (e) {
            console.error(e)
            consoleErrorMesssage()
        }
    }

    const getNetwork = async () => {
        try {
            resetConsole()
            const network = publicClient.chain
            console.log('network:', network)

            addNewConsoleLine(`network: ${JSON.stringify(network)}`)
            setConsoleLoading(false)
        } catch (e) {
            console.error(e)
            consoleErrorMesssage()
        }
    }

    const signMessage = async () => {
        try {
            resetConsole()
            const message = `Two roads diverged in a yellow wood,
                Robert Frost poet
                
                And sorry I could not travel both
                And be one traveler, long I stood
                And looked down one as far as I could
                To where it bent in the undergrowth;
                
                Then took the other, as just as fair,
                And having perhaps the better claim,
                Because it was grassy and wanted wear;
                Though as for that the passing there
                Had worn them really about the same,
                
                And both that morning equally lay
                In leaves no step had trodden black.
                Oh, I kept the first for another day!
                Yet knowing how way leads on to way,
                I doubted if I should ever come back.
                
                I shall be telling this with a sigh
                Somewhere ages and ages hence:
                Two roads diverged in a wood, and I—
                I took the one less traveled by,
                And that has made all the difference.`


            const [account] = await walletClient.getAddresses()

            // sign
            const sig = await walletClient.signMessage({
                message,
                account
            })
            console.log('signature:', sig)

            addNewConsoleLine(`signature: ${sig}`)

            const isValid = await publicClient.verifyMessage({
                address: account,
                message,
                signature: sig
            })

            console.log('isValid?', isValid)

            appendConsoleLine(`isValid? ${isValid}`)
            setConsoleLoading(false)
        } catch (e) {
            console.error(e)
            consoleErrorMesssage()
        }
    }

    const sendETH = async () => {
        try {
            resetConsole()

            console.log(`Transfer txn on ${walletClient.getChainId()}`)
            addNewConsoleLine(`Transfer txn on ${walletClient.getChainId()}`)

            const toAddress = ethers.Wallet.createRandom().address

            const balance1 = await publicClient.getBalance({
                address: toAddress
            })
            console.log(`balance of ${toAddress}, before:`, balance1)
            appendConsoleLine(`balance of ${toAddress}, before: ${balance1}`)

            const [account] = await walletClient.getAddresses()

            /* @ts-ignore-next-line */
            await walletClient.sendTransaction({
                to: toAddress,
                value: parseEther('1.00'),
                account,
            })

            const balance2 = await publicClient.getBalance({
                address: toAddress
            })
            console.log(`balance of ${toAddress}, after:`, balance2)
            appendConsoleLine(`balance of ${toAddress}, after: ${balance2}`)
            setConsoleLoading(false)
        } catch (e) {
            console.error(e)
            consoleErrorMesssage()
        }
    }

    

    const test2 = async () => {
        const { account } = await getWalletClient()

        const result = await readContract({
            address: '0x5cEEeCb83c027957360E54777ad03c136aCEDc76',
            abi: yubiaiArbitrable,
            functionName: 'deals',
            account,
            args: [1] // Pasar el argumento como un array con el tipo uint64
        });

        console.log(result, "result");
    }

    const disableActions = !isConnected

    const getWalletActions = () => {
        if (!isConnected) {
            return null
        }
        return (
            <>
                <Box marginBottom="4">
                    <Text>Please open your browser dev inspector to view output of functions below</Text>
                </Box>
                <Group label="State">
                    <Button disabled={disableActions} onClick={() => getChainID()}>
                        ChainID
                    </Button>
                    <Button disabled={disableActions} onClick={() => getNetwork()}>
                        Networks
                    </Button>
                    <Button disabled={disableActions} onClick={() => getBalance()}>
                        Get Balance
                    </Button>
                </Group>

                <Group label="Signing">
                    <Button disabled={disableActions} onClick={() => signMessage()}>
                        Sign Message
                    </Button>
                </Group>

                <Group label="Transactions">
                    <Button disabled={disableActions} onClick={() => sendETH()}>
                        Send ETH
                    </Button>

                </Group>
            </>
        )
    }

    return (
        <Box marginY="0" marginX="auto" paddingX="6" style={{ maxWidth: '720px', marginTop: '80px', marginBottom: '80px' }}>
            <Box marginBottom="4">
                <Image height="10" alt="logo" src={logoUrl} />
            </Box>

            <Box marginBottom="4">
                <Text color="text100" variant="large">Demo Dapp + RainbowKit</Text>
            </Box>

            <ConnectButton.Custom>
                {({
                    account,
                    chain,
                    openAccountModal,
                    openChainModal,
                    openConnectModal,
                    authenticationStatus,
                    mounted,
                }) => {
                    // Note: If your app doesn't use authentication, you
                    // can remove all 'authenticationStatus' checks
                    const ready = mounted && authenticationStatus !== 'loading';
                    const connected =
                        ready &&
                        account &&
                        chain &&
                        (!authenticationStatus ||
                            authenticationStatus === 'authenticated');

                    return (
                        <Box
                            {...(!ready && {
                                'aria-hidden': true,
                                'style': {
                                    opacity: 0,
                                    pointerEvents: 'none',
                                    userSelect: 'none',
                                },
                            })}
                        >
                            {(() => {
                                if (!connected) {
                                    return (
                                        <Button style={{ marginBottom: '20px' }} onClick={openConnectModal} type="button">
                                            Connect Wallet
                                        </Button>
                                    );
                                }

                                if (chain.unsupported) {
                                    return (
                                        <Button onClick={openChainModal} type="button">
                                            Wrong network
                                        </Button>
                                    );
                                }

                                return (
                                    <Box>
                                        <Button
                                            onClick={openChainModal}
                                            style={{ display: 'flex', alignItems: 'center' }}
                                            type="button"
                                        >
                                            {chain.hasIcon && (
                                                <Box
                                                    style={{
                                                        background: chain.iconBackground,
                                                        width: 12,
                                                        height: 12,
                                                        borderRadius: 999,
                                                        overflow: 'hidden',
                                                        marginRight: 4,
                                                    }}
                                                >
                                                    {chain.iconUrl && (
                                                        <img
                                                            alt={chain.name ?? 'Chain icon'}
                                                            src={chain.iconUrl}
                                                            style={{ width: 12, height: 12 }}
                                                        />
                                                    )}
                                                </Box>
                                            )}
                                            {chain.name}
                                        </Button>



                                        <Button onClick={openAccountModal} type="button">
                                            {account.displayName}
                                            {account.displayBalance
                                                ? ` (${account.displayBalance})`
                                                : ''}
                                        </Button>
                                    </Box>
                                );
                            })()}

                        </Box>
                    );
                }}
            </ConnectButton.Custom>
            {getWalletActions()}
            <Button bg="red.300" onClick={() => test2()}>
                Pruebaaaa
            </Button>
            <Console message={consoleMsg} loading={consoleLoading} />

        </Box>
    )
}
export default Test;