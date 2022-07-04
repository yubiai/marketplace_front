import { Buffer } from 'buffer'
import { curator } from '../escrow-utils/abis';

// Kovan
const CURATOR_CONTRACT = '0x7Fb316EBf3dfa2A8ba6267eDfDaDA1E60F5Fe217';

const columnsForItem = [
    { label: "Title", description: "Title of the item", type: "text", isIdentifier: true },
    { label: "Description", description: "Description of the item", type: "long text", isIdentifier: false },
    { label: "Price", description: "Price of the item", type: "number" },
    { label: "Currency Symbol Price", description: "Currency used for the item's price", type: "text" },
    { label: "Main pict", description: "The first picture of the item", type: "image", isIdentifier: false },
    { label: "2nd Pict", description: "Additional pict of the item", type: "image", isIdentifier: false },
    { label: "3rd Pict", description: "Additional pict of the item", type: "image", isIdentifier: false },
    { label: "4th Pict", description: "Additional pict of the item", type: "image", isIdentifier: false },
    { label: "Seller", description: "ID of the seller from DB", type: "text" },
    { label: "Max Orders", description: "Stock of items", type: "number" },
    { label: "Slug", description: "Slug of item", type: "text" },
    { label: "Category", description: "Category ID of the item from DB", type: "text" },
    { label: "Sub Category", description: "Sub Category ID of the item from DB", type: "text" }
];


export default class Curator {
    constructor(web3, account) {
      this.web3 = web3
      this.initCurator(account);
    }

    initCurator(account) {
        this.contract = new this.web3.eth.Contract(
            curator, CURATOR_CONTRACT, { from: account },
        );
    }

    async submitItemToCurator (data, picts=[]) {
        const form = new FormData();
        const {
            title,
            description,
            price,
            currencySymbolPrice,
            seller,
            maxOrders,
            slug,
            category,
            subCategory
        } = data;
        const ordinalPicts = {
            0: 'Main pict',
            1: '2nd Pict',
            2: '3rd Pict',
            3: '4th Pict'
        };
        const formValues = {
            'Title': title,
            'Description': description,
            'Price': price,
            'Currency Symbol Price': currencySymbolPrice,
            'Seller': seller,
            'Max Orders': maxOrders,
            'Slug': slug,
            'Category': category,
            'Sub Category': subCategory,
            'Main pict': '',
            '2nd Pict': '',
            '3rd Pict': '',
            '4th Pict': ''
        };
        
        for (const i = 0; i < picts.length; i++) {
            const pict = picts[i];
            const result = await this.upload(pict.name, pict);
            formValues[ordinalPicts[i]] = result;
        }

        // FIXME: f.path is required!
        const jsn = JSON.stringify({ columns: columnsForItem, values: formValues });
        const blob = new Blob([jsn], { type: 'application/json' });
        const f = new File([ blob ], 'item.json');
        await fetch(
            'https://api.thegraph.com/ipfs/api/v0/add?wrap-with-directory=true', {
                method: 'POST',
                body: f
        })
        if (response && response.data) {
            const uploadResponse = await this.upload('item.json', {
                columns: { ... columnsForItem },
                values: formValues
            });
            await this.addItem(uploadResponse);
        }
    }

    async upload(fileName, bufferOrJSON) {
        let dataHash = '';
        let dataPath = '';

        if (typeof bufferOrJSON !== 'string' && !Buffer.isBuffer(bufferOrJSON)) {
            bufferOrJSON = JSON.stringify(bufferOrJSON)
    
            const res = await fetch(`${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/add`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                fileName,
                buffer: Buffer.from(bufferOrJSON),
              }),
            });
            const json = await res.json();
            const data = json.data;
            dataHash = data[1].hash;
            dataPath = data[0].path;

            const url = `${process.env.NEXT_PUBLIC_IPFS_GATEWAY}/ipfs/${dataHash}${dataPath}`; 
            await fetch(url, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
        }
        return `/ipfs/${dataHash}${dataPath}`;
    }

    async addItem(item) {
            return await this.contract.methods.addItem(item).call();
    }
}