import { StoreActionApi } from "react-sweet-state";
import { ethers, Event } from "ethers";
import { BigNumber } from "ethers/utils";
import Fyghters from "../../contracts/Fyghters.json";

// eslint-disable-next-line no-undef
const LOOM_NETWORK_ID = process.env.LOOM_NETWORK_ID;

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const fetchAllEnemies = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { fyghters },
      loomProvider,
      loomAccount: account,
    },
    myFyghter,
  } = getState();

  if (!fyghters || !loomProvider) {
    setState({ enemies: [] });
    return;
  }

  const loadEnemy = async (id: BigNumber): Promise<Enemy> => {
    const fyghter: Fyghter = await fyghters.fyghters(id);

    let winProbability = null;

    if (myFyghter && myFyghter.id) {
      const { id: myFyghterId } = myFyghter;
      winProbability = await fyghters.calculateWinProbability(myFyghterId, id);
    }
    return { fyghter, winProbability };
  };

  const { getAddress } = ethers.utils;

  const {
    networks: {
      [LOOM_NETWORK_ID]: { transactionHash },
    },
  } = Fyghters as ContractJson;

  const { blockNumber: from } = await loomProvider.getTransactionReceipt(transactionHash);
  const to = await loomProvider.getBlockNumber();

  const toScan = to - from;
  const maxBlocksPerQuery = 100;
  const numberOfQueries = Math.ceil(toScan / maxBlocksPerQuery);
  const queries = [...Array(numberOfQueries)].map((k, i) => [
    from + i * maxBlocksPerQuery,
    from + (i + 1) * maxBlocksPerQuery - 1,
  ]);

  //
  // Ethers v5
  //
  // const filter = fyghters.filters.FyghterCreated(null, null, null);
  // const logs = (
  //   await Promise.all(queries.map(async ([from, to]) => await fyghters.queryFilter(filter, from, to)))
  // ).reduce((a, b) => [...a, ...b], []);

  // const enemiesIds = logs
  //   .map((l: Event) => l.args)
  //   .filter(({ owner }: FyghterCreated) => !account || getAddress(owner) !== getAddress(account))
  //   .map(({ id }: FyghterCreated) => id);

  //
  // Ethers v4
  //
  const event = fyghters.interface.events["FyghterCreated"];
  const topic = event.topic;
  const logs = (
    await Promise.all(
      queries.map(
        async ([from, to]) =>
          await loomProvider.getLogs({
            address: fyghters.address,
            fromBlock: from,
            toBlock: to,
            topics: [topic],
          })
      )
    )
  ).reduce((a, b) => [...a, ...b], []);
  const enemiesIds = logs
    .map((log: Event) => event.decode(log.data, log.topics))
    .filter(({ owner }: { owner: string }) => (account ? getAddress(owner) !== getAddress(account) : true))
    .map(({ id }: { id: BigNumber }) => id);

  const enemiesPromises = enemiesIds.map((id: BigNumber) => loadEnemy(id));
  const enemies: Enemy[] = await Promise.all(enemiesPromises);

  setState({ enemies });
};
