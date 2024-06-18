# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.4.1]
### Changed
- Update `@metamask/ethjs-filter` from `^0.2.0` to `^0.3.0` ([#21](https://github.com/MetaMask/ethjs-contract/pull/21))
- Update `@metamask/ethjs-util` from `^0.2.0` to `^0.3.0` ([#21](https://github.com/MetaMask/ethjs-contract/pull/21))

### Fixed
- Remove dependency `babel-runtime@^6.26.0` ([#21](https://github.com/MetaMask/ethjs-contract/pull/21))

## [0.4.0]
### Changed
- **BREAKING**: `@babel/runtime@^7.0.0` is now a peerDependency ([#6](https://github.com/MetaMask/ethjs-contract/pull/6))
- Built using `webpack@3.12.0` instead of `webpack@2.10.0-beta.15` ([#6](https://github.com/MetaMask/ethjs-contract/pull/6))

### Removed
- Remove implicit peerDependency `babel-runtime` ([#6](https://github.com/MetaMask/ethjs-contract/pull/6))

## [0.3.4]
### Changed
- Unpin `ethjs-abi` from `0.2.0` to `^0.2.0`, allowing `ethjs-abi@0.2.1` ([#19](https://github.com/MetaMask/ethjs-contract/pull/19))

## [0.3.3]
### Changed
- Update from `ethjs-filter@0.1.8` to `@metamask/ethjs-filter@^0.2.0` ([#16](https://github.com/MetaMask/ethjs-contract/pull/16))

## [0.3.2]
### Changed
- Replace `ethjs-` packages with `@metamask` forks ([#12](https://github.com/MetaMask/ethjs-contract/pull/12))

### Fixed
- Update and unpin dependency `js-sha3` from `0.5.5` to `^0.9.2` ([#11](https://github.com/MetaMask/ethjs-contract/pull/11))

## [0.3.1]
### Fixed
- Restore support for Node.js versions >=10 ([#9](https://github.com/MetaMask/ethjs-contract/pull/9))

## [0.3.0]
### Changed
- Rename package from `ethjs-contract` to `@metamask/ethjs-contract` ([#7](https://github.com/MetaMask/ethjs-contract/pull/7))
- Restrict compatible node versions to ^8.17 ([#2](https://github.com/MetaMask/ethjs-contract/pull/2))

### Fixed
- Add missing dependency `promise-to-callback` ([#5](https://github.com/MetaMask/ethjs-contract/pull/5))

## [0.1.6]
### Changed
- Bn formatting update

## [0.1.5]
### Removed
- Removed `ethjs-sha3` for `js-sha3`.

## [0.1.4]
### Fixed
- Fix object mutation with eth_call, eth_sendTransaction

## [0.1.3]
### Changed
- Webpack config updates
- Build config updates

## [0.1.2]
### Changed
- Updated ethjs-abi module
- More docs

## [0.1.1]
### Changed
- New Event object
- Package upgrades and fixes
- More docs

## [0.1.0]
### Changed
- promises, full coverage
  - Promises and callbacks on calls, new, event watchers
  - More coverage
  - Package upgrades

## [0.0.1]
### Added
- ethjs-contract
  - Basic testing
  - Basic docs
  - License

[Unreleased]: https://github.com/MetaMask/ethjs-contract/compare/v0.4.1...HEAD
[0.4.1]: https://github.com/MetaMask/ethjs-contract/compare/v0.4.0...v0.4.1
[0.4.0]: https://github.com/MetaMask/ethjs-contract/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/MetaMask/ethjs-contract/compare/v0.3.3...v0.3.4
[0.3.3]: https://github.com/MetaMask/ethjs-contract/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/MetaMask/ethjs-contract/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/MetaMask/ethjs-contract/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/MetaMask/ethjs-contract/compare/v0.1.6...v0.3.0
[0.1.6]: https://github.com/MetaMask/ethjs-contract/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/MetaMask/ethjs-contract/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/MetaMask/ethjs-contract/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/MetaMask/ethjs-contract/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MetaMask/ethjs-contract/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MetaMask/ethjs-contract/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MetaMask/ethjs-contract/compare/v0.0.1...v0.1.0
[0.0.1]: https://github.com/MetaMask/ethjs-contract/releases/tag/v0.0.1
