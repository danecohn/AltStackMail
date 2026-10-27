from pathlib import Path
import sys,re,shutil,json
root=Path(sys.argv[1]);assets=Path(__file__).resolve().parents[1]/'assets'
# Brand the client and select the existing public Tuta service. Crypto, service terms,
# subscription descriptions and legal notices stay under upstream control.
p=root/'src/ui/base/Logo.ts';s=p.read_text()
for name,next_name in [('getTutaLogoSvg','getMailLogoSvg'),('getMailLogoSvg','getCalendarLogoSvg'),('getCalendarLogoSvg','getDriveLogoSvg')]:
 start=s.index('export function '+name+'(');end=s.index('export function '+next_name+'(',start)
 svg=(assets/'logo.svg').read_text(encoding='utf-8')
 s=s[:start]+f"export function {name}(_fillColor?: string): string {{\n return {json.dumps(svg)};\n}}\n\n"+s[end:]

p.write_text(s)
p=root/'src/platform-kit/app-env/Env.ts';s=p.read_text().replace('Mail. Done. Right. Tuta Mail Login & Sign up for an Ad-free Mailbox','Vigil Mail & Calendar — Sign in with your Tuta account');p.write_text(s)
p=root/'src/applications/mail-app/app.ts';s=p.read_text();needle='m.route(document.body, startRoute, resolvers)';assert needle in s or 'm.route(document.getElementById("altstack-client")!' in s;s=s.replace(needle,'m.route(document.getElementById("altstack-client")!, startRoute, resolvers)');p.write_text(s)
p=root/'src/ui/builtinThemes.ts';s=p.read_text().replace('primary: "#8F4A4E"','primary: "#d6004a"').replace('on_primary_container: "#410002"','on_primary_container: "#a8003a"').replace('primary_container: "#FFDAD6"','primary_container: "#ffd6e4"').replace('surface: "#FFFFFF"','surface: "#F5F8FC"');p.write_text(s)
p=root/'buildSrc/LaunchHtml.js';s=p.read_text();s=s.replace('<html>','<html lang="en">').replace('initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover','initial-scale=1.0, viewport-fit=cover');s=s.replace('<title>${env.mode === "App" || env.mode === "Desktop" ? "Tuta" : "Tuta: Login &amp; Sign up for free"}</title>','<title>Vigil Mail &amp; Calendar</title>')
s=s.replace('<meta name="application-name" content="Tuta">','<meta name="application-name" content="Vigil Mail &amp; Calendar"><meta name="theme-color" content="#d4dce7"><link rel="manifest" href="/manifest.webmanifest"><link rel="stylesheet" href="/altstack.css"><script src="/altstack.js" defer></script>')
s=s.replace('<body style="background-color:transparent">','<body><header id="altstack-nav"><a class="altstack-home" href="/ecosystem">VigilTech</a><nav aria-label="Vigil Mail & Calendar apps"><a href="/mail">Mail</a><a href="/calendar">Calendar</a><a href="/ecosystem/warehouse">Drive</a><a href="/ecosystem/office">Office</a></nav><details><summary aria-label="Mail account and information">•••</summary><div><a href="/account">VigilTech account</a><a href="https://app.tuta.com/signup" target="_blank" rel="noopener">Create a Tuta account</a><a href="/about">About &amp; source licenses</a><form action="/auth/logout" method="post"><button>Sign out of Vigil Mail & Calendar portal</button></form></div></details></header><main id="altstack-client"></main>')
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
# credentials/mail through VigilTech or change Tuta's encryption/network modules.
print('Applied VigilTech client presentation to pinned Tuta source')

