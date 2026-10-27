# Vigil Mail & Calendar

VigilTech name, supplied mark/icons, Vigil Sans and pink Night/Dawn theme replace the previous identity. GPL v3 and Tuta notices remain. Npm package name is vigil-mail; bundle/app ID org.altstack.mail is deliberately retained pending a tested OS-credential/update migration. New installers use VigilMail. Existing AltStack Mail userData and the previous internal Electron keychain service name are deliberately retained so saved mailbox sessions remain readable. Visible window/menu/About names are Vigil Mail & Calendar. No crypto, Tuta API endpoint, account/OIDC client, cookie or existing release asset is renamed. Source downloads remain linked to the historical repo. Existing hostnames work until the new domain is connected.

Nothing plays automatically. Native macOS packages remain ad-hoc signed and strictly verified, not Apple notarized. Platform packaging and real mailbox sign-in are reported separately in CI; no real mailbox data is accessed for tests.

Validation: the portal PKCE/session/logout integration test passes. The Apple Silicon DMG was built, mounted, strictly signature-verified, and launched with an isolated temporary profile. Its embedded ICNS is byte-identical to the assigned mail kit. Screenshot: docs/review/mail-mac-packaged.png. Six-platform release builds remain gated in CI; no real mailbox has been inspected.

Icons: added exact mail/calendar kits in assets/vigiltech/product-icons, build/icon.icns, build/icon.ico and build/icon.png. Removed retired assets/logo.icns, assets/logo.ico and brand/artemis copies. Corporate SVG and fonts are copied unchanged from cohnsoftassets. No asset repository is modified. Full added/removed paths are in the PR Files changed list. No mapping decision is required for AltStackMail.
