// Do the listing of ezETH Dec PT on mainnet lrt
import hre from 'hardhat';
import assert from 'assert';
import { getTimelock, prepareTimelockData } from '../prepare-timelock';
import { mockExecuteTimelock } from '../mock-exec-timelock';
import { ContractTransaction } from 'ethers';

const job = async () => {
  assert(
    hre.network.name === 'mainnet' ||
      hre.network.name === 'hardhat' ||
      hre.network.name === 'tenderly',
    'not mainnet'
  );
  console.log('using network', hre.network.name);
  const timelock = await getTimelock('0x00000Ab6Ee5A6c1a7Ac819b01190B020F7c6599d');
  const safe = '0x4e88e72bd81c7ea394cb410296d99987c3a242fe';
  const pool = await hre.ethers.getContractAt('Pool', '0x3BC3D34C32cc98bf098D832364Df8A222bBaB4c0');

  const txs: ContractTransaction[] = [];

  txs.push({
    to: '0x43CcF5E5F694E15Ec159bC7112c6119bac84f79e',
    data: '0x107eef45000000000000000000000000fd856e1a33225b86f70d686f9280435e3ff75fcf00000000000000000000000000000000000000000000000000000000000001800000000000000000000000006d8a6ba0e998b7967efd05ccfcb5f540a0a96d39000000000000000000000000f7906f274c174a52d444175729e3fa98f9bde2850000000000000000000000000000000000000000000000000000000000002328000000000000000000000000000000000000000000000000000000000000251c000000000000000000000000000000000000000000000000000000000000290400000000000000000000000000000000000000000000000000000000000003e8000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000bb80000000000000000000000000000000000000000000000000000000000000bb8000000000000000000000000b7ed499e7570ee7691eef4df9d708d258de2b512000000000000000000000000e230cf9cee7b299f69778ef950a61de0de520ba70000000000000000000000005d50be703836c330fc2d147a631cdd7bb8d7171c0000000000000000000000000000000000000000000000000000000000000012000000000000000000000000052c1efd159519d3b13b6bb052449fdb5c4284a0000000000000000000000000f7906f274c174a52d444175729e3fa98f9bde2850000000000000000000000004e88e72bd81c7ea394cb410296d99987c3a242fe0000000000000000000000005be89bb10e2234204a2607765714916ed95a73a200000000000000000000000000000000000000000000000000000000000001e00000000000000000000000000000000000000000000000000000000000000240000000000000000000000000000000000000000000000000000000000000028000000000000000000000000000000000000000000000000000000000000002e00000000000000000000000000000000000000000000000000000000000000320000000000000000000000000000000000000000000000000000000000000038000000000000000000000000000000000000000000000000000000000000003c000000000000000000000000000000000000000000000000000000000000000215a65726f4c656e642050542052656e7a6f20657a455448203236444543323032340000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000147a3050542d657a4554482d323644454332303234000000000000000000000000000000000000000000000000000000000000000000000000000000000000002c5a65726f4c656e64207a6b205661726961626c6520446562742050542d657a4554482d323644454332303234000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000207661726961626c65446562747a3050542d657a4554482d323644454332303234000000000000000000000000000000000000000000000000000000000000002a5a65726f4c656e64207a6b20537461626c6520446562742050542d657a4554482d32364445433230323400000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000001e737461626c65446562747a3050542d657a4554482d323644454332303234000000000000000000000000000000000000000000000000000000000000000000011000000000000000000000000000000000000000000000000000000000000000',
  });

  const tx = await prepareTimelockData(safe, txs, timelock.target);
  const reservesCount = await pool.getReservesCount();

  console.log('reserves count', reservesCount.toString());
  await mockExecuteTimelock(tx.schedule, tx.execute, 86400 * 5, 'mainnet', async () => {
    const reservesCountAfter = await pool.getReservesCount();
    console.log('reserves count after', reservesCountAfter.toString());
  });
};

job();