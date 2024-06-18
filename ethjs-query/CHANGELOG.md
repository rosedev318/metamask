# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.7.1]
### Changed
- Update `@metamask/ethjs-rpc` from `^0.3.1` to `^0.4.0` ([#43](https://github.com/MetaMask/ethjs-query/pull/43))
  - Package migrated from babel 6 to 7

## [0.7.0]
### Changed
- Update from `ethjs-format@0.2.7` to `@metamask/ethjs-format@^0.3.0` ([#26](https://github.com/MetaMask/ethjs-query/pull/26))
  - Users are encouraged to switch peer packages from `ethjs-*` to `@metamask/ethjs-*` where available.

## [0.6.0]
### Changed
- **BREAKING**: `@babel/runtime@^7.0.0` is now a peerDependency ([#10](https://github.com/MetaMask/ethjs-query/pull/10))
- Update from `ethjs-rpc@0.2.0` to `@metamask/ethjs-rpc@^0.3.0` ([#22](https://github.com/MetaMask/ethjs-query/pull/22))

### Removed
- Remove implicit peerDependency `babel-runtime` ([#10](https://github.com/MetaMask/ethjs-query/pull/10))

## [0.5.3]
### Fixed
- Dependency range of `@metamask/ethjs-rpc` is now valid semver ([#40](https://github.com/MetaMask/ethjs-query/pull/40))
  - This fixes an issues that affected yarn berry users.

## [0.5.2]
### Changed
- Bump `@metamask/ethjs-format` from `^0.2.8` to `^0.2.9` ([#38](https://github.com/MetaMask/ethjs-query/pull/38))

### Fixed
- Restrict `@metamask/ethjs-rpc` to `^0.3.0 !0.3.1` ([#38](https://github.com/MetaMask/ethjs-query/pull/38))
  - Dependency update in `@metamask/ethjs-rpc@0.3.1` is not supposed to land prior to `0.6.0`

## [0.5.1]
### Changed
- Update from `ethjs-format@0.2.7`to `@metamask/ethjs-format@^0.2.8` ([#26](https://github.com/MetaMask/ethjs-query/pull/26))
- Update from `ethjs-rpc@0.2.0` to `@metamask/ethjs-rpc@^0.3.0` ([#22](https://github.com/MetaMask/ethjs-query/pull/22))
- Change examples to use `@metamask/` forks of `ethjs-` packages ([#29](https://github.com/MetaMask/ethjs-query/pull/29))

## [0.5.0]
### Changed
- change to error reporting
  - Removed logic that was catching too broadly and applying an erroneous "formatting error" error.
  - Removed logic that was rethrowing newly constructed Error objects that stripped stack traces relevant to the actual error.
  - Changes to lint configuration

## [0.4.0]
### Changed
- maintenance update
  - Renamed to `@metamask/ethjs-query`
  - Fixed and removed broken devDependencies
  - Require minimum nodejs v8.17, npm v6
  - Repository location changed
  - `npm prepublish` is now `npm prepare`

## [0.3.8]
### Changed
- performCall change
  - Replace babel transforms with dependency babel-runtime
  - performCall behaves differently

## [0.3.7]
### Changed
- various fixes
  - Async and promise handling changes
  - ethjs-rpc bump to 0.2.0
  - Replaced ethereum-testrpc with ganache-core

## [0.3.6]
### Changed
- ethjs-format bump to 0.2.7

## [0.3.5]
### Changed
- new eth filter ID changes
  - Adds padded quantities
  - Fixed problem where number ID 1 for filter ID encodes to 0x1, when it should be 0x01 (with padding)
  - Methods affected: `eth.getFilterChanges` `eth.uninstallFilter` `eth.getFilterLogs`

## [0.3.4]
### Changed
- added new ethjs-format
  - Unhandled promise rejection fixed, and is no longer being swolloed.
  - ethjs-rpc bump to 0.1.9

## [0.2.6]
### Changed
- added new ethjs-format
  - no longer padds quantity hex values, as per standard.

## [0.2.4]
### Changed
- personal sign and ecrecover

## [0.2.3]
### Changed
- package updates
  - Update ethjs-rpc, handle 405 errors better

## [0.2.1]
### Changed
- handle non RPC errors better
  - Handle non rpc errors better

## [0.2.0]
### Changed
- handle 500 errors better
  - Handles 500/404/303 errors

## [0.1.8]
### Changed
- bn formatting update
  - Bignumber formatting update

## [0.1.7]
### Changed
- Better RPC error handling
  - Better RPC error handling

## [0.1.6]
### Changed
- Strinigy RPC error
  - Added JSON.strinify for RPC error handling

## [0.1.5]
### Changed
- format update
  - Tigher formatting enforcement
  - Small schema update

## [0.1.4]
### Changed
- less dependencies
  - Better formatting
  - Less dependencies
  - ID generation done in house
  - 25kb less file size
  - More docs

## [0.1.2]
### Changed
- config fixes
  - webpack config updates
  - build config updates

## [0.1.1]
### Changed
- new packages
  - new ethjs-format
  - more docs

## [0.0.5]
### Changed
- refactor
  - code cleanup
  - more coverage
  - better error handling
  - less dependencies

## [0.0.4]
### Changed
- promises, louder errors, more tests
  - added promises
  - louder errors
  - more test coverage

## [0.0.3]
### Changed
- options with debug logging and other features
  - added low level complete logging `new Eth(provider, { debug: false, logger: console, jsonSpace: 0 })`
  - more tests

## [0.0.2]
### Changed
- handle `eth_getFilterChanges` during Block and Pending Tx filter
  - handle `getFilterChanges` during BlockFilter and PendingTxFilter.

## [0.0.1]
### Changed
- `ethjs-query`
  - Basic testing
  - Basic docs
  - License
  - linting
  - basic exports

[Unreleased]: https://github.com/MetaMask/ethjs-query/compare/v0.7.1...HEAD
[0.7.1]: https://github.com/MetaMask/ethjs-query/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/MetaMask/ethjs-query/compare/v0.6.0...v0.7.0
[0.6.0]: https://github.com/MetaMask/ethjs-query/compare/v0.5.3...v0.6.0
[0.5.3]: https://github.com/MetaMask/ethjs-query/compare/v0.5.2...v0.5.3
[0.5.2]: https://github.com/MetaMask/ethjs-query/compare/v0.5.1...v0.5.2
[0.5.1]: https://github.com/MetaMask/ethjs-query/compare/v0.5.0...v0.5.1
[0.5.0]: https://github.com/MetaMask/ethjs-query/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/MetaMask/ethjs-query/compare/v0.3.8...v0.4.0
[0.3.8]: https://github.com/MetaMask/ethjs-query/compare/v0.3.7...v0.3.8
[0.3.7]: https://github.com/MetaMask/ethjs-query/compare/v0.3.6...v0.3.7
[0.3.6]: https://github.com/MetaMask/ethjs-query/compare/v0.3.5...v0.3.6
[0.3.5]: https://github.com/MetaMask/ethjs-query/compare/v0.3.4...v0.3.5
[0.3.4]: https://github.com/MetaMask/ethjs-query/compare/v0.2.6...v0.3.4
[0.2.6]: https://github.com/MetaMask/ethjs-query/compare/v0.2.4...v0.2.6
[0.2.4]: https://github.com/MetaMask/ethjs-query/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/MetaMask/ethjs-query/compare/v0.2.1...v0.2.3
[0.2.1]: https://github.com/MetaMask/ethjs-query/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/MetaMask/ethjs-query/compare/v0.1.8...v0.2.0
[0.1.8]: https://github.com/MetaMask/ethjs-query/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/MetaMask/ethjs-query/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/MetaMask/ethjs-query/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/MetaMask/ethjs-query/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/MetaMask/ethjs-query/compare/v0.1.2...v0.1.4
[0.1.2]: https://github.com/MetaMask/ethjs-query/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/MetaMask/ethjs-query/compare/v0.0.5...v0.1.1
[0.0.5]: https://github.com/MetaMask/ethjs-query/compare/v0.0.4...v0.0.5
[0.0.4]: https://github.com/MetaMask/ethjs-query/compare/v0.0.3...v0.0.4
[0.0.3]: https://github.com/MetaMask/ethjs-query/compare/v0.0.2...v0.0.3
[0.0.2]: https://github.com/MetaMask/ethjs-query/compare/v0.0.1...v0.0.2
[0.0.1]: https://github.com/MetaMask/ethjs-query/releases/tag/v0.0.1
