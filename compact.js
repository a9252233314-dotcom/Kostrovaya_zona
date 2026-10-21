'use strict';
const compactCanvas=document.getElementById('compact-scene'),compactContext=compactCanvas.getContext('2d');
let compactRise=1000,compactOverhang=0,compactYaw=.67,compactElevation=.40,compactZoom=1,compactDrag=null,compactFaces=[];
function compactMetrics(rise=compactRise,overhang=compactOverhang){const run=1200+overhang,slope=run*Math.hypot(1200,rise)/1200,length=2400+2*overhang;return {rise,angle:Math.atan2(rise,1200)*180/Math.PI,slope,area:2*slope*length/1e6}}
const compactAdd=(a,b)=>a.map((x,i)=>x+b[i]),compactScale=(a,s)=>a.map(x=>x*s),compactCross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],compactUnit=a=>compactScale(a,1/Math.hypot(...a));
function compactSolid(v,color){for(const f of [[0,1,2,3],[4,7,6,5],[0,4,5,1],[1,5,6,2],[2,6,7,3],[3,7,4,0]])compactFaces.push({points:f.map(i=>v[i]),color})}
function compactBeam(a,b,width,color){const u=compactUnit(b.map((x,i)=>x-a[i])),ref=Math.abs(u[2])>.95?[1,0,0]:[0,0,1],v=compactScale(compactUnit(compactCross(u,ref)),width/2),w=compactScale(compactUnit(compactCross(u,v)),width/2),vertices=[];for(const end of [a,b])for(const [i,j] of [[-1,-1],[1,-1],[1,1],[-1,1]])vertices.push(compactAdd(end,compactAdd(compactScale(v,i),compactScale(w,j))));compactSolid(vertices,color)}
function drawCompact(){
  const width=compactCanvas.clientWidth,height=compactCanvas.clientHeight,ratio=window.devicePixelRatio||1;
  if(compactCanvas.width!==Math.round(width*ratio)||compactCanvas.height!==Math.round(height*ratio)){compactCanvas.width=Math.round(width*ratio);compactCanvas.height=Math.round(height*ratio)}
  compactContext.setTransform(ratio,0,0,ratio,0,0);compactContext.clearRect(0,0,width,height);compactFaces=[];
  const project=p=>{const x=p[0]-1200,y=p[1]-1200,z=p[2]-1550,h=x*Math.sin(compactYaw)+y*Math.cos(compactYaw),scale=Math.min(width/5000,height/4200)*compactZoom;return [width/2+(x*Math.cos(compactYaw)-y*Math.sin(compactYaw))*scale,height/2+(h*Math.sin(compactElevation)-z*Math.cos(compactElevation))*scale,h*Math.cos(compactElevation)+z*Math.sin(compactElevation)]};
  compactFaces.push({points:[[-250,-250,-15],[2650,-250,-15],[2650,2650,-15],[-250,2650,-15]],color:'#d5dbcf'});
  const h=2200,s=compactOverhang,r=compactRise,roofEdge=h-s*r/1200;
  for(const x of [0,2400])for(const y of [0,2400])compactBeam([x,y,0],[x,y,h],40,'#465b4c');
  for(const z of [20,800,h]){for(const x of [0,2400])compactBeam([x,0,z],[x,2400,z],40,'#66765e');for(const y of [0,2400])compactBeam([0,y,z],[2400,y,z],40,y===2400&&z<h?'#af8c71':'#66765e')}
  for(const y of [0,2400]){compactBeam([-s,y,roofEdge],[1200,y,h+r],22,'#b77241');compactBeam([1200,y,h+r],[2400+s,y,roofEdge],22,'#b77241')}
  for(const x of [-s,600,1200,1800,2400+s]){const z=h+r-Math.abs(x-1200)*r/1200;compactBeam([x,-s,z],[x,2400+s,z],18,'#887793')}
  if(document.getElementById('compact-roof').checked){compactFaces.push({points:[[-s,-s,roofEdge+15],[1200,-s,h+r+15],[1200,2400+s,h+r+15],[-s,2400+s,roofEdge+15]],color:'#acb9a8'});compactFaces.push({points:[[1200,-s,h+r+15],[2400+s,-s,roofEdge+15],[2400+s,2400+s,roofEdge+15],[1200,2400+s,h+r+15]],color:'#c0c9b9'})}
  const faces=compactFaces.map(face=>({...face,screen:face.points.map(project)}));faces.sort((a,b)=>a.screen.reduce((sum,p)=>sum+p[2],0)/a.screen.length-b.screen.reduce((sum,p)=>sum+p[2],0)/b.screen.length);
  for(const face of faces){compactContext.beginPath();face.screen.forEach((p,i)=>i?compactContext.lineTo(p[0],p[1]):compactContext.moveTo(p[0],p[1]));compactContext.closePath();compactContext.fillStyle=face.color;compactContext.fill();compactContext.strokeStyle='rgba(37,54,35,.25)';compactContext.lineWidth=.65;compactContext.stroke()}
  compactContext.fillStyle='#68765e';compactContext.font=width<500?'10px Arial':'12px Arial';compactContext.textAlign='left';compactContext.fillText('2400 × 2400 · сечения и промежуточные опоры условные',15,24);compactContext.fillText('Замкнутые нижние линии — по эскизу; вход нужно уточнить',15,height-17);
  const metrics=compactMetrics();document.getElementById('metric-rise').textContent=metrics.rise+' мм';document.getElementById('metric-angle').textContent=metrics.angle.toFixed(1).replace('.',',')+'°';document.getElementById('metric-slope').textContent=Math.round(metrics.slope)+' мм';document.getElementById('metric-area').textContent=metrics.area.toFixed(2).replace('.',',')+' м²';
}
document.querySelectorAll('[data-rise]').forEach(button=>button.addEventListener('click',()=>{compactRise=Number(button.dataset.rise);document.querySelectorAll('[data-rise]').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});drawCompact()}));
document.getElementById('compact-overhang').addEventListener('change',event=>{compactOverhang=Number(event.target.value);drawCompact()});
document.getElementById('compact-roof').addEventListener('change',drawCompact);
document.querySelectorAll('[data-view]').forEach(button=>button.addEventListener('click',()=>{const view=button.dataset.view;compactYaw=view==='general'?.67:0;compactElevation=view==='top'?1.56:view==='front'?.05:.40;compactZoom=1;drawCompact()}));
compactCanvas.addEventListener('pointerdown',event=>{compactDrag=[event.clientX,event.clientY];compactCanvas.setPointerCapture(event.pointerId)});
compactCanvas.addEventListener('pointermove',event=>{if(!compactDrag)return;compactYaw-=(event.clientX-compactDrag[0])*.008;compactElevation=Math.max(-.1,Math.min(1.56,compactElevation+(event.clientY-compactDrag[1])*.006));compactDrag=[event.clientX,event.clientY];drawCompact()});
compactCanvas.addEventListener('pointerup',()=>compactDrag=null);compactCanvas.addEventListener('pointercancel',()=>compactDrag=null);
compactCanvas.addEventListener('wheel',event=>{event.preventDefault();compactZoom=Math.max(.5,Math.min(2.5,compactZoom*Math.exp(-event.deltaY*.001)));drawCompact()},{passive:false});
window.addEventListener('resize',drawCompact);window.addEventListener('beforeprint',drawCompact);window.addEventListener('afterprint',drawCompact);drawCompact();
