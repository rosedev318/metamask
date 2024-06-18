"use strict";Object.defineProperty(exports, "__esModule", {value: true});


var _chunk2KTJCF3Cjs = require('./chunk-2KTJCF3C.js');



var _chunkVHY3NATPjs = require('./chunk-VHY3NATP.js');



var _chunkZPK4THX4js = require('./chunk-ZPK4THX4.js');


var _chunkVUA6ICJOjs = require('./chunk-VUA6ICJO.js');


var _chunkS7AR3ROHjs = require('./chunk-S7AR3ROH.js');


var _chunkLGUJMQC7js = require('./chunk-LGUJMQC7.js');


var _chunkFFHVA6PPjs = require('./chunk-FFHVA6PP.js');

// src/restricted/caveats/index.ts
var caveatSpecifications = {
  ..._chunkVHY3NATPjs.PermittedDerivationPathsCaveatSpecification,
  ..._chunk2KTJCF3Cjs.PermittedCoinTypesCaveatSpecification,
  ..._chunkZPK4THX4js.SnapIdsCaveatSpecification
};
var caveatMappers = {
  [_chunkS7AR3ROHjs.getBip32EntropyBuilder.targetName]: _chunkVHY3NATPjs.permittedDerivationPathsCaveatMapper,
  [_chunkLGUJMQC7js.getBip32PublicKeyBuilder.targetName]: _chunkVHY3NATPjs.permittedDerivationPathsCaveatMapper,
  [_chunkVUA6ICJOjs.getBip44EntropyBuilder.targetName]: _chunk2KTJCF3Cjs.permittedCoinTypesCaveatMapper,
  [_chunkFFHVA6PPjs.invokeSnapBuilder.targetName]: _chunkZPK4THX4js.snapIdsCaveatMapper
};




exports.caveatSpecifications = caveatSpecifications; exports.caveatMappers = caveatMappers;
//# sourceMappingURL=chunk-AYJK7MSH.js.map