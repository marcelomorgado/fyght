import { ContractTransaction, ContractReceipt } from "ethers";

export const optimisticUpdate = async ({
  doTransaction,
  onOptimistic,
  onSuccess,
  onError,
  getState,
}: {
  doTransaction: () => Promise<ContractTransaction>;
  onOptimistic?: () => void;
  onSuccess?: (receipt?: ContractReceipt) => void;
  onError: (errorMessage: string, receipt?: ContractReceipt) => void;
  getState: () => FyghtState;
}): Promise<void> => {
  const {
    metamask: { provider },
  } = getState();

  if (onOptimistic) {
    onOptimistic();
  }

  try {
    const tx: ContractTransaction = await doTransaction();

    provider.once(tx.hash, (receipt: ContractReceipt) => {
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
    console.debug(e);
    const errorMessage =
      e.data && e.data.message
        ? e.data.message.replace("VM Exception while processing transaction: revert ", "")
        : "Unexpected error";

    onError(errorMessage);
  }
};
