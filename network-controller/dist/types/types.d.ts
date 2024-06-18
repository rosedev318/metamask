import type { InfuraNetworkType } from '@metamask/controller-utils';
import type { SafeEventEmitterProvider } from '@metamask/eth-json-rpc-provider';
import type { Hex } from '@metamask/utils';
import type { BlockTracker as BaseBlockTracker } from 'eth-block-tracker';
export declare type Provider = SafeEventEmitterProvider;
export declare type BlockTracker = BaseBlockTracker & {
    checkForLatestBlock(): Promise<string>;
};
/**
 * The type of network client that can be created.
 */
export declare enum NetworkClientType {
    Custom = "custom",
    Infura = "infura"
}
/**
 * A configuration object that can be used to create a client for a custom
 * network.
 */
export declare type CustomNetworkClientConfiguration = {
    chainId: Hex;
    rpcUrl: string;
    ticker: string;
    type: NetworkClientType.Custom;
};
/**
 * A configuration object that can be used to create a client for an Infura
 * network.
 */
export declare type InfuraNetworkClientConfiguration = {
    chainId: Hex;
    network: InfuraNetworkType;
    infuraProjectId: string;
    ticker: string;
    type: NetworkClientType.Infura;
};
/**
 * A configuration object that can be used to create a client for a network.
 */
export declare type NetworkClientConfiguration = CustomNetworkClientConfiguration | InfuraNetworkClientConfiguration;
//# sourceMappingURL=types.d.ts.map