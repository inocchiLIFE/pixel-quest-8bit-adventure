export const TILE=18,W=384,H=216;
export const WORLDS=['GREEN MEADOW','MOONLIT RUINS','CORAL COAST','SKY GARDEN','FROZEN PEAKS','EMBER VALLEY','STAR ROAD','LAST CITADEL'];
export const overlap=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
export function createLevel(index,bonus=false){
 const world=Math.floor(index/4),course=index%4;const type=bonus?'bonus':course===3?'castle':course===1?(world===2||world===6?'water':'underground'):course===2?'sky':'overworld';
 const cols=bonus?52:174+world*7+course*6,rows=12,map=Array.from({length:rows},()=>Array(cols).fill(null));
 const enemies=[],coins=[],platforms=[],decor=[],length=cols*TILE,exit=(cols-12)*TILE;
 const put=(x,y,type,content=null)=>{if(x>=0&&x<cols&&y>=0&&y<rows)map[y][x]={type,content,bump:0};};
 const floor=(a,b,y=10)=>{for(let x=a;x<b;x++)for(let r=y;r<12;r++)put(x,r,r===y?'ground':'dirt');};
 const block=(x,y,content='coin')=>put(x,y,'question',content);
 const pipe=(x,height=2,secret=false)=>{for(let r=10-height;r<10;r++)for(let dx=0;dx<2;dx++)put(x+dx,r,'pipe');decor.push({type:'pipe',x:x*TILE,y:(10-height)*TILE,h:height*TILE,w:36,secret});};
 const enemy=(x,type='walker',y=164)=>enemies.push({x:x*TILE,y,w:type==='boss'?40:14,h:type==='boss'?36:14,vx:type==='boss'?-.6:-.45-world*.035,vy:0,type,alive:true,age:0,hp:type==='boss'?5+world:1,baseY:y});
 floor(0,cols);
 if(bonus){for(let x=5;x<43;x+=2)for(let y=4;y<9;y+=2)coins.push({x:x*TILE+5,y:y*TILE+4,w:8,h:12,alive:true});for(let x=0;x<cols;x++)put(x,0,'stone');pipe(46,3,false);return {index,world,course,type,cols,map,enemies,coins,platforms,decor,length,exit,lever:null};}
 // A quiet opening teaches movement before the first obstacle.
 for(let x=14;x<19;x++)put(x,7,x%2?'brick':'question',x===16?'growth':'coin');block(17,3,'coin');
 enemy(24);pipe(29,2);block(36,6,'growth');pipe(41,3,true);
 if(type==='castle'){
  map.forEach((row,y)=>row.forEach((b,x)=>{if(b)b.type=y===10?'stone':'dirt';}));for(let x=0;x<cols;x++)put(x,0,'stone');
  for(let x=16;x<cols-32;x+=24){for(let xx=x;xx<x+5;xx++){put(xx,10,'lava');put(xx,11,'lava');}for(let xx=x+8;xx<x+12;xx++)put(xx,7,'stone');enemies.push({x:(x+3)*18,y:180,w:10,h:12,type:'lava',alive:true,age:x*.1,baseY:178,vx:0,vy:0});decor.push({type:'firebar',x:(x+10)*18+9,y:135,count:4+world%3,phase:x*.1});}
  const bx=cols-27;for(let x=bx;x<cols-9;x++){put(x,10,'bridge');put(x,11,'lava');}enemy(cols-21,'boss',144);block(9,7,'growth');block(47,5,'growth');
  decor.push({type:'lever',x:(cols-10)*18,y:154,w:16,h:26});
 }else if(type==='water'){
  for(let x=20;x<cols-22;x+=21){for(let dx=0;dx<3;dx++)for(let y=8-dx%2;y<10;y++)put(x+dx,y,'stone');enemy(x+9,'fish',95+(x%3)*18);for(let c=0;c<5;c++)coins.push({x:(x+4+c)*18,y:64,w:8,h:12,alive:true});}enemies.splice(0,1);
 }else{
  const sections=world+5;
  for(let s=0;s<sections;s++){
   const x=52+s*18,kind=(s+course+world)%5;if(x>cols-28)break;
   if(kind===0){const gap=2+Math.min(3,Math.floor(world/3)+course%2);for(let c=x;c<x+gap;c++){put(c,10,null);put(c,11,null);}for(let c=x-2;c<x+gap+3;c+=2)coins.push({x:c*18+5,y:112,w:8,h:12,alive:true});}
   if(kind===1){for(let c=0;c<5;c++)put(x+c,6,c===2?'question':'brick',c===2?(s%2?'star':'growth'):null);enemy(x+6,s%2?'shell':'walker');}
   if(kind===2){pipe(x,2+(s%2));if(world>1)enemies.push({x:x*18+11,y:144,w:14,h:20,type:'plant',alive:true,age:s,baseY:144-(s%2)*18,vx:0,vy:0});enemy(x+9,'shell');}
   if(kind===3){for(let k=0;k<4;k++)for(let y=10-k-1;y<10;y++)put(x+k,y,'stone');for(let k=0;k<3;k++)coins.push({x:(x+k+1)*18,y:72,w:8,h:12,alive:true});enemy(x+9,world>3?'fly':'walker',world>3?125:164);}
   if(kind===4){platforms.push({x:x*18,y:123,w:54,h:8,baseX:x*18,baseY:123,phase:s,vertical:s%2===0});for(let c=x;c<x+4;c++){put(c,10,null);put(c,11,null);}block(x+5,6,s%3===0?'life':'coin');enemy(x+10,'walker');}
  }
  if(type==='sky'){for(let x=58;x<cols-26;x+=32){for(let dx=0;dx<7;dx++){put(x+dx,10,null);put(x+dx,11,null);put(x+dx,8,'platform');}platforms.push({x:(x+8)*18,y:136,w:54,h:8,baseX:(x+8)*18,baseY:136,phase:x,vertical:false});}}
  if(type==='underground'){for(let x=0;x<cols-20;x++)put(x,0,'stone');for(let x=7;x<20;x++)put(x,2,'brick');for(let x=62;x<cols-25;x+=33)for(let c=0;c<7;c++)coins.push({x:(x+c)*18+5,y:78,w:8,h:12,alive:true});}
  for(let k=0;k<7;k++)for(let y=9-k;y<10;y++)put(cols-25+k,y,'stone');
 }
 for(let x=8;x<cols-18;x+=23)decor.push({type:'tree',x:x*18,y:162});
 return {index,world,course,type,cols,map,enemies,coins,platforms,decor,length,exit,lever:type==='castle'?(cols-10)*18:null};
}
export class Engine{
 constructor(){this.events=[];this.state='title';this.index=0;this.score=0;this.coins=0;this.lives=3;this.checkpoint=0;this.phase=0;this.load(0);this.state='title';}
 emit(type,data={}){this.events.push({type,...data});}
 load(index,bonus=false,spawnX=36){this.index=clamp(index,0,31);this.level=createLevel(this.index,bonus);this.time=bonus?120:400;this.camera=0;this.player={x:spawnX,y:140,w:14,h:16,vx:0,vy:0,facing:1,power:0,invincible:0,star:0,grounded:false,coyote:0,jumpBuffer:0,fireCooldown:0};this.items=[];this.shots=[];this.particles=[];this.tick=0;this.phase=0;this.prev={};this.state='playing';this.emit('level',{index:this.index});}
 start(index=0){this.events=[];this.score=0;this.coins=0;this.lives=3;this.checkpoint=0;this.returnX=null;this.load(index);}
 resume(index){this.start(index);}
 solid(b){return b&&b.type&&b.type!=='lava';}
 tile(x,y){return this.level.map[y]?.[x]||null;}
 addScore(n,x=this.player.x,y=this.player.y){this.score+=n;this.particles.push({x,y,text:String(n),life:60});}
 coin(x,y){this.coins++;this.addScore(200,x,y);this.emit('coin');if(this.coins>=100){this.coins-=100;this.lives++;this.emit('life');}}
 power(kind){const p=this.player;if(kind==='star'){p.star=600;this.emit('star');}else if(kind==='life'){this.lives++;this.emit('life');}else{if(p.power===0){p.power=1;p.y-=10;p.h=26;}else p.power=2;this.emit('power');}this.addScore(1000);}
 hitBlock(x,y){const b=this.tile(x,y);if(!this.solid(b))return;b.bump=8;if(b.type==='question'){const kind=b.content||'coin';b.type='used';if(kind==='coin'){this.coin(x*18,y*18);this.particles.push({x:x*18+9,y:y*18,text:'★',life:36});}else{this.items.push({x:x*18+2,y:y*18-16,w:14,h:14,vx:kind==='growth'&&this.player.power>0?0:.75,vy:0,kind:kind==='growth'&&this.player.power>0?'fire':kind,alive:true});this.emit('bump');}}else if(b.type==='brick'){if(this.player.power>0){this.level.map[y][x]=null;this.addScore(50,x*18,y*18);for(let i=0;i<4;i++)this.particles.push({x:x*18+9,y:y*18+9,vx:(i%2?1:-1)*1.5,vy:-3-i*.5,life:30,color:'#d98759'});this.emit('break');}else this.emit('bump');}}
 moveBody(b,hit=false){
  b.grounded=false;let bumped=false;b.x+=b.vx;let x0=Math.floor(b.x/18),x1=Math.floor((b.x+b.w-.01)/18),y0=Math.floor((b.y+.5)/18),y1=Math.floor((b.y+b.h-.5)/18);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(this.solid(this.tile(x,y))){if(b.vx>0)b.x=x*18-b.w;else if(b.vx<0)b.x=(x+1)*18;b.vx=0;bumped=true;}
  const oldBottom=b.y+b.h;b.y+=b.vy;x0=Math.floor((b.x+.5)/18);x1=Math.floor((b.x+b.w-.5)/18);y0=Math.floor(b.y/18);y1=Math.floor((b.y+b.h-.01)/18);
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)if(this.solid(this.tile(x,y))){if(b.vy>0){b.y=y*18-b.h;b.grounded=true;}else if(b.vy<0){b.y=(y+1)*18;if(hit)this.hitBlock(x,y);}b.vy=0;}
  if(b.vy>=0)for(const platform of this.level.platforms){if(b.x+b.w>platform.x&&b.x<platform.x+platform.w&&oldBottom<=platform.y+2&&b.y+b.h>=platform.y){b.y=platform.y-b.h;b.vy=0;b.grounded=true;b.x+=platform.dx||0;}}
  b.x=Math.max(0,b.x);return bumped;
 }
 damage(){const p=this.player;if(p.invincible>0||p.star>0||this.state!=='playing')return;if(p.power>0){p.power=0;p.y+=10;p.h=16;p.invincible=120;this.emit('hurt');}else this.die();}
 die(){if(this.state!=='playing')return;this.state='dying';this.phase=0;this.player.vy=-5;this.player.vx=0;this.lives--;this.emit('death');}
 clear(){if(this.state!=='playing')return;this.state='clear';this.phase=0;this.player.invincible=9999;this.addScore(this.level.type==='castle'?2000:Math.max(100,Math.floor((180-this.player.y)/18)*500));this.emit('clear');}
 enterBonus(){const p=this.player;this.returnX=p.x+48;const power=p.power;this.load(this.index,true);if(power){this.player.power=power;this.player.h=26;this.player.y-=10;}this.emit('warp');}
 leaveBonus(){const power=this.player.power,x=this.returnX||42*18+50;this.load(this.index,false,x);this.player.power=power;if(power){this.player.h=26;this.player.y-=10;}this.checkpoint=x;this.returnX=null;this.emit('warp');}
 step(input={}){
  this.tick++;const p=this.player;
  if(this.state==='dying'){this.phase++;if(this.phase>15){p.vy+=.24;p.y+=p.vy;}if(this.phase>100){if(this.lives>0){const ix=this.index,checkpoint=this.level.type==='bonus'?0:this.checkpoint;this.load(ix,false,checkpoint||36);}else{this.state='gameover';this.emit('gameover');}}return;}
  if(this.state==='clear'){this.phase++;if(this.phase<60){p.x+=.65;p.y=Math.min(180-p.h,p.y+2);}else if(this.time>0){const bonus=Math.min(this.time,9);this.time-=bonus;this.score+=Math.floor(bonus*50);}else if(this.phase>125){if(this.index===31){this.state='won';this.emit('won');}else{const power=p.power;this.checkpoint=0;this.load(this.index+1);if(power){this.player.power=power;this.player.y-=10;this.player.h=26;}this.emit('progress',{index:this.index});}}return;}
  if(this.state!=='playing')return;
  this.time-=1/60;if(this.time<=0){this.time=0;this.die();return;}if(p.invincible>0)p.invincible--;if(p.star>0)p.star--;if(p.fireCooldown>0)p.fireCooldown--;
  const water=this.level.type==='water';const pressJump=input.jump&&!this.prev.jump,pressRun=input.run&&!this.prev.run;
  if(pressJump)p.jumpBuffer=7;else p.jumpBuffer=Math.max(0,p.jumpBuffer-1);
  p.coyote=p.grounded?6:Math.max(0,p.coyote-1);
  const accel=water?.075:.14,maxSpeed=water?1.65:input.run?2.65:1.65,dir=(input.right?1:0)-(input.left?1:0);
  if(dir){p.vx=clamp(p.vx+dir*accel,-maxSpeed,maxSpeed);p.facing=dir;}else{p.vx*=water?.94:.81;if(Math.abs(p.vx)<.04)p.vx=0;}
  if(input.down&&p.grounded)p.vx*=.82;
  if(p.jumpBuffer>0&&(p.coyote>0||water)){p.vy=water?-2.5:-5.65-Math.min(.65,Math.abs(p.vx)*.22);p.grounded=false;p.coyote=0;p.jumpBuffer=0;this.emit('jump');}
  if(!input.jump&&this.prev.jump&&p.vy<-2.3&&!water)p.vy=-2.3;
  p.vy=Math.min(water?1.3:6.5,p.vy+(water?.06:.23));const oldBottom=p.y+p.h;this.moveBody(p,true);
  if(water&&p.y<20){p.y=20;p.vy=Math.max(0,p.vy);}
  if(p.x>this.level.length-18)p.x=this.level.length-18;
  if(p.y>H+25){this.die();return;}
  const below=this.tile(Math.floor((p.x+p.w/2)/18),Math.floor((p.y+p.h-1)/18));if(below?.type==='lava')this.die();
  if(p.power===2&&input.run&&p.fireCooldown===0&&(pressRun||this.tick%12===0)){this.shots.push({x:p.x+(p.facing>0?p.w:-6),y:p.y+10,w:6,h:6,vx:p.facing*3.5,vy:1,life:110,enemy:false});p.fireCooldown=18;this.emit('fire');}
  for(const row of this.level.map)for(const tile of row)if(tile?.bump>0)tile.bump--;
  for(const platform of this.level.platforms){const old=platform.x;const t=this.tick*.019+platform.phase;if(platform.vertical)platform.y=platform.baseY+Math.sin(t)*32;else platform.x=platform.baseX+Math.sin(t)*30;platform.dx=platform.x-old;}
  for(const c of this.level.coins)if(c.alive&&overlap(p,c)){c.alive=false;this.coin(c.x,c.y);}
  for(const item of this.items){if(!item.alive)continue;item.vy=Math.min(5,item.vy+.16);const old=item.vx;if(this.moveBody(item))item.vx=-old;if(item.grounded&&item.kind==='star')item.vy=-3.5;if(overlap(p,item)){item.alive=false;this.power(item.kind);}if(item.y>240)item.alive=false;}
  for(const e of this.level.enemies){
   if(!e.alive||e.x>p.x+W+120||e.x<p.x-W-120)continue;e.age++;
   if(e.type==='plant'){e.y=e.baseY+clamp(Math.sin(e.age*.025),-.5,1)*22;}
   else if(e.type==='fish'||e.type==='fly'){e.x+=e.vx;e.y=e.baseY+Math.sin(e.age*.045)*22;}
   else if(e.type==='lava'){e.y=e.baseY-Math.max(0,Math.sin(e.age*.038))*80;}
   else if(e.type==='boss'){e.x+=Math.sin(e.age*.018)*.6;if(e.age%100===0)e.vy=-4.5;e.vy=Math.min(5,e.vy+.2);this.moveBody(e);if(e.age%90===0)this.shots.push({x:e.x-10,y:e.y+12,w:12,h:7,vx:-2-worldDifficulty(this.index)*.08,vy:0,life:210,enemy:true});}
   else{e.vy=Math.min(6,e.vy+.23);const old=e.vx;if(this.moveBody(e))e.vx=-old;if(e.type==='shell'&&e.grounded){const ahead=this.tile(Math.floor((e.x+(e.vx>0?e.w+3:-3))/18),Math.floor((e.y+e.h+2)/18));if(!this.solid(ahead))e.vx=-e.vx;}}
   if(e.y>245){e.alive=false;continue;}
   if(e.type==='kicked'){for(const other of this.level.enemies)if(other!==e&&other.alive&&other.type!=='boss'&&overlap(e,other)){other.alive=false;this.addScore(400,other.x,other.y);this.emit('stomp');}}
   if(!overlap(p,e))continue;
   if(p.star>0){e.alive=false;this.addScore(200,e.x,e.y);this.emit('stomp');continue;}
   const canStomp=!water&&!['plant','boss','lava'].includes(e.type);
   if(canStomp&&p.vy>=0&&oldBottom<=e.y+8){p.y=e.y-p.h;p.vy=input.jump?-4.7:-3.4;this.addScore(100,e.x,e.y);this.emit('stomp');if(e.type==='shell'){e.type='idleShell';e.h=10;e.y+=4;e.vx=0;}else if(e.type==='kicked'){e.type='idleShell';e.vx=0;}else if(e.type==='idleShell'){e.type='kicked';e.vx=p.facing*4;e.x+=p.facing*12;p.invincible=Math.max(p.invincible,10);}else{e.alive=false;this.particles.push({x:e.x,y:e.y+7,text:'',life:20,color:'#e9c59c'});}}
   else if(e.type==='idleShell'){e.type='kicked';e.vx=(p.x<e.x?1:-1)*4;e.x+=Math.sign(e.vx)*13;p.invincible=Math.max(p.invincible,10);this.emit('kick');}else this.damage();
  }
  for(const shot of this.shots){shot.life--;shot.x+=shot.vx;if(!shot.enemy){shot.vy=Math.min(4,shot.vy+.2);const old=shot.vx;shot.x-=shot.vx;if(this.moveBody(shot)){shot.life=0;}if(shot.grounded)shot.vy=-2.8;shot.vx=old;}else shot.y+=shot.vy;
   if(shot.enemy){if(overlap(p,shot))this.damage();}else{for(const e of this.level.enemies)if(e.alive&&overlap(shot,e)){e.hp--;if(e.hp<=0){e.alive=false;this.addScore(e.type==='boss'?2000:200,e.x,e.y);}shot.life=0;this.emit('stomp');break;}}}
  this.shots=this.shots.filter(s=>s.life>0&&s.y<240);
  for(const d of this.level.decor){if(d.type==='firebar'){const angle=this.tick*.025+d.phase;for(let i=1;i<=d.count;i++){const f={x:d.x+Math.cos(angle)*i*10-4,y:d.y+Math.sin(angle)*i*10-4,w:8,h:8};if(overlap(p,f))this.damage();}}if(d.type==='pipe'&&input.down&&p.grounded&&p.x+p.w/2>d.x&&p.x+p.w/2<d.x+d.w&&Math.abs(p.y+p.h-d.y)<3){if(this.level.type==='bonus'){this.leaveBonus();return;}else if(d.secret){this.enterBonus();return;}}}
  if(this.level.type==='bonus'&&p.x>this.level.exit-36){this.leaveBonus();return;}
  if(this.level.type==='castle'&&p.x+p.w>=this.level.lever){for(let x=this.level.cols-27;x<this.level.cols-9;x++)this.level.map[10][x]=null;for(const e of this.level.enemies)if(e.type==='boss')e.alive=false;this.clear();}
  else if(this.level.type!=='bonus'&&this.level.type!=='castle'&&p.x+p.w>=this.level.exit)this.clear();
  if(this.level.type!=='bonus'&&p.x>this.level.length*.5&&this.checkpoint===0&&p.grounded){this.checkpoint=p.x;this.emit('checkpoint');}
  this.camera=clamp(p.x-W*.38,0,this.level.length-W);this.prev={...input};
  this.particles=this.particles.filter(t=>{t.life--;t.y-=.4;if(t.vx){t.x+=t.vx;t.vy+=.2;t.y+=t.vy;}return t.life>0;});
 }
 snapshot(){return {state:this.state,world:Math.floor(this.index/4)+1,course:this.index%4+1,score:this.score,coins:this.coins,lives:this.lives,time:Math.ceil(this.time),power:this.player.power,area:this.level.type,progress:Math.floor(this.player.x/this.level.exit*100)};}
}
function worldDifficulty(index){return Math.floor(index/4);}
