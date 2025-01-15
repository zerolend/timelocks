import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { ContractTransaction, ZeroAddress } from 'ethers';
import { mockExecuteTimelock } from '../mock-exec-timelock';

const job = async () => {
  assert(
    hre.network.name === 'hardhat' ||
      hre.network.name === 'tenderly' ||
      hre.network.name === 'base',
    'not mainnet'
  );
  console.log(`Using the network ${hre.network.name}`);

  const TIMELOCK = await getTimelock(hre, '0x00000Ab6Ee5A6c1a7Ac819b01190B020F7c6599d');
  const SAFE = '0x6F5Ae60d89dbbc4EeD4B08d08A68dD5679Ac61B4';
  const POOL_ADDRESS_PROVIDER = '0x5213ab3997a596c75Ac6ebF81f8aEb9cf9A31007';
  const NEW_POOL_IMPL = ZeroAddress; // TODO: Add the new pool implementation address
  const poolAddressProvider = await hre.ethers.getContractAt(
    'PoolAddressesProvider',
    POOL_ADDRESS_PROVIDER
  );
  const data = poolAddressProvider.interface.encodeFunctionData('setPoolImpl', [NEW_POOL_IMPL]);
  const txs: ContractTransaction[] = [];

  txs.push({
    to: POOL_ADDRESS_PROVIDER,
    data: data,
  });

  const tx = await prepareTimelockData(hre, SAFE, txs, TIMELOCK.target);

  await mockExecuteTimelock(tx.schedule,tx.execute,86400 * 5,'base',async()=>{
    console.log('executed');
  })
};

job();
