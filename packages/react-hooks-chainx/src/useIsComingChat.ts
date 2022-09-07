export default function useIsComingChat() {
  return (window as any)?.web3?.currentProvider?.isComingWallet || (window as any)?.web3?.currentProvider?.isTrust
}
