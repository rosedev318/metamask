interface RpcPrefsInterface {
    blockExplorerUrl?: string;
}
export declare function createTokenTrackerLink(tokenAddress: string, networkId: string, holderAddress?: string): string;
export declare function createCustomTokenTrackerLink(tokenAddress: string, customNetworkUrl: string): string;
export declare function createTokenTrackerLinkForChain(tokenAddress: string, chainId: string, holderAddress?: string): string;
export declare function getTokenTrackerLink(tokenAddress: string, chainId: string, networkId: string, holderAddress?: string, rpcPrefs?: RpcPrefsInterface): string;
export {};
