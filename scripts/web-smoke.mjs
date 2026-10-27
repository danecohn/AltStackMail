import http from 'node:http';import {readFile,stat,mkdir} from 'node:fs/promises';import {resolve,extname} from 'node:path';import {chromium} from 'playwright';
const root=resolve('web'),mime={'.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.wasm':'application/wasm','.ttf':'font/ttf','.woff2':'font/woff2','.png':'image/png','.html':'text/html'};
const server=http.createServer(async(req,res)=>{let path;try{path=resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));if(!path.startsWith(root+'/'))path=resolve(root,'index.html');let file;try{file=await stat(path);}catch{}if(!file?.isFile())path=resolve(root,'index.html');const data=await readFile(path);res.setHeader('Content-Type',mime[extname(path)]||'application/octet-stream');res.end(data);}catch{res.writeHead(500);res.end();}});
await new Promise(r=>server.listen(8099,'127.0.0.1',r));await mkdir('validation',{recursive:true});const browser=await chromium.launch({headless:true});
try{for(const[device,size]of Object.entries({desktop:{width:1440,height:960},mobile:{width:390,height:844}})){
 const page=await browser.newPage({viewport:size});const errors=[];page.on('pageerror',error=>errors.push(error.message));await page.goto('http://127.0.0.1:8099/login',{waitUntil:'domcontentloaded'});await page.locator('#altstack-client input[type=password]').waitFor({timeout:90000});
 const backend=await page.evaluate(()=>env.domainConfigs['{hostname}']);
 if(backend.apiUrl!=='https://app.tuta.com'||backend.websocketUrl!=='wss://app.tuta.com')throw Error('Custom portal must use the real Tuta service');
 if(!await page.getByRole('navigation',{name:'Cohnsoft Mail & Calendar apps'}).isVisible())throw Error('Cohnsoft navigation is missing');
 if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1))throw Error('Horizontal overflow on '+device);
 await page.screenshot({path:'validation/Mail-'+device+'.png',fullPage:true});await page.getByRole('link',{name:'Calendar',exact:true}).click();await page.locator('#altstack-client input[type=password]').waitFor();
 if(errors.length)throw Error(errors.join('\n'));await page.close();
}}finally{await browser.close();await new Promise(r=>server.close(r));}

