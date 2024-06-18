# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0]
### Fixed
- **BREAKING**: Update `bn.js` from `4.11.6` to `^5.2.1` ([#12](https://github.com/MetaMask/ethjs-unit/pull/12))
- **BREAKING**: Add peerDependency `@babel/runtime@^7.0.0` ([#11](https://github.com/MetaMask/ethjs-unit/pull/11))
- Update from `number-to-bn@1.7.0` to `@metamask/number-to-bn@^1.7.1` ([#12](https://github.com/MetaMask/ethjs-unit/pull/12))
- Upgrade babel from 6 to 7 ([#11](https://github.com/MetaMask/ethjs-unit/pull/11))
- Upgrade webpack from 2 to 3 ([#10](https://github.com/MetaMask/ethjs-unit/pull/10))

## [0.2.0]
### Changed
- Rename package from `ethjs-unit` to `@metamask/ethjs-unit` ([#7](https://github.com/MetaMask/ethjs-unit/pull/7))
- Deprecate nodejs <8.17, npm<6 ([#5](https://github.com/MetaMask/ethjs-unit/pull/5))

## [0.1.6]
### Changed
- Bump number-to-bn from 1.6.0 to 1.7.0

## [0.1.5]
### Changed
- Update bn formatting

## [0.1.3]
### Fixed
- webpack config updates
- build config updates

## [0.1.2]
### Changed
- removed BigNumber's, replaced with all BN.js
  - new approach with BN.js and absolute precision
  - more coverage
  - more docs

## [0.0.2]
### Changed
- ethjs-unit
  - More test coverage
  - Config
  - More docs

## [0.0.1]
### Added
- ethjs-unit
  - Basic testing
  - Basic docs
  - License
  - Linting
  - Basic exports

[Unreleased]: https://github.com/MetaMask/ethjs-unit/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/MetaMask/ethjs-unit/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/MetaMask/ethjs-unit/compare/v0.1.6...v0.2.0
[0.1.6]: https://github.com/MetaMask/ethjs-unit/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/MetaMask/ethjs-unit/compare/v0.1.3...v0.1.5
[0.1.3]: https://github.com/MetaMask/ethjs-unit/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MetaMask/ethjs-unit/compare/v0.0.2...v0.1.2
[0.0.2]: https://github.com/MetaMask/ethjs-unit/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/MetaMask/ethjs-unit/releases/tag/v0.0.1
