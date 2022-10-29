# TronBox bare-box

This is a bare-minimum TronBox (https://github.com/tronprotocol/tronbox)  project (`tronbox init`)

## How to init a minimalistic TronBox project

### Install TronBox

If you don't have Node.js on your Mac/Linux computer, install it using preferably NVM. On Linux/Mac you can run:

```
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.1/install.sh | bash
```

after open a new terminal and install the version of Node you prefer, for example the stable v10:

```
nvm install lts/dubnium
```

On Windows, you can install Nvm following the instructions at
https://github.com/coreybutler/nvm-windows



Once the npm is ready, install TronBox globally

```
npm i -g tronbox
```

Then, create a directory and initialize bare-box project there
```
mkdir tronbox-example
cd tronbox-example
tronbox init
```

### Configure Network Information for TronBox

To use TronBox, your dApp has to have a network configuration file `tronbox.js` in the source root. This special file tells TronBox how to connect to nodes, event server, and passes some special parameters, like the default private key. An example of `tronbox.js` can be found [here](https://github.com/Tronbox-boxes/bare-box/blob/master/tronbox.js). 

If you are connecting to **different** hosts for fullnode, solidity node, and event server, you may set `fullNode`, `solidityNode` and `eventServer` respectively:

```
module.exports = {
  networks: {
    development: {
			...
      fullNode: "http://127.0.0.1:8090",
      solidityNode: "http://127.0.0.1:8091",
      eventServer: "http://127.0.0.1:8092",
      network_id: "*"
    },
    mainnet: {
			...
      fullNode: "https://api.trongrid.io",
      solidityNode: "https://api.trongrid.io",
      eventServer: "https://api.trongrid.io",
      network_id: "*"
    }
  }
};
```

If you are connecting to the **same** host for fullnode, solidity node, and event server, you can just set `fullHost`:

```
module.exports = {
  networks: {
    development: {
			...
      fullHost: "http://127.0.0.1:9090",
      network_id: "*"
    },
    mainnet: {
			...
      fullHost: "https://api.trongrid.io",
      network_id: "*"
    }
  }
};
```

### Run the example dApp on local private network

`tronbox migrate` by default will use the `development` network. In order to test the smart contracts and deploy them locally, you must deploy a local fullnode with [Tron Quickstart](https://github.com/TRON-US/docker-tron-quickstart) or [java-tron](https://github.com/tronprotocol/java-tron).

**Tron Quickstart** (https://github.com/TRON-US/docker-tron-quickstart) 

1. [Install Docker](https://docs.docker.com/install/).
2. Deploy Tron Quickstart:

```
docker run -it --rm -p 9090:9090 --name tron trontools/quickstart
```

**java-tron** (https://github.com/tronprotocol/java-tron)

Check out [Tron Deployment](https://tronprotocol.github.io/documentation-en/developers/deployment/) if you would like to deploy a local Tron fullnode with [java-tron](https://github.com/tronprotocol/java-tron).



Having the local fullnode ready, you may:

1. Setup the dApp.

```
tronbox migrate --reset
```

This command will invoke all migration scripts within the migrations directory.

2. Run the dApp:

```
npm run dev
```

It will automatically open the dApp in the default browser.

### Run the example dApp on Testnet

There are 2 testnet in Tron: [Shasta](https://www.trongrid.io/shasta/) & [Nile](https://nileex.io/)

1. You need an account with some testnet TRX.
2. If you don't have a Tron wallet, install the Chrome Extension version of TronLink from https://www.tronlink.org/ and create an account.
3. Click the TronLink extension, click on Settings -> Node Manage -> select Shasta / Nile testnet.
4. If you don't have any testnet TRX, request some testnet TRX at:
   - Shasta https://www.trongrid.io/faucet 
   - Nile https://nileex.io/join/getJoinPage 
5. Create a file called `.env` in the root of this repo and edit it, adding a line with your Private Key like:

```
export PRIVATE_KEY_SHASTA=0122194812081292938435739857438538457349573485358345345934583554
```

```
export PRIVATE_KEY_NILE=0122194812081292938435739857438538457349573485358345345934583554
```

You can find an example in `sample-env` [here](https://github.com/Tronbox-boxes/bare-box/blob/master/sample-env).

6. Setup the dApp. The dApp needs to know the address where the contract has been deployed. 

```
source .env && tronbox migrate --reset --network <shasta|nile>
```

It will execute the migration. This won't work if the `.env` file is not found.

7. Run the dApp:

```
npm run dev
```

It automatically will open the dApp in the default browser.



Now you are ready to start developing your Dapp. Enjoy!