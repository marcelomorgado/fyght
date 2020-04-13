import { TransactionReceipt } from "ethers/providers";
import { Transaction } from "ethers/utils";

export const optimisticUpdate = async ({
  doTransaction,
  onOptimistic,
  onSuccess,
  onError,
  getState,
}: {
  doTransaction: () => Promise<Transaction>;
  onOptimistic?: () => void;
  onSuccess?: (receipt?: TransactionReceipt) => void;
  onError: (errorMessage: string, receipt?: TransactionReceipt) => void;
  getState: () => FyghtState;
}): Promise<void> => {
  const {
    metamask: { loomProvider },
  } = getState();

  if (onOptimistic) {
    onOptimistic();
  }

  try {
    const tx = await doTransaction();
    console.log(tx);
    loomProvider.once(tx.hash, (receipt: TransactionReceipt) => {
      const { status } = receipt;
      if (!status) {
        onError("", receipt);
        return;
      }
      if (onSuccess) {
        onSuccess(receipt);
      }
    });
  } catch (e) {
    // Note: Keeping for now due debug purposes
    console.log(e);

    const errorMessage =
      e.data && e.data.message
        ? e.data.message.replace("VM Exception while processing transaction: revert ", "")
        : "Unexpected error";

    onError(errorMessage);
  }
};
