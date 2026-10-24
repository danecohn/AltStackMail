'use strict';
// electron-builder afterPack hook. Electron ships with a linker-signed ad-hoc signature that stops matching once electron-builder
// edits the bundle (Info.plist, icons, app code). With `identity: null` nothing re-seals it, so Apple Silicon reports
// "code has no resources but signature indicates they must be present" and Finder says the app "is damaged and can't be opened".
// Re-sealing ad hoc fixes that. With a Developer ID configured (CSC_LINK) electron-builder signs and notarizes instead.
const { execFileSync } = require('node:child_process');
const path = require('node:path');

exports.default = async function adhocSign(context) {
  if (context.electronPlatformName !== 'darwin') return;
  if (process.env.CSC_LINK || process.env.CSC_NAME) return;
  const app = path.join(context.appOutDir, context.packager.appInfo.productFilename + '.app');
  execFileSync('codesign', ['--force', '--deep', '--sign', '-', '--timestamp=none', app], { stdio: 'inherit' });
  execFileSync('codesign', ['--verify', '--deep', '--strict', app], { stdio: 'inherit' });
  console.log('ad-hoc signed and verified ' + app);
};
