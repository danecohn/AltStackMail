// Change first-party presentation strings in the checksum-verified, pinned Tuta client build.
// No cryptography, endpoints, account storage, service terms or third-party identities change.
import {readdirSync,readFileSync,writeFileSync,unlinkSync,existsSync} from 'node:fs';import {join} from 'node:path';
const assets=process.argv[3]||'assets';const corporateSvg=readFileSync(join(assets,'logo.svg'),'utf8');
const root=process.argv[2];if(!root)throw Error('Supply the extracted verified client directory');let changed=0;
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory()){walk(p);continue}if(!/\.(html|js|json|webmanifest)$/.test(e.name))continue;const before=readFileSync(p,'utf8');let urls=[];let text=before.replace(/https?:\/\/[^\s"'<>`]+/g,u=>'__VIGILTECH_URL_'+(urls.push(u)-1)+'__');text=text.replace(/(?:AltStack|Cohnsoft|Cohn|Artemis) Mail(?: &(?:amp;)? Calendar)?/g,'Vigil Mail & Calendar').replace(/\bAltStack\b/g,'VigilTech');urls.forEach((u,i)=>text=text.replaceAll('__VIGILTECH_URL_'+i+'__',u));
 if(e.name==='index.html'){if(!text.includes('data-theme='))text=text.replace('<html ', '<html data-theme="dark" ');text=text.replace(/\bclass=([\"'])cs\1/g,'class=\"vt\"').replaceAll('/cohnsoft/','/vigiltech/').replaceAll('cohnsans.css','vigilsans.css').replaceAll('cohnsoft.js','vigiltech.js').replaceAll('>Cohnsoft<','>VigilTech<').replaceAll('>Warehouse<','>Drive<');text=text.replace('<body>','<body class="vt">');text=text.replace(/<script\b[^>]*src=["\']\/vigiltech\/vigiltech\.js(?:\?[^"\']*)?["\'][^>]*><\/script>/gi,'').replace(/<link\b[^>]*href=["\']\/vigiltech\/(?:css\/(?:vigilsans|goldengate)\.css|mail\.css)(?:\?[^"\']*)?["\'][^>]*>/gi,'');text=text.replace('</head>','<link rel="stylesheet" href="/vigiltech/css/vigilsans.css"><link rel="stylesheet" href="/vigiltech/css/goldengate.css"><link rel="stylesheet" href="/vigiltech/mail.css"><script defer src="/vigiltech/vigiltech.js?v=1.0.7"></script></head>');}
 text=text.replace(/`<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" viewBox="0 0 240 72">[^`]*Cohnsoft<\/text>[^`]*<\/svg>`/g,()=>JSON.stringify(corporateSvg));
 text=text.replaceAll('#3569A4','#d6004a').replaceAll('#183F69','#a8003a').replaceAll('#D8E7F8','#ffd6e4');
 if(text!==before){writeFileSync(p,text);for(const suffix of ['.br','.gz'])try{unlinkSync(p+suffix)}catch{}changed++}
}}
walk(root);if(!readFileSync(join(root,'index.html'),'utf8').includes('VigilTech'))throw Error('Pinned client branding integration changed');console.log('Updated VigilTech presentation in '+changed+' verified client resources.');

for(const name of readdirSync(join(root,'images'))){if(/^(?:altstack-logo|logo-favicon(?:-\d+)?|mail-logo|calendar-logo|drive-logo)\.(svg|png)$/.test(name)){writeFileSync(join(root,'images',name),readFileSync(join(assets,name.endsWith('.svg')?'logo.svg':'logo.png')));}}

// Supplied product web kits replace every first-party favicon without image conversion.
for(const name of readdirSync(join(root,'images'))){if(/^logo-favicon.*\.png$/.test(name))writeFileSync(join(root,'images',name),readFileSync(join(assets,'vigiltech/product-icons/mail/web',name.includes('192')?'icon-192.png':'icon-512.png')))}

let launch=readFileSync(join(root,'index.html'),'utf8');launch=launch.replace(/(<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["'])[^"']+(["'])/g,'$1/vigiltech/product-icons/mail/web/favicon.ico$2');writeFileSync(join(root,'index.html'),launch);

const logoModule=join(root,'ui/base/Logo.js');
if(existsSync(logoModule)){let logos=readFileSync(logoModule,'utf8');
for(const [name,next] of [['getTutaLogoSvg','getMailLogoSvg'],['getMailLogoSvg','getCalendarLogoSvg'],['getCalendarLogoSvg','getDriveLogoSvg']]){
 const begin=logos.indexOf('export function '+name+'('),end=logos.indexOf('export function '+next+'(',begin);
 if(begin<0||end<0)throw Error('Pinned client logo exports changed: '+name);
 logos=logos.slice(0,begin)+'export function '+name+'(_fillColor) { return '+JSON.stringify(corporateSvg)+'; }\n'+logos.slice(end);
}
writeFileSync(logoModule,logos);for(const suffix of ['.br','.gz'])try{unlinkSync(logoModule+suffix)}catch{}

}

// Rotate only the disposable upstream application-code cache. Account databases,
// encrypted mailbox storage and native profile/keychain identifiers stay unchanged.
const serviceWorker=join(root,'sw.js');
if(existsSync(serviceWorker)){
 const before=readFileSync(serviceWorker,'utf8');
 if(!before.includes('CODE_CACHE-vigiltech-1.0.7-v')){
  if(!before.includes('CODE_CACHE-v'))throw Error('Pinned client code-cache prefix changed');
  writeFileSync(serviceWorker,before.replaceAll('CODE_CACHE-v','CODE_CACHE-vigiltech-1.0.7-v'));
  for(const suffix of ['.br','.gz'])try{unlinkSync(serviceWorker+suffix)}catch{}
 }
}
