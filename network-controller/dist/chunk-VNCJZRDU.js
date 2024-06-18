"use strict";Object.defineProperty(exports, "__esModule", {value: true}); function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _chunkZKNI7MD3js = require('./chunk-ZKNI7MD3.js');


var _chunkLTT6WJXCjs = require('./chunk-LTT6WJXC.js');



var _chunkVGYLDDJBjs = require('./chunk-VGYLDDJB.js');





var _chunkZ4BLTVTBjs = require('./chunk-Z4BLTVTB.js');

// src/NetworkController.ts
var _basecontroller = require('@metamask/base-controller');








var _controllerutils = require('@metamask/controller-utils');
var _ethquery = require('@metamask/eth-query'); var _ethquery2 = _interopRequireDefault(_ethquery);
var _rpcerrors = require('@metamask/rpc-errors');
var _swappableobjproxy = require('@metamask/swappable-obj-proxy');




var _utils = require('@metamask/utils');
var _assert = require('assert');
var _uuid = require('uuid');
var log = _chunkVGYLDDJBjs.createModuleLogger.call(void 0, _chunkVGYLDDJBjs.projectLogger, "NetworkController");
function knownKeysOf(object) {
  return Object.keys(object);
}
function assertOfType(value, validate, message) {
  _assert.strict.ok(validate(value), message);
}
function pick(object, keys) {
  const pickedObject = keys.reduce(
    (finalObject, key) => {
      return { ...finalObject, [key]: object[key] };
    },
    {}
  );
  assertOfType(
    pickedObject,
    () => keys.every((key) => key in pickedObject),
    "The reduce did not produce an object with all of the desired keys."
  );
  return pickedObject;
}
function isErrorWithCode(error) {
  return typeof error === "object" && error !== null && "code" in error;
}
function buildInfuraNetworkClientId(infuraNetworkOrProviderConfig) {
  if (typeof infuraNetworkOrProviderConfig === "string") {
    return infuraNetworkOrProviderConfig;
  }
  return infuraNetworkOrProviderConfig.type;
}
function buildCustomNetworkClientId(...args) {
  if (args.length === 1) {
    return args[0];
  }
  const [{ id, rpcUrl }, networkConfigurations] = args;
  if (id === void 0) {
    const matchingNetworkConfiguration = Object.values(
      networkConfigurations
    ).find((networkConfiguration) => {
      return networkConfiguration.rpcUrl === rpcUrl.toLowerCase();
    });
    if (matchingNetworkConfiguration) {
      return matchingNetworkConfiguration.id;
    }
    return rpcUrl.toLowerCase();
  }
  return id;
}
function isInfuraProviderConfig(providerConfig) {
  return _controllerutils.isInfuraNetworkType.call(void 0, providerConfig.type);
}
function isCustomProviderConfig(providerConfig) {
  return providerConfig.type === _controllerutils.NetworkType.rpc;
}
function validateCustomProviderConfig(providerConfig) {
  if (providerConfig.chainId === void 0) {
    throw new Error("chainId must be provided for custom RPC endpoints");
  }
  if (providerConfig.rpcUrl === void 0) {
    throw new Error("rpcUrl must be provided for custom RPC endpoints");
  }
}
var name = "NetworkController";
var defaultState = {
  selectedNetworkClientId: _controllerutils.NetworkType.mainnet,
  providerConfig: {
    type: _controllerutils.NetworkType.mainnet,
    chainId: _controllerutils.ChainId.mainnet,
    ticker: _controllerutils.NetworksTicker.mainnet
  },
  networksMetadata: {},
  networkConfigurations: {}
};
var _ethQuery, _infuraProjectId, _trackMetaMetricsEvent, _previousProviderConfig, _providerProxy, _blockTrackerProxy, _autoManagedNetworkClientRegistry, _refreshNetwork, refreshNetwork_fn, _getLatestBlock, getLatestBlock_fn, _determineEIP1559Compatibility, determineEIP1559Compatibility_fn, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn, _createAutoManagedNetworkClientRegistry, createAutoManagedNetworkClientRegistry_fn, _buildIdentifiedInfuraNetworkClientConfigurations, buildIdentifiedInfuraNetworkClientConfigurations_fn, _buildIdentifiedCustomNetworkClientConfigurations, buildIdentifiedCustomNetworkClientConfigurations_fn, _buildIdentifiedNetworkClientConfigurationsFromProviderConfig, buildIdentifiedNetworkClientConfigurationsFromProviderConfig_fn, _applyNetworkSelection, applyNetworkSelection_fn;
var NetworkController = class extends _basecontroller.BaseController {
  constructor({
    messenger,
    state,
    infuraProjectId,
    trackMetaMetricsEvent
  }) {
    super({
      name,
      metadata: {
        selectedNetworkClientId: {
          persist: true,
          anonymous: false
        },
        networksMetadata: {
          persist: true,
          anonymous: false
        },
        providerConfig: {
          persist: true,
          anonymous: false
        },
        networkConfigurations: {
          persist: true,
          anonymous: false
        }
      },
      messenger,
      state: { ...defaultState, ...state }
    });
    /**
     * Executes a series of steps to apply the changes to the provider config:
     *
     * 1. Notifies subscribers that the network is about to change.
     * 2. Looks up a known and preinitialized network client matching the provider
     * config and re-points the provider and block tracker proxy to it.
     * 3. Notifies subscribers that the network has changed.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _refreshNetwork);
    /**
     * Fetches the latest block for the network.
     *
     * @param networkClientId - The networkClientId to fetch the correct provider against which to check the latest block. Defaults to the selectedNetworkClientId.
     * @returns A promise that either resolves to the block header or null if
     * there is no latest block, or rejects with an error.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _getLatestBlock);
    /**
     * Retrieves and checks the latest block from the currently selected
     * network; if the block has a `baseFeePerGas` property, then we know
     * that the network supports EIP-1559; otherwise it doesn't.
     *
     * @param networkClientId - The networkClientId to fetch the correct provider against which to check 1559 compatibility
     * @returns A promise that resolves to `true` if the network supports EIP-1559,
     * `false` otherwise, or `undefined` if unable to retrieve the last block.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _determineEIP1559Compatibility);
    /**
     * Before accessing or switching the network, the registry of network clients
     * needs to be populated. Otherwise, `#applyNetworkSelection` and
     * `getNetworkClientRegistry` will throw an error. This method checks to see if the
     * population step has happened yet, and if not, makes it happen.
     *
     * @returns The populated network client registry.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated);
    /**
     * Constructs the registry of network clients based on the set of built-in
     * networks as well as the custom networks in state.
     *
     * @returns The network clients keyed by ID.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _createAutoManagedNetworkClientRegistry);
    /**
     * Constructs the list of network clients for built-in networks (that is,
     * the subset of the networks we know Infura supports that consumers do not
     * need to explicitly add).
     *
     * @returns The network clients.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _buildIdentifiedInfuraNetworkClientConfigurations);
    /**
     * Constructs the list of network clients for custom networks (that is, those
     * which consumers have added via `networkConfigurations`).
     *
     * @returns The network clients.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _buildIdentifiedCustomNetworkClientConfigurations);
    /**
     * Converts the provider config object in state to a network client
     * configuration object.
     *
     * @returns The network client config.
     * @throws If the provider config is of type "rpc" and lacks either a
     * `chainId` or an `rpcUrl`.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _buildIdentifiedNetworkClientConfigurationsFromProviderConfig);
    /**
     * Uses the information in the provider config object to look up a known and
     * preinitialized network client. Once a network client is found, updates the
     * provider and block tracker proxy to point to those from the network client,
     * then finally creates an EthQuery that points to the provider proxy.
     *
     * @throws If no network client could be found matching the current provider
     * config.
     */
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _applyNetworkSelection);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _ethQuery, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _infuraProjectId, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _trackMetaMetricsEvent, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _previousProviderConfig, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _providerProxy, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _blockTrackerProxy, void 0);
    _chunkZ4BLTVTBjs.__privateAdd.call(void 0, this, _autoManagedNetworkClientRegistry, void 0);
    if (!infuraProjectId || typeof infuraProjectId !== "string") {
      throw new Error("Invalid Infura project ID");
    }
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _infuraProjectId, infuraProjectId);
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _trackMetaMetricsEvent, trackMetaMetricsEvent);
    this.messagingSystem.registerActionHandler(
      `${this.name}:getProviderConfig`,
      () => {
        return this.state.providerConfig;
      }
    );
    this.messagingSystem.registerActionHandler(
      `${this.name}:getEthQuery`,
      () => {
        return _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _ethQuery);
      }
    );
    this.messagingSystem.registerActionHandler(
      `${this.name}:getNetworkClientById`,
      this.getNetworkClientById.bind(this)
    );
    this.messagingSystem.registerActionHandler(
      `${this.name}:getEIP1559Compatibility`,
      this.getEIP1559Compatibility.bind(this)
    );
    this.messagingSystem.registerActionHandler(
      `${this.name}:setActiveNetwork`,
      this.setActiveNetwork.bind(this)
    );
    this.messagingSystem.registerActionHandler(
      `${this.name}:setProviderType`,
      this.setProviderType.bind(this)
    );
    this.messagingSystem.registerActionHandler(
      `${this.name}:findNetworkClientIdByChainId`,
      this.findNetworkClientIdByChainId.bind(this)
    );
    this.messagingSystem.registerActionHandler(
      `${this.name}:getNetworkConfigurationByNetworkClientId`,
      this.getNetworkConfigurationByNetworkClientId.bind(this)
    );
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _previousProviderConfig, this.state.providerConfig);
  }
  /**
   * Accesses the provider and block tracker for the currently selected network.
   *
   * @returns The proxy and block tracker proxies.
   */
  getProviderAndBlockTracker() {
    return {
      provider: _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _providerProxy),
      blockTracker: _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _blockTrackerProxy)
    };
  }
  /**
   * Returns all of the network clients that have been created so far, keyed by
   * their identifier in the network client registry. This collection represents
   * not only built-in networks but also any custom networks that consumers have
   * added.
   *
   * @returns The list of known network clients.
   */
  getNetworkClientRegistry() {
    const autoManagedNetworkClientRegistry = _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    return Object.assign(
      {},
      autoManagedNetworkClientRegistry["infura" /* Infura */],
      autoManagedNetworkClientRegistry["custom" /* Custom */]
    );
  }
  getNetworkClientById(networkClientId) {
    if (!networkClientId) {
      throw new Error("No network client ID was provided.");
    }
    const autoManagedNetworkClientRegistry = _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    if (_controllerutils.isInfuraNetworkType.call(void 0, networkClientId)) {
      const infuraNetworkClient = autoManagedNetworkClientRegistry["infura" /* Infura */][networkClientId];
      if (!infuraNetworkClient) {
        throw new Error(
          `No Infura network client was found with the ID "${networkClientId}".`
        );
      }
      return infuraNetworkClient;
    }
    const customNetworkClient = autoManagedNetworkClientRegistry["custom" /* Custom */][networkClientId];
    if (!customNetworkClient) {
      throw new Error(
        `No custom network client was found with the ID "${networkClientId}".`
      );
    }
    return customNetworkClient;
  }
  /**
   * Populates the network clients and establishes the initial network based on
   * the provider configuration in state.
   */
  async initializeProvider() {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _applyNetworkSelection, applyNetworkSelection_fn).call(this);
  }
  /**
   * Refreshes the network meta with EIP-1559 support and the network status
   * based on the given network client ID.
   *
   * @param networkClientId - The ID of the network client to update.
   */
  async lookupNetworkByClientId(networkClientId) {
    const isInfura = _controllerutils.isInfuraNetworkType.call(void 0, networkClientId);
    let updatedNetworkStatus;
    let updatedIsEIP1559Compatible;
    try {
      updatedIsEIP1559Compatible = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _determineEIP1559Compatibility, determineEIP1559Compatibility_fn).call(this, networkClientId);
      updatedNetworkStatus = "available" /* Available */;
    } catch (error) {
      if (isErrorWithCode(error)) {
        let responseBody;
        if (isInfura && _utils.hasProperty.call(void 0, error, "message") && typeof error.message === "string") {
          try {
            responseBody = JSON.parse(error.message);
          } catch {
          }
        }
        if (_utils.isPlainObject.call(void 0, responseBody) && responseBody.error === _chunkZKNI7MD3js.INFURA_BLOCKED_KEY) {
          updatedNetworkStatus = "blocked" /* Blocked */;
        } else if (error.code === _rpcerrors.errorCodes.rpc.internal) {
          updatedNetworkStatus = "unknown" /* Unknown */;
        } else {
          updatedNetworkStatus = "unavailable" /* Unavailable */;
        }
      } else if (typeof Error !== "undefined" && _utils.hasProperty.call(void 0, error, "message") && typeof error.message === "string" && error.message.includes(
        "No custom network client was found with the ID"
      )) {
        throw error;
      } else {
        log("NetworkController - could not determine network status", error);
        updatedNetworkStatus = "unknown" /* Unknown */;
      }
    }
    this.update((state) => {
      if (state.networksMetadata[networkClientId] === void 0) {
        state.networksMetadata[networkClientId] = {
          status: "unknown" /* Unknown */,
          EIPS: {}
        };
      }
      const meta = state.networksMetadata[networkClientId];
      meta.status = updatedNetworkStatus;
      if (updatedIsEIP1559Compatible === void 0) {
        delete meta.EIPS[1559];
      } else {
        meta.EIPS[1559] = updatedIsEIP1559Compatible;
      }
    });
  }
  /**
   * Performs side effects after switching to a network. If the network is
   * available, updates the network state with the network ID of the network and
   * stores whether the network supports EIP-1559; otherwise clears said
   * information about the network that may have been previously stored.
   *
   * @param networkClientId - (Optional) The ID of the network client to update.
   * If no ID is provided, uses the currently selected network.
   * @fires infuraIsBlocked if the network is Infura-supported and is blocking
   * requests.
   * @fires infuraIsUnblocked if the network is Infura-supported and is not
   * blocking requests, or if the network is not Infura-supported.
   */
  async lookupNetwork(networkClientId) {
    if (networkClientId) {
      await this.lookupNetworkByClientId(networkClientId);
      return;
    }
    if (!_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _ethQuery)) {
      return;
    }
    const isInfura = isInfuraProviderConfig(this.state.providerConfig);
    let networkChanged = false;
    const listener = () => {
      networkChanged = true;
      this.messagingSystem.unsubscribe(
        "NetworkController:networkDidChange",
        listener
      );
    };
    this.messagingSystem.subscribe(
      "NetworkController:networkDidChange",
      listener
    );
    let updatedNetworkStatus;
    let updatedIsEIP1559Compatible;
    try {
      const isEIP1559Compatible = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _determineEIP1559Compatibility, determineEIP1559Compatibility_fn).call(this, this.state.selectedNetworkClientId);
      updatedNetworkStatus = "available" /* Available */;
      updatedIsEIP1559Compatible = isEIP1559Compatible;
    } catch (error) {
      if (isErrorWithCode(error)) {
        let responseBody;
        if (isInfura && _utils.hasProperty.call(void 0, error, "message") && typeof error.message === "string") {
          try {
            responseBody = JSON.parse(error.message);
          } catch {
          }
        }
        if (_utils.isPlainObject.call(void 0, responseBody) && responseBody.error === _chunkZKNI7MD3js.INFURA_BLOCKED_KEY) {
          updatedNetworkStatus = "blocked" /* Blocked */;
        } else if (error.code === _rpcerrors.errorCodes.rpc.internal) {
          updatedNetworkStatus = "unknown" /* Unknown */;
        } else {
          updatedNetworkStatus = "unavailable" /* Unavailable */;
        }
      } else {
        log("NetworkController - could not determine network status", error);
        updatedNetworkStatus = "unknown" /* Unknown */;
      }
    }
    if (networkChanged) {
      return;
    }
    this.messagingSystem.unsubscribe(
      "NetworkController:networkDidChange",
      listener
    );
    this.update((state) => {
      const meta = state.networksMetadata[state.selectedNetworkClientId];
      meta.status = updatedNetworkStatus;
      if (updatedIsEIP1559Compatible === void 0) {
        delete meta.EIPS[1559];
      } else {
        meta.EIPS[1559] = updatedIsEIP1559Compatible;
      }
    });
    if (isInfura) {
      if (updatedNetworkStatus === "available" /* Available */) {
        this.messagingSystem.publish("NetworkController:infuraIsUnblocked");
      } else if (updatedNetworkStatus === "blocked" /* Blocked */) {
        this.messagingSystem.publish("NetworkController:infuraIsBlocked");
      }
    } else {
      this.messagingSystem.publish("NetworkController:infuraIsUnblocked");
    }
  }
  /**
   * Convenience method to update provider network type settings.
   *
   * @param type - Human readable network name.
   * @deprecated This has been replaced by `setActiveNetwork`, and will be
   * removed in a future release
   */
  async setProviderType(type) {
    _assert.strict.notStrictEqual(
      type,
      _controllerutils.NetworkType.rpc,
      `NetworkController - cannot call "setProviderType" with type "${_controllerutils.NetworkType.rpc}". Use "setActiveNetwork"`
    );
    _assert.strict.ok(
      _controllerutils.isInfuraNetworkType.call(void 0, type),
      `Unknown Infura provider type "${type}".`
    );
    await this.setActiveNetwork(type);
  }
  /**
   * Convenience method to update provider RPC settings.
   *
   * @param networkConfigurationIdOrType - The unique id for the network configuration to set as the active provider,
   * or the type of a built-in network.
   */
  async setActiveNetwork(networkConfigurationIdOrType) {
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _previousProviderConfig, this.state.providerConfig);
    let targetNetwork;
    if (_controllerutils.isInfuraNetworkType.call(void 0, networkConfigurationIdOrType)) {
      const ticker = _controllerutils.NetworksTicker[networkConfigurationIdOrType];
      targetNetwork = {
        chainId: _controllerutils.ChainId[networkConfigurationIdOrType],
        id: void 0,
        rpcPrefs: _controllerutils.BUILT_IN_NETWORKS[networkConfigurationIdOrType].rpcPrefs,
        rpcUrl: void 0,
        nickname: void 0,
        ticker,
        type: networkConfigurationIdOrType
      };
    } else {
      if (!Object.keys(this.state.networkConfigurations).includes(
        networkConfigurationIdOrType
      )) {
        throw new Error(
          `networkConfigurationId ${networkConfigurationIdOrType} does not match a configured networkConfiguration or built-in network type`
        );
      }
      targetNetwork = {
        ...this.state.networkConfigurations[networkConfigurationIdOrType],
        type: _controllerutils.NetworkType.rpc
      };
    }
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    this.update((state) => {
      state.providerConfig = targetNetwork;
    });
    await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _refreshNetwork, refreshNetwork_fn).call(this);
  }
  /**
   * Determines whether the network supports EIP-1559 by checking whether the
   * latest block has a `baseFeePerGas` property, then updates state
   * appropriately.
   *
   * @param networkClientId - The networkClientId to fetch the correct provider against which to check 1559 compatibility.
   * @returns A promise that resolves to true if the network supports EIP-1559
   * , false otherwise, or `undefined` if unable to determine the compatibility.
   */
  async getEIP1559Compatibility(networkClientId) {
    if (networkClientId) {
      return this.get1559CompatibilityWithNetworkClientId(networkClientId);
    }
    if (!_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _ethQuery)) {
      return false;
    }
    const { EIPS } = this.state.networksMetadata[this.state.selectedNetworkClientId];
    if (EIPS[1559] !== void 0) {
      return EIPS[1559];
    }
    const isEIP1559Compatible = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _determineEIP1559Compatibility, determineEIP1559Compatibility_fn).call(this, this.state.selectedNetworkClientId);
    this.update((state) => {
      if (isEIP1559Compatible !== void 0) {
        state.networksMetadata[state.selectedNetworkClientId].EIPS[1559] = isEIP1559Compatible;
      }
    });
    return isEIP1559Compatible;
  }
  async get1559CompatibilityWithNetworkClientId(networkClientId) {
    let metadata = this.state.networksMetadata[networkClientId];
    if (metadata === void 0) {
      await this.lookupNetwork(networkClientId);
      metadata = this.state.networksMetadata[networkClientId];
    }
    const { EIPS } = metadata;
    return EIPS[1559];
  }
  /**
   * Re-initializes the provider and block tracker for the current network.
   */
  async resetConnection() {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _refreshNetwork, refreshNetwork_fn).call(this);
  }
  /**
   * Returns a configuration object for the network identified by the given
   * network client ID. If given an Infura network type, constructs one based on
   * what we know about the network; otherwise attempts locates a network
   * configuration in state that corresponds to the network client ID.
   *
   * @param networkClientId - The network client ID.
   * @returns The configuration for the referenced network if one exists, or
   * undefined otherwise.
   */
  getNetworkConfigurationByNetworkClientId(networkClientId) {
    if (_controllerutils.isInfuraNetworkType.call(void 0, networkClientId)) {
      const rpcUrl = `https://${networkClientId}.infura.io/v3/${_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _infuraProjectId)}`;
      return {
        rpcUrl,
        ..._controllerutils.BUILT_IN_NETWORKS[networkClientId]
      };
    }
    return this.state.networkConfigurations[networkClientId];
  }
  /**
   * Adds a new custom network or updates the information for an existing
   * network.
   *
   * This may involve updating the `networkConfigurations` property in
   * state as well and/or adding a new network client to the network client
   * registry. The `rpcUrl` and `chainId` of the given object are used to
   * determine which action to take:
   *
   * - If the `rpcUrl` corresponds to an existing network configuration
   * (case-insensitively), then it is overwritten with the object. Furthermore,
   * if the `chainId` is different from the existing network configuration, then
   * the existing network client is replaced with a new one.
   * - If the `rpcUrl` does not correspond to an existing network configuration
   * (case-insensitively), then the object is used to add a new network
   * configuration along with a new network client.
   *
   * @param networkConfiguration - The network configuration to add or update.
   * @param options - Additional configuration options.
   * @param options.referrer - Used to create a metrics event; the site from which the call originated, or 'metamask' for internal calls.
   * @param options.source - Used to create a metrics event; where the event originated (i.e. from a dapp or from the network form).
   * @param options.setActive - If true, switches to the network upon adding or updating it (default: false).
   * @returns The ID for the added or updated network configuration.
   */
  async upsertNetworkConfiguration(networkConfiguration, {
    referrer,
    source,
    setActive = false
  }) {
    const sanitizedNetworkConfiguration = pick(
      networkConfiguration,
      ["rpcUrl", "chainId", "ticker", "nickname", "rpcPrefs"]
    );
    const { rpcUrl, chainId, ticker } = sanitizedNetworkConfiguration;
    _utils.assertIsStrictHexString.call(void 0, chainId);
    if (!_controllerutils.isSafeChainId.call(void 0, chainId)) {
      throw new Error(
        `Invalid chain ID "${chainId}": numerical value greater than max safe value.`
      );
    }
    if (!rpcUrl) {
      throw new Error(
        "An rpcUrl is required to add or update network configuration"
      );
    }
    if (!referrer || !source) {
      throw new Error(
        "referrer and source are required arguments for adding or updating a network configuration"
      );
    }
    try {
      new URL(rpcUrl);
    } catch (e) {
      if (e.message.includes("Invalid URL")) {
        throw new Error("rpcUrl must be a valid URL");
      }
    }
    if (!ticker) {
      throw new Error(
        "A ticker is required to add or update networkConfiguration"
      );
    }
    const autoManagedNetworkClientRegistry = _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    const existingNetworkConfiguration = Object.values(
      this.state.networkConfigurations
    ).find(
      (networkConfig) => networkConfig.rpcUrl.toLowerCase() === rpcUrl.toLowerCase()
    );
    const upsertedNetworkConfigurationId = existingNetworkConfiguration ? existingNetworkConfiguration.id : _uuid.v4.call(void 0, );
    const networkClientId = buildCustomNetworkClientId(
      upsertedNetworkConfigurationId
    );
    const customNetworkClientRegistry = autoManagedNetworkClientRegistry["custom" /* Custom */];
    const existingAutoManagedNetworkClient = customNetworkClientRegistry[networkClientId];
    const shouldDestroyExistingNetworkClient = existingAutoManagedNetworkClient && existingAutoManagedNetworkClient.configuration.chainId !== chainId;
    if (shouldDestroyExistingNetworkClient) {
      existingAutoManagedNetworkClient.destroy();
    }
    if (!existingAutoManagedNetworkClient || shouldDestroyExistingNetworkClient) {
      customNetworkClientRegistry[networkClientId] = _chunkLTT6WJXCjs.createAutoManagedNetworkClient.call(void 0, {
        type: "custom" /* Custom */,
        chainId,
        rpcUrl,
        ticker
      });
    }
    this.update((state) => {
      state.networkConfigurations[upsertedNetworkConfigurationId] = {
        id: upsertedNetworkConfigurationId,
        ...sanitizedNetworkConfiguration
      };
    });
    if (!existingNetworkConfiguration) {
      _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _trackMetaMetricsEvent).call(this, {
        event: "Custom Network Added",
        category: "Network",
        referrer: {
          url: referrer
        },
        properties: {
          chain_id: chainId,
          symbol: ticker,
          source
        }
      });
    }
    if (setActive) {
      await this.setActiveNetwork(upsertedNetworkConfigurationId);
    }
    return upsertedNetworkConfigurationId;
  }
  /**
   * Removes a custom network from state.
   *
   * This involves updating the `networkConfigurations` property in state as
   * well and removing the network client that corresponds to the network from
   * the client registry.
   *
   * @param networkConfigurationId - The ID of an existing network
   * configuration.
   */
  removeNetworkConfiguration(networkConfigurationId) {
    if (!this.state.networkConfigurations[networkConfigurationId]) {
      throw new Error(
        `networkConfigurationId ${networkConfigurationId} does not match a configured networkConfiguration`
      );
    }
    const autoManagedNetworkClientRegistry = _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    const networkClientId = buildCustomNetworkClientId(networkConfigurationId);
    this.update((state) => {
      delete state.networkConfigurations[networkConfigurationId];
    });
    const customNetworkClientRegistry = autoManagedNetworkClientRegistry["custom" /* Custom */];
    const existingAutoManagedNetworkClient = customNetworkClientRegistry[networkClientId];
    existingAutoManagedNetworkClient.destroy();
    delete customNetworkClientRegistry[networkClientId];
  }
  /**
   * Switches to the previously selected network, assuming that there is one
   * (if not and `initializeProvider` has not been previously called, then this
   * method is equivalent to calling `resetConnection`).
   */
  async rollbackToPreviousProvider() {
    _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _ensureAutoManagedNetworkClientRegistryPopulated, ensureAutoManagedNetworkClientRegistryPopulated_fn).call(this);
    this.update((state) => {
      state.providerConfig = _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _previousProviderConfig);
    });
    await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _refreshNetwork, refreshNetwork_fn).call(this);
  }
  /**
   * Deactivates the controller, stopping any ongoing polling.
   *
   * In-progress requests will not be aborted.
   */
  async destroy() {
    await _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _blockTrackerProxy)?.destroy();
  }
  /**
   * Updates the controller using the given backup data.
   *
   * @param backup - The data that has been backed up.
   * @param backup.networkConfigurations - Network configurations in the backup.
   */
  loadBackup({
    networkConfigurations
  }) {
    this.update((state) => {
      state.networkConfigurations = {
        ...state.networkConfigurations,
        ...networkConfigurations
      };
    });
  }
  /**
   * Searches for a network configuration ID with the given ChainID and returns it.
   *
   * @param chainId - ChainId to search for
   * @returns networkClientId of the network configuration with the given chainId
   */
  findNetworkClientIdByChainId(chainId) {
    const networkClients = this.getNetworkClientRegistry();
    const networkClientEntry = Object.entries(networkClients).find(
      ([_, networkClient]) => networkClient.configuration.chainId === chainId
    );
    if (networkClientEntry === void 0) {
      throw new Error("Couldn't find networkClientId for chainId");
    }
    return networkClientEntry[0];
  }
};
_ethQuery = new WeakMap();
_infuraProjectId = new WeakMap();
_trackMetaMetricsEvent = new WeakMap();
_previousProviderConfig = new WeakMap();
_providerProxy = new WeakMap();
_blockTrackerProxy = new WeakMap();
_autoManagedNetworkClientRegistry = new WeakMap();
_refreshNetwork = new WeakSet();
refreshNetwork_fn = async function() {
  this.messagingSystem.publish(
    "NetworkController:networkWillChange",
    this.state
  );
  _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _applyNetworkSelection, applyNetworkSelection_fn).call(this);
  this.messagingSystem.publish(
    "NetworkController:networkDidChange",
    this.state
  );
  await this.lookupNetwork();
};
_getLatestBlock = new WeakSet();
getLatestBlock_fn = function(networkClientId) {
  if (networkClientId === void 0) {
    networkClientId = this.state.selectedNetworkClientId;
  }
  const networkClient = this.getNetworkClientById(networkClientId);
  const ethQuery = new (0, _ethquery2.default)(networkClient.provider);
  return new Promise((resolve, reject) => {
    ethQuery.sendAsync(
      { method: "eth_getBlockByNumber", params: ["latest", false] },
      (error, block) => {
        if (error) {
          reject(error);
        } else {
          resolve(block);
        }
      }
    );
  });
};
_determineEIP1559Compatibility = new WeakSet();
determineEIP1559Compatibility_fn = async function(networkClientId) {
  const latestBlock = await _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _getLatestBlock, getLatestBlock_fn).call(this, networkClientId);
  if (!latestBlock) {
    return void 0;
  }
  return latestBlock.baseFeePerGas !== void 0;
};
_ensureAutoManagedNetworkClientRegistryPopulated = new WeakSet();
ensureAutoManagedNetworkClientRegistryPopulated_fn = function() {
  const autoManagedNetworkClientRegistry = _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _autoManagedNetworkClientRegistry) ?? _chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _createAutoManagedNetworkClientRegistry, createAutoManagedNetworkClientRegistry_fn).call(this);
  _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _autoManagedNetworkClientRegistry, autoManagedNetworkClientRegistry);
  return autoManagedNetworkClientRegistry;
};
_createAutoManagedNetworkClientRegistry = new WeakSet();
createAutoManagedNetworkClientRegistry_fn = function() {
  return [
    ..._chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _buildIdentifiedInfuraNetworkClientConfigurations, buildIdentifiedInfuraNetworkClientConfigurations_fn).call(this),
    ..._chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _buildIdentifiedCustomNetworkClientConfigurations, buildIdentifiedCustomNetworkClientConfigurations_fn).call(this),
    ..._chunkZ4BLTVTBjs.__privateMethod.call(void 0, this, _buildIdentifiedNetworkClientConfigurationsFromProviderConfig, buildIdentifiedNetworkClientConfigurationsFromProviderConfig_fn).call(this)
  ].reduce(
    (registry, [networkClientType, networkClientId, networkClientConfiguration]) => {
      const autoManagedNetworkClient = _chunkLTT6WJXCjs.createAutoManagedNetworkClient.call(void 0, 
        networkClientConfiguration
      );
      if (networkClientId in registry[networkClientType]) {
        return registry;
      }
      return {
        ...registry,
        [networkClientType]: {
          ...registry[networkClientType],
          [networkClientId]: autoManagedNetworkClient
        }
      };
    },
    {
      ["infura" /* Infura */]: {},
      ["custom" /* Custom */]: {}
    }
  );
};
_buildIdentifiedInfuraNetworkClientConfigurations = new WeakSet();
buildIdentifiedInfuraNetworkClientConfigurations_fn = function() {
  return knownKeysOf(_controllerutils.InfuraNetworkType).map((network) => {
    const networkClientId = buildInfuraNetworkClientId(network);
    const networkClientConfiguration = {
      type: "infura" /* Infura */,
      network,
      infuraProjectId: _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _infuraProjectId),
      chainId: _controllerutils.BUILT_IN_NETWORKS[network].chainId,
      ticker: _controllerutils.BUILT_IN_NETWORKS[network].ticker
    };
    return [
      "infura" /* Infura */,
      networkClientId,
      networkClientConfiguration
    ];
  });
};
_buildIdentifiedCustomNetworkClientConfigurations = new WeakSet();
buildIdentifiedCustomNetworkClientConfigurations_fn = function() {
  return Object.entries(this.state.networkConfigurations).map(
    ([networkConfigurationId, networkConfiguration]) => {
      if (networkConfiguration.chainId === void 0) {
        throw new Error("chainId must be provided for custom RPC endpoints");
      }
      if (networkConfiguration.rpcUrl === void 0) {
        throw new Error("rpcUrl must be provided for custom RPC endpoints");
      }
      const networkClientId = buildCustomNetworkClientId(
        networkConfigurationId
      );
      const networkClientConfiguration = {
        type: "custom" /* Custom */,
        chainId: networkConfiguration.chainId,
        rpcUrl: networkConfiguration.rpcUrl,
        ticker: networkConfiguration.ticker
      };
      return [
        "custom" /* Custom */,
        networkClientId,
        networkClientConfiguration
      ];
    }
  );
};
_buildIdentifiedNetworkClientConfigurationsFromProviderConfig = new WeakSet();
buildIdentifiedNetworkClientConfigurationsFromProviderConfig_fn = function() {
  const { providerConfig } = this.state;
  if (isCustomProviderConfig(providerConfig)) {
    validateCustomProviderConfig(providerConfig);
    const networkClientId = buildCustomNetworkClientId(
      providerConfig,
      this.state.networkConfigurations
    );
    const networkClientConfiguration = {
      chainId: providerConfig.chainId,
      rpcUrl: providerConfig.rpcUrl,
      type: "custom" /* Custom */,
      ticker: providerConfig.ticker
    };
    return [
      ["custom" /* Custom */, networkClientId, networkClientConfiguration]
    ];
  }
  if (isInfuraProviderConfig(providerConfig)) {
    return [];
  }
  throw new Error(`Unrecognized network type: '${providerConfig.type}'`);
};
_applyNetworkSelection = new WeakSet();
applyNetworkSelection_fn = function() {
  if (!_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _autoManagedNetworkClientRegistry)) {
    throw new Error(
      "initializeProvider must be called first in order to switch the network"
    );
  }
  const { providerConfig } = this.state;
  let autoManagedNetworkClient;
  let networkClientId;
  if (isInfuraProviderConfig(providerConfig)) {
    const networkClientType = "infura" /* Infura */;
    networkClientId = buildInfuraNetworkClientId(providerConfig);
    const builtInNetworkClientRegistry = _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _autoManagedNetworkClientRegistry)[networkClientType];
    autoManagedNetworkClient = builtInNetworkClientRegistry[networkClientId];
    if (!autoManagedNetworkClient) {
      throw new Error(
        `Could not find custom network matching ${networkClientId}`
      );
    }
  } else if (isCustomProviderConfig(providerConfig)) {
    validateCustomProviderConfig(providerConfig);
    const networkClientType = "custom" /* Custom */;
    networkClientId = buildCustomNetworkClientId(
      providerConfig,
      this.state.networkConfigurations
    );
    const customNetworkClientRegistry = _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _autoManagedNetworkClientRegistry)[networkClientType];
    autoManagedNetworkClient = customNetworkClientRegistry[networkClientId];
    if (!autoManagedNetworkClient) {
      throw new Error(
        `Could not find built-in network matching ${networkClientId}`
      );
    }
  } else {
    throw new Error("Could not determine type of provider config");
  }
  this.update((state) => {
    state.selectedNetworkClientId = networkClientId;
    if (state.networksMetadata[networkClientId] === void 0) {
      state.networksMetadata[networkClientId] = {
        status: "unknown" /* Unknown */,
        EIPS: {}
      };
    }
  });
  const { provider, blockTracker } = autoManagedNetworkClient;
  if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _providerProxy)) {
    _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _providerProxy).setTarget(provider);
  } else {
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _providerProxy, _swappableobjproxy.createEventEmitterProxy.call(void 0, provider));
  }
  if (_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _blockTrackerProxy)) {
    _chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _blockTrackerProxy).setTarget(blockTracker);
  } else {
    _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _blockTrackerProxy, _swappableobjproxy.createEventEmitterProxy.call(void 0, blockTracker, {
      eventFilter: "skipInternal"
    }));
  }
  _chunkZ4BLTVTBjs.__privateSet.call(void 0, this, _ethQuery, new (0, _ethquery2.default)(_chunkZ4BLTVTBjs.__privateGet.call(void 0, this, _providerProxy)));
};





exports.knownKeysOf = knownKeysOf; exports.defaultState = defaultState; exports.NetworkController = NetworkController;
//# sourceMappingURL=chunk-VNCJZRDU.js.map