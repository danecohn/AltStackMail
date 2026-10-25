import {app,BrowserWindow,Menu,shell,dialog,session} from 'electron';
import {readFileSync} from 'node:fs';import {fileURLToPath} from 'node:url';import {join,dirname} from 'node:path';
const here=dirname(fileURLToPath(import.meta.url)),config=JSON.parse(readFileSync(join(here,'../upstream.json'),'utf8'));
if(process.argv.includes('--smoke-test'))app.disableHardwareAcceleration();
const allowed=new Set([new URL(config.mailOrigin).origin,new URL(config.platformOrigin).origin]);let window;
const external=async value=>{let url;try{url=new URL(value);}catch{return;}if(['https:','http:','mailto:'].includes(url.protocol))await shell.openExternal(url.href);};
const open=(route='')=>window.loadURL(config.mailOrigin+route);
async function createWindow(){
 window=new BrowserWindow({width:1280,height:880,minWidth:360,minHeight:600,title:'AltStack Mail & Calendar',backgroundColor:'#e8eef5',icon:join(here,'../assets/logo.png'),webPreferences:{nodeIntegration:false,contextIsolation:true,sandbox:true,webSecurity:true,spellcheck:true}});
 window.webContents.setWindowOpenHandler(({url})=>{external(url);return {action:'deny'};});
 window.webContents.on('will-navigate',(event,url)=>{if(!allowed.has(new URL(url).origin)){event.preventDefault();external(url);}});
 window.webContents.on('did-fail-load',(_event,code,_description,_url,main)=>{if(main&&code!==-3)window.loadFile(join(here,'offline.html'));});
 session.defaultSession.setPermissionRequestHandler(async(contents,permission,callback)=>{if(permission!=='notifications'||!allowed.has(new URL(contents.getURL()).origin)){callback(false);return;}const choice=await dialog.showMessageBox(window,{type:'question',message:'Allow AltStack Mail notifications?',detail:'Show new-mail and calendar alerts while the app is running.',buttons:['Not now','Allow'],defaultId:0,cancelId:0});callback(choice.response===1);});
 Menu.setApplicationMenu(Menu.buildFromTemplate([
 ...(process.platform==='darwin'?[{role:'appMenu'}]:[]),
 {label:'AltStack',submenu:[{label:'Mail',click:()=>open('/mail')},{label:'Calendar',click:()=>open('/calendar')},{type:'separator'},{label:'AltStack desktop',click:()=>external(config.platformOrigin)},{label:'Warehouse',click:()=>external(config.warehouseOrigin)},{type:'separator'},{role:'quit'}]},
 {role:'editMenu'},{label:'View',submenu:[{role:'reload'},{role:'resetZoom'},{role:'zoomIn'},{role:'zoomOut'},{role:'togglefullscreen'}]},
 {label:'Help',submenu:[{label:'Downloads and updates',click:()=>external(config.platformOrigin+'/downloads/mail')},{label:'Source and licenses',click:()=>external('https://github.com/danecohn/AltStackMail')},{label:'About AltStack Mail',click:()=>dialog.showMessageBox(window,{type:'info',message:'AltStack Mail & Calendar',detail:'An independent Artemis Softworks LLC distribution of the Tuta GPLv3 browser client. Your Tuta account hosts and encrypts your mailbox and calendar. Your AltStack account connects the AltStack portal.'})}]}
 ]));
 if(process.argv.includes('--smoke-test')){await window.loadFile(join(here,'offline.html'));await new Promise(resolve=>setTimeout(resolve,1200));const image=await window.webContents.capturePage();const {writeFileSync}=await import('node:fs');writeFileSync(process.argv[process.argv.indexOf('--smoke-test')+1],image.toPNG());app.quit();return;}
 await open(process.argv.includes('--calendar')?'/calendar':'/mail');
}
if(!app.requestSingleInstanceLock())app.quit();else{app.on('second-instance',()=>{if(window){window.show();window.focus();}});app.whenReady().then(createWindow).catch(error=>{console.error('Mail desktop startup failed:',error.message);app.exit(1);});app.on('window-all-closed',()=>{if(process.platform!=='darwin')app.quit();});app.on('activate',()=>{if(BrowserWindow.getAllWindows().length===0)createWindow();});}
