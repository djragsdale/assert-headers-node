# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.1.2] - 2021-05-20

### Fixed

- Configuration property for user-agent

## [0.1.1] - 2021-05-07

### Fixed

- Beef up the documentation
- Fixed lint

## [0.1.0] - 2021-05-07

### Added

- assert-headers CLI command for asserting a response against a header schema
- default export is an assertHeaders function for asserting a headers object against a schema
- exports a named fromUrl method which makes an HTTP(S) request and asserts the response headers against a configuration
