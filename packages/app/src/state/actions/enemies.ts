import { StoreActionApi } from "react-sweet-state";
import { ethers, Event, BigNumber } from "ethers";

// TODO: Dry
type StoreApi = StoreActionApi<FyghtState>;

export const fetchAllEnemies = () => async ({ setState, getState }: StoreApi): Promise<void> => {
  const {
    metamask: {
      contracts: { fyghters },
      provider,
      account,
    },
    myFyghter,
  } = getState();

  if (!fyghters || !provider) {
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

  const filter = fyghters.filters.FyghterCreated(null, null, null);
  const logs = await fyghters.queryFilter(filter, 0, "latest");

  const { getAddress } = ethers.utils;

  const enemiesIds = logs
    .map((l: Event) => l.args)
    .filter(({ owner }: FyghterCreated) => !account || getAddress(owner) !== getAddress(account))
    .map(({ id }: FyghterCreated) => id);

  const enemiesPromises = enemiesIds.map((id: BigNumber) => loadEnemy(id));
  const enemies: Enemy[] = await Promise.all(enemiesPromises);

  setState({ enemies });
};
