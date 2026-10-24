from pathlib import Path
import sys,re,shutil,json
root=Path(sys.argv[1]);assets=Path(__file__).resolve().parents[1]/'assets'
# Brand the client and select the existing public Tuta service. Crypto, service terms,
# subscription descriptions and legal notices stay under upstream control.
p=root/'src/ui/base/Logo.ts';s=p.read_text()
for name,next_name in [('getTutaLogoSvg','getMailLogoSvg'),('getMailLogoSvg','getCalendarLogoSvg'),('getCalendarLogoSvg','getDriveLogoSvg')]:
 start=s.index('export function '+name+'(');end=s.index('export function '+next_name+'(',start)
 s=s[:start]+f'''export function {name}(fillColor?: string): string {{
 return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 72"><image href="/images/altstack-logo.svg" x="0" y="2" width="68" height="68"/><text x="80" y="31" font-family="system-ui,sans-serif" font-size="23" font-weight="650" fill="${{fillColor ?? '#294c76'}}">AltStack</text><text x="80" y="54" font-family="system-ui,sans-serif" font-size="13" fill="${{fillColor ?? '#59718d'}}">Mail &amp; Calendar</text></svg>`
}}

'''+s[end:]
p.write_text(s)
p=root/'src/platform-kit/app-env/Env.ts';s=p.read_text().replace('Mail. Done. Right. Tuta Mail Login & Sign up for an Ad-free Mailbox','AltStack Mail & Calendar — Sign in with your Tuta account');p.write_text(s)
p=root/'src/applications/mail-app/app.ts';s=p.read_text();needle='m.route(document.body, startRoute, resolvers)';assert needle in s or 'm.route(document.getElementById("altstack-client")!' in s;s=s.replace(needle,'m.route(document.getElementById("altstack-client")!, startRoute, resolvers)');p.write_text(s)
p=root/'src/ui/builtinThemes.ts';s=p.read_text().replace('primary: "#8F4A4E"','primary: "#3569A4"').replace('on_primary_container: "#410002"','on_primary_container: "#183F69"').replace('primary_container: "#FFDAD6"','primary_container: "#D8E7F8"').replace('surface: "#FFFFFF"','surface: "#F5F8FC"');p.write_text(s)
p=root/'buildSrc/LaunchHtml.js';s=p.read_text();s=s.replace('<html>','<html lang="en">').replace('initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover','initial-scale=1.0, viewport-fit=cover');s=s.replace('<title>${env.mode === "App" || env.mode === "Desktop" ? "Tuta" : "Tuta: Login &amp; Sign up for free"}</title>','<title>AltStack Mail &amp; Calendar</title>')
s=s.replace('<meta name="application-name" content="Tuta">','<meta name="application-name" content="AltStack Mail &amp; Calendar"><meta name="theme-color" content="#d4dce7"><link rel="manifest" href="/manifest.webmanifest"><link rel="stylesheet" href="/altstack.css"><script src="/altstack.js" defer></script>')
s=s.replace('<body style="background-color:transparent">','<body><header id="altstack-nav"><a class="altstack-home" href="/ecosystem">AltStack</a><nav aria-label="AltStack Mail apps"><a href="/mail">Mail</a><a href="/calendar">Calendar</a><a href="/ecosystem/warehouse">Warehouse</a><a href="/ecosystem/office">Office</a></nav><details><summary aria-label="Mail account and information">•••</summary><div><a href="/account">AltStack account</a><a href="https://app.tuta.com/signup" target="_blank" rel="noopener">Create a Tuta account</a><a href="/about">About &amp; source licenses</a><form action="/auth/logout" method="post"><button>Sign out of AltStack Mail portal</button></form></div></details></header><main id="altstack-client"></main>')
s=re.sub(r'<meta\s+(?:name="twitter:[^"]+"|property="(?:og:|article:)[^"]+")[\s\S]*?>\s*','',s);s=s.replace('<link rel="canonical" href="https://app.tuta.com/">','')
p.write_text(s)
for name in ['logo-favicon.svg','mail-logo.svg','calendar-logo.svg']:
 shutil.copy2(assets/'logo.svg',root/'resources/images'/name)
shutil.copy2(assets/'logo.svg',root/'resources/images/altstack-logo.svg')
for name in ['logo-favicon.svg']:
 shutil.copy2(assets/'logo.svg',root/'resources/favicon'/name)
# This distribution uses existing Tuta accounts, rather than hosting a Tuta server.
# Keep upstream's account, payment, WebAuthn and encrypted API endpoints together.
p=root/'buildSrc/DomainConfigs.js';s=p.read_text();marker='"{hostname}": {';start=s.index(marker);end=s.index('\n\t},',start)+len('\n\t},')
source_start=s.index('"app.tuta.com": {');source_end=s.index('\n\t},',source_start)+len('\n\t},')
s=s[:start]+s[source_start:source_end].replace('"app.tuta.com": {',marker,1)+s[end:];p.write_text(s)
# The production build's client uses app.tuta.com directly. Never proxy decrypted
# credentials/mail through AltStack or change Tuta's encryption/network modules.
print('Applied AltStack client presentation to pinned Tuta source')

