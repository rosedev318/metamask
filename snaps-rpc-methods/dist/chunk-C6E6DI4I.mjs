import {
  getKeyringCaveatMapper,
  keyringCaveatSpecifications,
  keyringEndowmentBuilder
} from "./chunk-TOYWHUAS.mjs";
import {
  lifecycleHooksEndowmentBuilder
} from "./chunk-PCB6QOHL.mjs";
import {
  getNameLookupCaveatMapper,
  nameLookupCaveatSpecifications,
  nameLookupEndowmentBuilder
} from "./chunk-ADXH5C3U.mjs";
import {
  networkAccessEndowmentBuilder
} from "./chunk-4D2B2UQ6.mjs";
import {
  getRpcCaveatMapper,
  rpcCaveatSpecifications,
  rpcEndowmentBuilder
} from "./chunk-VCGZNL35.mjs";
import {
  getSignatureInsightCaveatMapper,
  signatureInsightCaveatSpecifications,
  signatureInsightEndowmentBuilder
} from "./chunk-AWQ6HTAL.mjs";
import {
  getTransactionInsightCaveatMapper,
  transactionInsightCaveatSpecifications,
  transactionInsightEndowmentBuilder
} from "./chunk-EEVEVBK6.mjs";
import {
  createMaxRequestTimeMapper,
  getMaxRequestTimeCaveatMapper,
  maxRequestTimeCaveatSpecifications
} from "./chunk-23XDKQW2.mjs";
import {
  webAssemblyEndowmentBuilder
} from "./chunk-O66NZFSD.mjs";
import {
  cronjobCaveatSpecifications,
  cronjobEndowmentBuilder,
  getCronjobCaveatMapper
} from "./chunk-UBPHGXCO.mjs";
import {
  ethereumProviderEndowmentBuilder
} from "./chunk-KSTF5JYB.mjs";
import {
  homePageEndowmentBuilder
} from "./chunk-MVG4B2HM.mjs";

// src/endowments/index.ts
import { HandlerType } from "@metamask/snaps-utils";
var endowmentPermissionBuilders = {
  [networkAccessEndowmentBuilder.targetName]: networkAccessEndowmentBuilder,
  [transactionInsightEndowmentBuilder.targetName]: transactionInsightEndowmentBuilder,
  [cronjobEndowmentBuilder.targetName]: cronjobEndowmentBuilder,
  [ethereumProviderEndowmentBuilder.targetName]: ethereumProviderEndowmentBuilder,
  [rpcEndowmentBuilder.targetName]: rpcEndowmentBuilder,
  [webAssemblyEndowmentBuilder.targetName]: webAssemblyEndowmentBuilder,
  [nameLookupEndowmentBuilder.targetName]: nameLookupEndowmentBuilder,
  [lifecycleHooksEndowmentBuilder.targetName]: lifecycleHooksEndowmentBuilder,
  [keyringEndowmentBuilder.targetName]: keyringEndowmentBuilder,
  [homePageEndowmentBuilder.targetName]: homePageEndowmentBuilder,
  [signatureInsightEndowmentBuilder.targetName]: signatureInsightEndowmentBuilder
};
var endowmentCaveatSpecifications = {
  ...cronjobCaveatSpecifications,
  ...transactionInsightCaveatSpecifications,
  ...rpcCaveatSpecifications,
  ...nameLookupCaveatSpecifications,
  ...keyringCaveatSpecifications,
  ...signatureInsightCaveatSpecifications,
  ...maxRequestTimeCaveatSpecifications
};
var endowmentCaveatMappers = {
  [cronjobEndowmentBuilder.targetName]: createMaxRequestTimeMapper(
    getCronjobCaveatMapper
  ),
  [transactionInsightEndowmentBuilder.targetName]: createMaxRequestTimeMapper(
    getTransactionInsightCaveatMapper
  ),
  [rpcEndowmentBuilder.targetName]: createMaxRequestTimeMapper(getRpcCaveatMapper),
  [nameLookupEndowmentBuilder.targetName]: createMaxRequestTimeMapper(
    getNameLookupCaveatMapper
  ),
  [keyringEndowmentBuilder.targetName]: createMaxRequestTimeMapper(
    getKeyringCaveatMapper
  ),
  [signatureInsightEndowmentBuilder.targetName]: createMaxRequestTimeMapper(
    getSignatureInsightCaveatMapper
  ),
  [lifecycleHooksEndowmentBuilder.targetName]: getMaxRequestTimeCaveatMapper,
  [homePageEndowmentBuilder.targetName]: getMaxRequestTimeCaveatMapper
};
var handlerEndowments = {
  [HandlerType.OnRpcRequest]: rpcEndowmentBuilder.targetName,
  [HandlerType.OnTransaction]: transactionInsightEndowmentBuilder.targetName,
  [HandlerType.OnCronjob]: cronjobEndowmentBuilder.targetName,
  [HandlerType.OnNameLookup]: nameLookupEndowmentBuilder.targetName,
  [HandlerType.OnInstall]: lifecycleHooksEndowmentBuilder.targetName,
  [HandlerType.OnUpdate]: lifecycleHooksEndowmentBuilder.targetName,
  [HandlerType.OnKeyringRequest]: keyringEndowmentBuilder.targetName,
  [HandlerType.OnHomePage]: homePageEndowmentBuilder.targetName,
  [HandlerType.OnSignature]: signatureInsightEndowmentBuilder.targetName,
  [HandlerType.OnUserInput]: null
};

export {
  endowmentPermissionBuilders,
  endowmentCaveatSpecifications,
  endowmentCaveatMappers,
  handlerEndowments
};
//# sourceMappingURL=chunk-C6E6DI4I.mjs.map