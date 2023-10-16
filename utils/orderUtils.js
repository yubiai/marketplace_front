import moment from "moment";
import { ethers } from "ethers";

const DEFAULT_TIMEOUT = 604800;

const translateStatusIdToNamingInTransaction = (statusId = 0) => {
    const WAITING_STATUS = 0;
    const APPEALABLE_STATUS = 1;
    const SOLVED_STATUS = 2;

    switch (statusId) {
        case APPEALABLE_STATUS:
            return 'ORDER_DISPUTE_APPEALABLE';
        case SOLVED_STATUS:
            return 'ORDER_DISPUTE_FINISHED';
        case WAITING_STATUS:
        default:
            return 'ORDER_DISPUTE_IN_PROGRESS';
    }
}

const getProtocolNamingFromNetwork = (network) => {
    const capitalNameNetwork = network?.charAt(0).toUpperCase() + network?.slice(1);
    return network !== 'Mainnet' ? `${capitalNameNetwork} ERC20` : 'ERC20';
}

const parsePriceToETHAmount = (priceInUSD, ethData, web3Instance) => {
    const { price } = ethData || { price: 1 };
    const rateValue = (priceInUSD / price);
    return web3Instance.utils.toWei(rateValue.toString())
}

const parseFromAToBToken = (basePrice, tokenA, tokenB) => {
    const priceA = tokenA?.price;
    const priceB = tokenB?.price;

    const rateValue = (basePrice * priceA) / priceB;
    return rateValue
}

const totalAmountOrder = (orders = []) => {
    return orders.reduce(
        (currentVal, prevOrder) => currentVal + prevOrder.price, 0) || 0;
};

const parseItemIntoOrderTransaction = (
    item = {},
    recipient,
    currencyContract = '',
    timeout = DEFAULT_TIMEOUT
) => {
    const generatedDescription = item.title
    const compiledItemIds = item._id

    const now = new Date()
    const month = now.getMonth() + 1
    const day = now.getDate() + 1
    const date = `${now.getFullYear()}-${month < 10 ? `0${month}` : month}-${day < 10 ? `0${day}` : day}`

    const generatedTitle = `Order for item: ${compiledItemIds}, Date ${date}`

    const totalOrderValue = item.price

    return {
        orderInfo: {
            item
        },
        transaction: {
            title: generatedTitle,
            description: generatedDescription,
            extraData: {
                'Contract information': generatedTitle
            },
            amount: {
                value: totalOrderValue,
                currency: currencyContract
            },
            recipient: recipient.toLowerCase(),
            timeout
        }
    }
}

const calculateFinishDate = (transactionDate, claimCount, claimSolvedAt, TimeForService, TimeFormClaim, TimeForReclaim) => {

    let dateCalcu

    /* const TimeFormClaim = Number(process.env.NEXT_PUBLIC_TIME_FOR_CLAIM);
    const TimeForService = Number(process.env.NEXT_PUBLIC_TIME_FOR_SERVICE);
    const TimeForReclaim = Number(process.env.NEXT_PUBLIC_TIME_FOR_RECLAIM); */

    if (claimCount > 0) {
        // SC -> return (block.timestamp >= (claims[deal.currentClaim].solvedAt + settings.timeForReclaim));

        dateCalcu = claimSolvedAt + TimeForReclaim;

        dateCalcu = moment(dateCalcu * 1000).format('MM/DD/YYYY, h:mm:ss a')

        return dateCalcu;
    }

    //SC -> return (block.timestamp >= (deal.createdAt + deal.timeForService + deal.timeForClaim));

    dateCalcu = transactionDate / 1000 + TimeForService + TimeFormClaim;

    dateCalcu = moment(dateCalcu * 1000).format('MM/DD/YYYY, h:mm:ss a')

    return dateCalcu;
}

const parserForWei = (value) => {
    const valorBigNumber = ethers.BigNumber.from(value.toString());
    const valorEnEther = ethers.utils.formatEther(valorBigNumber);
    const valorEnFloat = parseFloat(valorEnEther).toFixed(5);
    return valorEnFloat;
}

const formatDayBySeconds = (value) => {
    const segundosEnUnDia = 86400;
    return value * segundosEnUnDia;
}

const getFullStatusOfDealClaim = (value, dealId) => {
    return new Promise((resolve, reject) => {
        try{
            console.log(value, "valueeeeeeeeeeeee")
            const dealInfo = value[0].result;
            const claimInfo = value[1].result;
            const isOver = value[2].result;
            const settings = value[3].result;
    
            console.log(dealInfo, claimInfo, isOver, settings);
            let formattedClaimInfo = {};
    
            const disputeId = claimInfo[0];
    
            formattedClaimInfo = {
                claimID: Number(dealInfo[11]),
                claimStatus: claimInfo[6],
                claimCreatedAt: parseInt(claimInfo[4], 10),
                claimSolvedAt: parseInt(claimInfo[5]),
                claimCount: parseInt(dealInfo[4], 10),
                disputeId: parseInt(disputeId, 10),
                timeForClaim: parseInt(dealInfo[9], 10),
                maxClaimsAllowed: parseInt(settings[1], 10),
                timeForChallenge: parseInt(settings[3], 10)
            };
    
    
            return resolve({
                deal: {
                    dealId,
                    dealStatus: dealInfo[2].toString(),
                    dealCreatedAt: parseInt(dealInfo[7], 10),
                    timeForService: parseInt(dealInfo[8], 10),
                    isOver,
                },
                claim: {
                    ...formattedClaimInfo,
                }
            });
        } catch(err){
            return reject(false);
        }
    })
}


export {
    parseItemIntoOrderTransaction,
    totalAmountOrder,
    parsePriceToETHAmount,
    getProtocolNamingFromNetwork,
    parseFromAToBToken,
    translateStatusIdToNamingInTransaction,
    calculateFinishDate,
    parserForWei,
    formatDayBySeconds,
    getFullStatusOfDealClaim
}