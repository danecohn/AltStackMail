from pathlib import Path
import sys,hashlib,shutil
platform=sys.argv[1]
ext='exe' if platform.startswith('windows') else 'dmg' if platform.startswith('macos') else 'AppImage'
files=list(Path('release').glob('*.'+ext))
if len(files)!=1:raise SystemExit('Expected exactly one native '+ext+' installer, found '+str(files))
if files[0].stat().st_size<10_000_000:raise SystemExit('Installer is too small')
Path('artifacts').mkdir(exist_ok=True);target=Path('artifacts')/('AltStackMail-'+platform+'.'+ext);shutil.copy2(files[0],target)
Path(str(target)+'.sha256').write_text(hashlib.sha256(target.read_bytes()).hexdigest()+'  '+target.name+'\n')
