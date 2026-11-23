# Build status and release gates

Updated: 2026-11-23

## What exists in this repository

- A standalone HTML interface prototype in `prototype/index.html`.
- Keyboard navigation and experimental Gamepad API input.
- Stremio add-on protocol client integrated into the preview: HTTPS manifest validation and catalog metadata retrieval (no stream requests), with automated Node.js tests.
- Demo-only catalogue data and a clearly disabled account-linking screen.
- Static validation script (`npm test`) and a GitHub Actions workflow that runs it on pushes and pull requests.

## What does not exist yet

- A native PS4/Orbis application.
- A verified Stremio QR-pairing flow.
- Real account authentication or library sync.
- Verified add-on compatibility against live third-party endpoints; the protocol client currently has mocked automated tests.
- A video playback engine validated on PS4.
- A reproducible PS4 PKG build pipeline or an installable PKG artifact.
- Hardware test results for PS4 Fat 13.52, or for Slim/Pro.

## Why the distinction matters

A browser-based HTML preview is not equivalent to a native PS4 application. A PS4 package requires a compatible, authorized development toolchain and a runtime that can access the required console APIs. Media playback additionally depends on codecs, network protocols, subtitles, audio output, and memory limits. None of those capabilities can be inferred from a desktop browser preview.

Account linking must use a supported Stremio authentication mechanism. The project must not invent a QR code, collect passwords in an unofficial form, or commit session tokens.

## Release gates

A build may only be called a PS4 PKG release after all of the following are true:

1. The target runtime and supported firmware are documented from reliable technical evidence.
2. The application builds reproducibly from source.
3. The package installs and launches on the declared PS4 model/firmware.
4. DualShock 4 navigation is tested on hardware.
5. Account authentication and library synchronization use a supported method.
6. Playback, subtitles, audio, seeking, and network failure behavior are tested with authorized sources.
7. The release notes list exact tested hardware and firmware.

Until then, this repository is a prototype and research project, not a completed PS4 app.
