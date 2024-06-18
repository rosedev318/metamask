"use strict";Object.defineProperty(exports, "__esModule", {value: true});



var _chunkPWUEAR4Hjs = require('./chunk-PWUEAR4H.js');


var _chunk3DHVA2FYjs = require('./chunk-3DHVA2FY.js');




var _chunkIEUCBULUjs = require('./chunk-IEUCBULU.js');


var _chunkYOHE52XBjs = require('./chunk-YOHE52XB.js');




var _chunkLIWV3FMYjs = require('./chunk-LIWV3FMY.js');




var _chunkTEXEQGNZjs = require('./chunk-TEXEQGNZ.js');




var _chunk6TKD32TSjs = require('./chunk-6TKD32TS.js');




var _chunkFCVWU5XHjs = require('./chunk-FCVWU5XH.js');


var _chunkQ27K2I6Zjs = require('./chunk-Q27K2I6Z.js');




var _chunkOQOTJFFVjs = require('./chunk-OQOTJFFV.js');


var _chunkB3NIHNXWjs = require('./chunk-B3NIHNXW.js');


var _chunkFMDV3RFTjs = require('./chunk-FMDV3RFT.js');

// src/endowments/index.ts
var _snapsutils = require('@metamask/snaps-utils');
var endowmentPermissionBuilders = {
  [_chunkYOHE52XBjs.networkAccessEndowmentBuilder.targetName]: _chunkYOHE52XBjs.networkAccessEndowmentBuilder,
  [_chunk6TKD32TSjs.transactionInsightEndowmentBuilder.targetName]: _chunk6TKD32TSjs.transactionInsightEndowmentBuilder,
  [_chunkOQOTJFFVjs.cronjobEndowmentBuilder.targetName]: _chunkOQOTJFFVjs.cronjobEndowmentBuilder,
  [_chunkB3NIHNXWjs.ethereumProviderEndowmentBuilder.targetName]: _chunkB3NIHNXWjs.ethereumProviderEndowmentBuilder,
  [_chunkLIWV3FMYjs.rpcEndowmentBuilder.targetName]: _chunkLIWV3FMYjs.rpcEndowmentBuilder,
  [_chunkQ27K2I6Zjs.webAssemblyEndowmentBuilder.targetName]: _chunkQ27K2I6Zjs.webAssemblyEndowmentBuilder,
  [_chunkIEUCBULUjs.nameLookupEndowmentBuilder.targetName]: _chunkIEUCBULUjs.nameLookupEndowmentBuilder,
  [_chunk3DHVA2FYjs.lifecycleHooksEndowmentBuilder.targetName]: _chunk3DHVA2FYjs.lifecycleHooksEndowmentBuilder,
  [_chunkPWUEAR4Hjs.keyringEndowmentBuilder.targetName]: _chunkPWUEAR4Hjs.keyringEndowmentBuilder,
  [_chunkFMDV3RFTjs.homePageEndowmentBuilder.targetName]: _chunkFMDV3RFTjs.homePageEndowmentBuilder,
  [_chunkTEXEQGNZjs.signatureInsightEndowmentBuilder.targetName]: _chunkTEXEQGNZjs.signatureInsightEndowmentBuilder
};
var endowmentCaveatSpecifications = {
  ..._chunkOQOTJFFVjs.cronjobCaveatSpecifications,
  ..._chunk6TKD32TSjs.transactionInsightCaveatSpecifications,
  ..._chunkLIWV3FMYjs.rpcCaveatSpecifications,
  ..._chunkIEUCBULUjs.nameLookupCaveatSpecifications,
  ..._chunkPWUEAR4Hjs.keyringCaveatSpecifications,
  ..._chunkTEXEQGNZjs.signatureInsightCaveatSpecifications,
  ..._chunkFCVWU5XHjs.maxRequestTimeCaveatSpecifications
};
var endowmentCaveatMappers = {
  [_chunkOQOTJFFVjs.cronjobEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.createMaxRequestTimeMapper.call(void 0, 
    _chunkOQOTJFFVjs.getCronjobCaveatMapper
  ),
  [_chunk6TKD32TSjs.transactionInsightEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.createMaxRequestTimeMapper.call(void 0, 
    _chunk6TKD32TSjs.getTransactionInsightCaveatMapper
  ),
  [_chunkLIWV3FMYjs.rpcEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.createMaxRequestTimeMapper.call(void 0, _chunkLIWV3FMYjs.getRpcCaveatMapper),
  [_chunkIEUCBULUjs.nameLookupEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.createMaxRequestTimeMapper.call(void 0, 
    _chunkIEUCBULUjs.getNameLookupCaveatMapper
  ),
  [_chunkPWUEAR4Hjs.keyringEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.createMaxRequestTimeMapper.call(void 0, 
    _chunkPWUEAR4Hjs.getKeyringCaveatMapper
  ),
  [_chunkTEXEQGNZjs.signatureInsightEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.createMaxRequestTimeMapper.call(void 0, 
    _chunkTEXEQGNZjs.getSignatureInsightCaveatMapper
  ),
  [_chunk3DHVA2FYjs.lifecycleHooksEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.getMaxRequestTimeCaveatMapper,
  [_chunkFMDV3RFTjs.homePageEndowmentBuilder.targetName]: _chunkFCVWU5XHjs.getMaxRequestTimeCaveatMapper
};
var handlerEndowments = {
  [_snapsutils.HandlerType.OnRpcRequest]: _chunkLIWV3FMYjs.rpcEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnTransaction]: _chunk6TKD32TSjs.transactionInsightEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnCronjob]: _chunkOQOTJFFVjs.cronjobEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnNameLookup]: _chunkIEUCBULUjs.nameLookupEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnInstall]: _chunk3DHVA2FYjs.lifecycleHooksEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnUpdate]: _chunk3DHVA2FYjs.lifecycleHooksEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnKeyringRequest]: _chunkPWUEAR4Hjs.keyringEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnHomePage]: _chunkFMDV3RFTjs.homePageEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnSignature]: _chunkTEXEQGNZjs.signatureInsightEndowmentBuilder.targetName,
  [_snapsutils.HandlerType.OnUserInput]: null
};






exports.endowmentPermissionBuilders = endowmentPermissionBuilders; exports.endowmentCaveatSpecifications = endowmentCaveatSpecifications; exports.endowmentCaveatMappers = endowmentCaveatMappers; exports.handlerEndowments = handlerEndowments;
//# sourceMappingURL=chunk-JRSPKOFG.js.map