# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.3.0]
### Fixed
- **BREAKING**: Add peerDependency @babel/runtime@^7.0.0 ([#14](https://github.com/MetaMask/ethjs-util/pull/14))
- Upgrade babel from 6 to 7 ([#14](https://github.com/MetaMask/ethjs-util/pull/14))
- Upgrade webpack from 2 to 3 ([#13](https://github.com/MetaMask/ethjs-util/pull/13))
- Replace Buffer() with Buffer.from / Buffer.alloc ([#15](https://github.com/MetaMask/ethjs-util/pull/15))

## [0.2.0]
### Changed
- **BREAKING**: Rename package from `ethjs-util` to `@metamask/ethjs-util`
- **BREAKING**: Deprecate nodejs < v8.17, npm < v6
- Update dist

## [0.1.6]
### Added
- added docs
- new builds

### Removed
- removed addHexPrefix function

### Fixed
- fix for intToBuffer method

## [0.1.5]
### Added
- added addHexPrefix function

### Changed
- intToHex - stopped padding to even.

## [0.1.4]
### Fixed
- fix for node version 5

## [0.1.3]
### Added
- More docs

### Changed
- Less dependencies
- Smaller build size

## [0.1.2]
### Changed
- webpack config updates
- build config updates

## [0.1.1]
### Added
- More tests
- More docs

### Changed
- Less dependencies, same functionality


## [0.0.5]
### Changed
- Module configuration for es5, webpack and dist builds

## [0.0.4]
### Removed
- Removed one unused dep

## [0.0.3]
### Added
- added `some` property to arrayContainsArray, allows some array in another

## [0.0.2]
### Added
- added `isHexString` method
- added `getKeys` method util

## [0.0.1]
### Changed
- ethjs-util
  - Basic testing
  - Basic docs
  - License
  - linting
  - basic exports

[Unreleased]: https://github.com/MetaMask/ethjs-util/compare/v0.3.0...HEAD
[0.3.0]: https://github.com/MetaMask/ethjs-util/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/MetaMask/ethjs-util/compare/v0.1.6...v0.2.0
[0.1.6]: https://github.com/MetaMask/ethjs-util/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/MetaMask/ethjs-util/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/MetaMask/ethjs-util/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/MetaMask/ethjs-util/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/MetaMask/ethjs-util/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MetaMask/ethjs-util/compare/v0.0.5...v0.1.1
[0.0.5]: https://github.com/MetaMask/ethjs-util/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/MetaMask/ethjs-util/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/MetaMask/ethjs-util/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/MetaMask/ethjs-util/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/MetaMask/ethjs-util/releases/tag/v0.0.1
