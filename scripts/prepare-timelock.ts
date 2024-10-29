import { Addressable, ContractTransaction, ZeroAddress } from 'ethers';
import hre, { ethers } from 'hardhat';

export const getTimelock = async (address?: string | Addressable) => {
  if (!address) address = (await hre.deployments.get('TimelockControllerEnumerable')).address;
  return await hre.ethers.getContractAt('TimelockControllerEnumerable', address);
};

export const prepareTimelockData = async (
  txs: ContractTransaction[] = [],
  timelockAddr?: string | Addressable
) => {
  const timelock = await getTimelock(timelockAddr);

  const salt = ethers.id('salt');
  const predecessor = ethers.zeroPadValue('0x00', 32);
  console.log('using salt', salt);
  console.log('using predecessor', predecessor);

  const minDelay = await timelock.getMinDelay();
  console.log('minDelay', minDelay);

  const schedule = await timelock.scheduleBatch.populateTransaction(
    txs.map((tx) => tx.to),
    txs.map(() => 0),
    txs.map((tx) => tx.data),
    predecessor,
    salt,
    minDelay
  );
  const execute = await timelock.executeBatch.populateTransaction(
    txs.map((tx) => tx.to),
    txs.map(() => 0),
    txs.map((tx) => tx.data),
    predecessor,
    salt
  );

  console.log('schedule tx', schedule);
  console.log('execute tx', execute);

  return { schedule, execute };
};