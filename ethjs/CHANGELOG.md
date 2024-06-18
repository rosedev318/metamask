# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.6.0]
### Changed
- **BREAKING:** Update `bn.js` from `4.11.6` to `5.2.1` ([#19](https://github.com/MetaMask/ethjs/pull/19))
- **BREAKING**: `@babel/runtime@^7.0.0` is now a peerDependency ([#17](https://github.com/MetaMask/ethjs/pull/17))
- Update ethjs dependencies ([#19](https://github.com/MetaMask/ethjs/pull/19))
  - `@metamask/ethjs-contract@^0.3.3->^0.4.1`
  - `@metamask/ethjs-filter@^0.2.0->^0.3.0`
  - `@metamask/ethjs-provider-http@^0.2.0->^0.3.0`
  - `@metamask/ethjs-query@^0.5.2->^0.7.1`
  - `@metamask/ethjs-unit@^0.2.1->^0.3.0`
  - `@metamask/ethjs-util@^0.2.1->^0.3.0`

### Fixed
- Remove transitive dependency on babel-runtime ([#17](https://github.com/MetaMask/ethjs/pull/17)) ([#19](https://github.com/MetaMask/ethjs/pull/19))

## [0.5.1]
### Changed
- Replace `ethjs` packages with `@metamask/` forks ([#12](https://github.com/MetaMask/ethjs/pull/12)) ([#16](https://github.com/MetaMask/ethjs/pull/16))

### Fixed
- Bump `js-sha3` from `0.5.5` to `^0.9.2` ([#13](https://github.com/MetaMask/ethjs/pull/13))
  - `npm dedupe; npm audit fix`

## [0.5.0]
### Changed
- Rename package from `ethjs` to `@metamask/ethjs` ([#9](https://github.com/MetaMask/ethjs/pull/9))
- Deprecate nodejs <8.17, npm<6 ([#8](https://github.com/MetaMask/ethjs/pull/8))

### Fixed
- Re-build `dist` from source ([#2](https://github.com/MetaMask/ethjs/pull/2))

## [0.3.5]
### Fixed
- Fix getTransactionSuccess unhandled promise rejection
- Fix getTx unhandled promise rejection

## [0.3.4]
### Fixed
- EthJS-RPC
  - Fix RPC unhandled promise rejection.

## [0.2.8]
### Added
- getTransactionSuccess
  - Added the very essential getTransactionSuccess method

## [0.2.7]
### Changed
- abi updated, format and contract updates
  - Updated ethjs-abi, ethjs-format, ethjs-query, ethjs-contract
  - The updates will fix some small problems with geth/parity compat

## [0.2.6]
### Added
- added abi, personal sign/ecrecover
  - Expose ABI module
  - Added personal_sign/personal_ecRecover
  - Added log decoders

## [0.2.4]
### Changed
- package updates
  - Updates provider, handle 405 better

## [0.2.0]
### Changed
- provider upate
  - Set Provider now more dynamic accross all modules

## [0.1.9]
### Fixed
- Specified more dependencies in package.json

## [0.1.6]
### Changed
- handle 500 errors better
- Update ethjs-query

## [0.1.5]
### Changed
- update unit formatting

## [0.1.4]
### Fixed
- BN formatting fix

## [0.1.3]
### Changed
- upgrade ethjs-query

## [0.1.1]
### Added
- ethjs
  - Basic testing
  - Basic docs
  - License

[Unreleased]: https://github.com/MetaMask/ethjs/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/MetaMask/ethjs/compare/v0.5.1...v0.6.0
[0.5.1]: https://github.com/MetaMask/ethjs/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/MetaMask/ethjs/compare/v0.3.5...v0.5.0
[0.3.5]: https://github.com/MetaMask/ethjs/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/MetaMask/ethjs/compare/v0.2.8...v0.3.4
[0.2.8]: https://github.com/MetaMask/ethjs/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/MetaMask/ethjs/compare/v0.2.6...v0.2.7
[0.2.6]: https://github.com/MetaMask/ethjs/compare/v0.2.4...v0.2.6
[0.2.4]: https://github.com/MetaMask/ethjs/compare/v0.2.0...v0.2.4
[0.2.0]: https://github.com/MetaMask/ethjs/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/MetaMask/ethjs/compare/v0.1.6...v0.1.9
[0.1.6]: https://github.com/MetaMask/ethjs/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/MetaMask/ethjs/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/MetaMask/ethjs/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/MetaMask/ethjs/compare/v0.1.1...v0.1.3
[0.1.1]: https://github.com/MetaMask/ethjs/releases/tag/v0.1.1
