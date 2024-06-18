interface TransactionInterface {
    hash: string;
    chainId: string;
    metamaskNetworkId: string;
}
interface RpcPrefsInterface {
    blockExplorerUrl?: string;
}
export declare function createCustomExplorerLink(hash: string, customNetworkUrl: string): string;
export declare function createExplorerLink(hash: string, network: string): string;
export declare function createExplorerLinkForChain(hash: string, chainId: string): string;
export declare function getBlockExplorerLink(transaction: TransactionInterface, rpcPrefs?: RpcPrefsInterface): string;
export {};
