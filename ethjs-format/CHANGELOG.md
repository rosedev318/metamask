# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0]
### Changed
- Update from `ethjs-util@0.1.3` to `@metamask/ethjs-util@^0.3.0`
- Update from `number-to-bn@1.7.0` to `@metamask/number-to-bn@^1.7.1`
- Update `bn.js` from `4.11.6` to `^5.2.1`

## [0.2.8]
### Changed
- Rename package from `ethjs-format` to `@metamask/ethjs-format` ([#4](https://github.com/MetaMask/ethjs-format/pull/4))
- Deprecate nodejs < v8.17, npm < v6 ([#8](https://github.com/MetaMask/ethjs-format/pull/8))

## [0.2.7]
### Changed
- forced support quantity padding
  - QP   0 => 0x00
  - Q    0 => 0x0

## [0.2.0]
### Changed
- no longer padds quantity values
  - Not sure why we ever did, maybe just logical assumptions...
  - Quantity "0" => "0x0"
             "1" => "0x1" etc.. no padding of hex quantity values in the format layer.

## [0.1.8]
### Added
- added personal sign and recover

## [0.1.7]
### Changed
- hex prefix
  - Updates number-to-bn

## [0.1.5]
### Changed
- fixed block formatting
  - Spec down enforcement (not value up)
  - Tighter spec enforement
  - Schema update

## [0.1.4]
### Removed
- Remove possibility of negative numbers on chain

## [0.1.3]
### Changed
- less deps
  - New util with less dependencies
  - webpack config updates
  - build config updates

## [0.1.2]
### Changed
- less dependencies
  - Removal of utf8 dependency
  - ethjs-util update
  - package config update

## [0.1.1]
### Changed
- removal of BigNumber for BN
- package fixes, removals

## [0.1.0]
### Changed
- better coverage testing

## [0.0.9]
### Changed
- more schema details for adding
  - Added additional data for the "latest" tag, flagged as:
  [0] inputs
  [1] outputs
  [2] minimum required input array length
  [3] if === 2 ? `latest` : ``

## [0.0.8]
### Added
- Expose entire schema in exports for other modules to use

## [0.0.7]
### Changed
- more schema updates
  - Define requirements further for length of calls like ssh_post etc.

## [0.0.6]
### Changed
- handle BlockFilter and PendingTransactionFilter
  - Handle the bad design caveit of tx or FilterChange result

## [0.0.5]
### Fixed
- Minor fix on eth_getCode, requires 1 not 2 param length

## [0.0.4]
### Fixed
- Minor fix on eth_getTransactionCount, required 2 instead of 1..

## [0.0.3]
### Changed
- Enforce input param requirements
- Ethjs-util integration

## [0.0.2]
### Changed
- Handle quantity floats with error (no floats on chain)
- Switched all bignumbers from `bn.js` to `bignumber.js`
- Enfore 20 and 32 byte lengths where required, throw if not alphanumeric

## [0.0.1]
### Added
- ethjs-format
  - Basic testing
  - Basic docs
  - License


[Unreleased]: https://github.com/MetaMask/ethjs-format/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/MetaMask/ethjs-format/compare/v0.2.8...v0.3.0
[0.2.8]: https://github.com/MetaMask/ethjs-format/compare/v0.2.7...v0.2.8
[0.2.7]: https://github.com/MetaMask/ethjs-format/compare/v0.2.0...v0.2.7
[0.2.0]: https://github.com/MetaMask/ethjs-format/compare/v0.1.8...v0.2.0
[0.1.8]: https://github.com/MetaMask/ethjs-format/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/MetaMask/ethjs-format/compare/v0.1.5...v0.1.7
[0.1.5]: https://github.com/MetaMask/ethjs-format/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/MetaMask/ethjs-format/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/MetaMask/ethjs-format/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MetaMask/ethjs-format/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MetaMask/ethjs-format/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/MetaMask/ethjs-format/compare/v0.0.9...v0.1.0
[0.0.9]: https://github.com/MetaMask/ethjs-format/compare/v0.0.8...v0.0.9
[0.0.8]: https://github.com/MetaMask/ethjs-format/compare/v0.0.7...v0.0.8
[0.0.7]: https://github.com/MetaMask/ethjs-format/compare/v0.0.6...v0.0.7
[0.0.6]: https://github.com/MetaMask/ethjs-format/compare/v0.0.5...v0.0.6
[0.0.5]: https://github.com/MetaMask/ethjs-format/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/MetaMask/ethjs-format/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/MetaMask/ethjs-format/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/MetaMask/ethjs-format/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/MetaMask/ethjs-format/releases/tag/v0.0.1
