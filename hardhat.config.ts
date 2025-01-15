import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-chai-matchers';
import '@nomicfoundation/hardhat-ethers';
import '@nomicfoundation/hardhat-toolbox';
import '@openzeppelin/hardhat-upgrades';
import '@typechain/hardhat';
import 'hardhat-abi-exporter';
import 'hardhat-contract-sizer';
import 'hardhat-dependency-compiler';
import 'hardhat-deploy';
// import 'hardhat-tracer';

import dotenv from 'dotenv';
dotenv.config();

const defaultAccount = [process.env.PRIVATE_KEY || '0x'];

import './tasks/transfer-timelock-admin';
import './tasks/audit-timelock';

const _network = (url: string, gasPrice: number | 'auto' = 'auto') => ({
  url,
  accounts: defaultAccount,
  saveDeployments: true,
  gasPrice,
});

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.19',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
      {
        version: '0.8.12',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  dependencyCompiler: {
    paths: [
      '@zerolendxyz/core-v3/contracts/protocol/pool/PoolConfigurator.sol',
      '@zerolendxyz/core-v3/contracts/protocol/pool/Pool.sol',
      '@zerolendxyz/core-v3/contracts/misc/AaveOracle.sol',
      '@zerolendxyz/core-v3/contracts/protocol/tokenization/AToken.sol',
      '@zerolendxyz/core-v3/contracts/protocol/configuration/ACLManager.sol',
      "@zerolendxyz/core-v3/contracts/protocol/configuration/PoolAddressesProvider.sol"
    ],
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      live: false,
      loggingEnabled: false,
      allowBlocksWithSameTimestamp: true,
      allowUnlimitedContractSize: true,
      accounts: [
        {
          privateKey: process.env.PRIVATE_KEY || '0x',
          balance: '10000000000000000000000',
        },
      ],
      forking: {
        enabled: true,
        // url: 'https://rpc.ankr.com/base',
        url: 'https://cloudflare-eth.com',
        // url: 'https://rpc.ankr.com/zksync_era',
        // url: 'http://127.0.0.1:8011',
      },
    },
    tenderly: _network('https://rpc.tenderly.co/fork/01de304d-fa76-4dd1-bca1-7e99af9442f6'),
    arbitrum: _network('https://arb1.arbitrum.io/rpc'),
    base: _network('https://mainnet.base.org'),
    bsc: _network('https://bsc-dataseed1.bnbchain.org'),
    blast: _network('https://rpc.blast.io'),
    linea: _network('https://rpc.linea.build'),
    mainnet: _network('https://rpc.ankr.com/eth'),
    // zksync: _network('http://127.0.0.1:8011'),
    zksync: _network('https://mainnet.era.zksync.io'),
    manta: _network('https://pacific-rpc.manta.network/http'),
    zircuit: _network('https://zircuit-mainnet.drpc.org'),
    optimism: _network('https://mainnet.optimism.io'),
    scroll: _network('https://rpc.ankr.com/scroll', 1100000000),
    sepolia: _network('https://rpc2.sepolia.org'),
    xlayer: _network('https://xlayerrpc.okx.com'),
  },
  namedAccounts: {
    deployer: 0,
  },
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_KEY || '',
      sepolia: process.env.ETHERSCAN_KEY || '',
      base: process.env.BASESCAN_KEY || '',
      blast: process.env.BLASTSCAN_KEY || '',
      manta: 'test',
      bsc: process.env.BSCSCAN_KEY || '',
      linea: process.env.LINEASCAN_KEY || '',
      optimisticEthereum: process.env.OP_ETHERSCAN_KEY || '',
      scroll: process.env.SCROLLSCAN_KEY || '',
      arbitrumOne: process.env.ARBISCAN_KEY || '',
      xlayer: 'test',
    },
    customChains: [
      {
        network: 'xlayer',
        chainId: 196,
        urls: {
          apiURL:
            'https://www.oklink.com/api/v5/explorer/contract/verify-source-code-plugin/XLAYER',
          browserURL: 'https://www.oklink.com/xlayer',
        },
      },
      {
        network: 'linea',
        chainId: 59144,
        urls: {
          apiURL: 'https://api.lineascan.build/api',
          browserURL: 'https://lineascan.build',
        },
      },
      {
        network: 'blast',
        chainId: 81457,
        urls: {
          apiURL: 'https://api.blastscan.io/api',
          browserURL: 'https://blastscan.io',
        },
      },
      {
        network: 'manta',
        chainId: 169,
        urls: {
          apiURL: 'https://pacific-explorer.manta.network/api',
          browserURL: 'https://pacific-explorer.manta.network',
        },
      },
      {
        network: 'scroll',
        chainId: 534352,
        urls: {
          apiURL: 'https://api.scrollscan.com/api',
          browserURL: 'https://scrollscan.com',
        },
      },
    ],
  },
};

export default config;
