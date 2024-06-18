interface RpcPrefsInterface {
    blockExplorerUrl?: string;
}
export declare function createAccountLink(address: string, networkId: string): string;
export declare function createAccountLinkForChain(address: string, chainId: string): string;
export declare function createCustomAccountLink(address: string, customNetworkUrl: string): string;
export declare function getAccountLink(address: string, chainId: string, rpcPrefs?: RpcPrefsInterface, networkId?: string): string;
export {};
