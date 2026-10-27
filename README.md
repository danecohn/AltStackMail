# Vigil Mail & Calendar

<img src="assets/vigiltech/product-icons/mail/desktop/mail-256.png" alt="VigilTech" width="96">

A product of VigilTech, vigiltech.org. Founded by Demetria Althea Cohn.


An independent VigilTech distribution of Tuta's GPLv3 web client, with the VigilTech Alpine interface, Mail and Calendar in one app, an VigilTech account portal, and six desktop installers.

An VigilTech account is required for the VigilTech-hosted portal. A separate Tuta account provides the encrypted mailbox and calendars. Email credentials and encryption keys remain in Tuta's client-side authentication/encryption flow. VigilTech does not replace that encryption, host a new mail server, grant Tuta subscriptions, or combine Tuta mailbox capacity with Warehouse capacity. Files copied into Warehouse use the shared VigilTech 2 GB Free / 8 GB Plus allowance.

The upstream Mail client already includes the calendar interface. Both launch destinations use that same client and Tuta account. Upstream legal notices, Tuta account/service terms and the GPL license remain available. The distribution is independently modified and is not endorsed by Tutao GmbH. Tuta is the upstream email service; Vigil Mail & Calendar name this distribution.

## Reproducible source

`upstream.json` pins the exact Tuta commit, including its upstream submodules. `scripts/brand.py` applies all client modifications. The workflow builds the client with Node 24, Rust/wasm-pack and Emscripten 3.1.59, then packages desktop applications on six native runners. The desktop host uses the browser client rather than Tuta's desktop native bridge, because upstream's bridge supports Windows/Linux x64 and macOS x64/ARM64. All six VigilTech architectures use the same upstream browser encryption code and a sandboxed desktop host.

Build and license source: this repository, the pinned upstream commit and upstream submodule sources. See LICENSE.txt and THIRD-PARTY.md. Do not describe an installer as published until all six builds have passed and release assets exist.

## Licence

Free software under the GNU GPL v3 or later. See LICENSE and retained upstream/third-party notices. Vigil Sans is SIL OFL 1.1. Native identifiers and keychain/profile compatibility are documented in docs/VIGILTECH-MIGRATION.md.

Icons: [VigilTech](https://github.com/danecohn/vigilicons), assigned `products/mail` and `products/calendar` kits. Copied unchanged.
