// Change first-party presentation strings in the checksum-verified, pinned Tuta client build.
// No cryptography, endpoints, account storage, service terms or third-party identities change.
import {readdirSync,readFileSync,writeFileSync,unlinkSync} from 'node:fs';import {join} from 'node:path';
const root=process.argv[2];if(!root)throw Error('Supply the extracted verified client directory');let changed=0;
function walk(dir){for(const e of readdirSync(dir,{withFileTypes:true})){const p=join(dir,e.name);if(e.isDirectory()){walk(p);continue}if(!/\.(html|js|json|webmanifest)$/.test(e.name))continue;const before=readFileSync(p,'utf8');let urls=[];let text=before.replace(/https?:\/\/[^\s"'<>`]+/g,u=>'__COHNSOFT_URL_'+(urls.push(u)-1)+'__');text=text.replaceAll('AltStack Mail &amp; Calendar','Cohnsoft Mail &amp; Calendar').replaceAll('AltStack Mail & Calendar','Cohnsoft Mail & Calendar').replaceAll('AltStack Mail','Cohnsoft Mail & Calendar').replace(/\bAltStack\b/g,'Cohnsoft');urls.forEach((u,i)=>text=text.replaceAll('__COHNSOFT_URL_'+i+'__',u));
 if(e.name==='index.html'){text=text.replace('<body>','<body class="cs">').replace('</head>','<link rel="stylesheet" href="/cohnsoft/css/cohnsans.css"><link rel="stylesheet" href="/cohnsoft/css/goldengate.css"><link rel="stylesheet" href="/cohnsoft/mail.css"><script defer src="/cohnsoft/cohnsoft.js"></script></head>');}
 if(text!==before){writeFileSync(p,text);for(const suffix of ['.br','.gz'])try{unlinkSync(p+suffix)}catch{}changed++}
}}
walk(root);if(!readFileSync(join(root,'index.html'),'utf8').includes('Cohnsoft'))throw Error('Pinned client branding integration changed');console.log('Updated Cohnsoft presentation in '+changed+' verified client resources.');

const assets=process.argv[3]||'assets';
for(const name of readdirSync(join(root,'images'))){if(/^(?:altstack-logo|logo-favicon(?:-\d+)?|mail-logo|calendar-logo|drive-logo)\.(svg|png)$/.test(name)){writeFileSync(join(root,'images',name),readFileSync(join(assets,name.endsWith('.svg')?'logo.svg':'logo.png')));}}
