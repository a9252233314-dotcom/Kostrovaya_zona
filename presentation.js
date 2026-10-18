'use strict';
const assemblySteps = [
  {title:'Размечаем основание',copy:'Четыре опоры образуют квадрат 3000 × 3000 мм по осям. Основание и его крепёж подбираются под площадку: бетон, сваи или разработанное грунтовое решение.',link:'base-assembly.html'},
  {title:'Устанавливаем четыре стойки',copy:'Стойки 40 × 40 × 2 надеваются на вставки опор 35 × 35 × 2. Крепления фиксируют детали; временные связи удерживают геометрию до завершения каркаса.',link:'base-assembly.html'},
  {title:'Соединяем верхний квадрат',copy:'Четыре перекладины соединяются через сварные угловые узлы. Обвязку предварительно собирают с учётом встречных вставок; способ подъёма и поддержки задаст монтажная инструкция.',link:'corner-assembly.html'},
  {title:'Добавляем нижние перекладины и раскосы',copy:'Нижняя обвязка проходит по трём сторонам. Вход остаётся без порога. Раскосы показаны в верхних углах; их положение проверяем по ширине и высоте свободного прохода.',link:'base-assembly.html'},
  {title:'Собираем двускатную крышу',copy:'Две пары наклонных элементов образуют скаты 45°. У карниза рассматриваем покупные уголки, в коньке — парные накладки. Продольная труба, прогоны и связи объединяют крышу.',link:'roof-assembly.html'},
  {title:'Монтируем покрытие',copy:'Оцинкованные листы закрывают скаты, коньковая планка — верхний стык. Шаг опор, нахлёсты и крепёж ещё определяем. Очаг и оснащение устанавливаются после проверки совместимости.',link:'roof-assembly.html'}
];
let activeAssemblyStep=0;
function renderAssembly(step){
  activeAssemblyStep=step;
  document.querySelectorAll('[data-step]').forEach(button=>{const selected=Number(button.dataset.step)===step;button.classList.toggle('active',selected);button.setAttribute('aria-pressed',String(selected))});
  document.getElementById('assembly-number').textContent='ЭТАП '+String(step+1).padStart(2,'0')+' / 06';
  document.getElementById('step-title').textContent=assemblySteps[step].title;
  document.getElementById('step-copy').textContent=assemblySteps[step].copy;
  document.getElementById('step-link').href=assemblySteps[step].link;
  document.getElementById('next-step').textContent=step===5?'Сначала ↺':'Следующий этап →';
  const svg=document.getElementById('assembly-diagram'),ns='http://www.w3.org/2000/svg';svg.replaceChildren();
  function element(tag,attrs){const e=document.createElementNS(ns,tag);Object.entries(attrs).forEach(([key,value])=>e.setAttribute(key,value));svg.appendChild(e);return e}
  const title=element('title',{id:'assembly-svg-title'});title.textContent=assemblySteps[step].title;
  function p(x,y,z){return [360+(x-y)*.067,286+(x+y)*.031-z*.069]}
  function line(a,b,color,width=5,dash=''){const u=p(...a),v=p(...b);element('line',{x1:u[0],y1:u[1],x2:v[0],y2:v[1],stroke:color,'stroke-width':width,'stroke-linecap':'round','stroke-dasharray':dash})}
  function poly(points,color,opacity=1){element('polygon',{points:points.map(v=>p(...v).join(',')).join(' '),fill:color,opacity})}
  function text(x,y,value,size=15){const t=element('text',{x,y,fill:'#6c736c','font-family':'Arial,sans-serif','font-size':size});t.textContent=value}
  const normal='#7b8980',newColor='#bd4b2b',height=2300;
  poly([[-200,-200,0],[3200,-200,0],[3200,3200,0],[-200,3200,0]],'#e4e7df');
  if(step===5){poly([[-300,-300,2000],[1500,-300,3800],[1500,3300,3800],[-300,3300,2000]],'#d1d8cf');poly([[1500,-300,3800],[3300,-300,2000],[3300,3300,2000],[1500,3300,3800]],'#bcc8bd')}
  for(const x of [0,3000])for(const y of [0,3000]){poly([[x-90,y-90,8],[x+90,y-90,8],[x+90,y+90,8],[x-90,y+90,8]],step===0?newColor:normal);if(step>=1)line([x,y,10],[x,y,height],step===1?newColor:normal,5)}
  if(step===0){for(const x of [0,3000])line([x,0,0],[x,3000,0],'#a6b0a3',1,'5 5');for(const y of [0,3000])line([0,y,0],[3000,y,0],'#a6b0a3',1,'5 5');text(400,469,'3000 мм');text(180,469,'3000 мм')}
  if(step>=2){for(const x of [0,3000])line([x,0,height],[x,3000,height],step===2?newColor:normal);for(const y of [0,3000])line([0,y,height],[3000,y,height],step===2?newColor:normal);for(const x of [0,3000])for(const y of [0,3000]){const v=p(x,y,height);element('circle',{cx:v[0],cy:v[1],r:5,fill:step===2?newColor:normal})}}
  if(step>=3){const color=step===3?newColor:normal;for(const x of [0,3000])line([x,0,350],[x,3000,350],color);line([0,0,350],[3000,0,350],color);for(const x of [0,3000])for(const y of [0,3000]){line([x,y,height-430],[x+(x?-430:430),y,height],color,3);line([x,y,height-430],[x,y+(y?-430:430),height],color,3)}}
  if(step>=4){const color=step===4?newColor:normal;for(const y of [0,3000]){line([-300,y,2000],[1500,y,3800],color,4);line([1500,y,3800],[3300,y,2000],color,4)}for(const x of [-300,600,1500,2400,3300])line([x,-300,3800-Math.abs(x-1500)],[x,3300,3800-Math.abs(x-1500)],color,3)}
  if(step===5)line([1500,-300,3820],[1500,3300,3820],newColor,5);
  text(290,535,'ВХОД БЕЗ ПОРОГА',13);text(25,30,'НОВЫЕ ЭЛЕМЕНТЫ — ТЕРРАКОТОВЫМ',10);
}
document.querySelectorAll('[data-step]').forEach(button=>button.addEventListener('click',()=>renderAssembly(Number(button.dataset.step))));
document.getElementById('next-step').addEventListener('click',()=>renderAssembly((activeAssemblyStep+1)%6));
document.querySelectorAll('[data-filter]').forEach(button=>button.addEventListener('click',()=>{
  const filter=button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach(b=>{const selected=b===button;b.classList.toggle('active',selected);b.setAttribute('aria-pressed',String(selected))});
  document.querySelectorAll('tr[data-category]').forEach(row=>row.hidden=filter!=='all'&&row.dataset.category!==filter);
}));
document.getElementById('copy-link').addEventListener('click',async()=>{
  const status=document.getElementById('copy-status');
  const link='https://a9252233314-dotcom.github.io/Kostrovaya_zona/';
  try{await navigator.clipboard.writeText(link);status.textContent='Ссылка скопирована. Можно отправить партнёру.'}
  catch{status.textContent='Скопируйте ссылку из адресной строки: '+link}
});
document.getElementById('download-brief').addEventListener('click',()=>{
  const a=document.createElement('a');a.href='project-brief.txt';a.download='Костровая-зона-описание-проекта.txt';document.body.appendChild(a);a.click();a.remove();
});
window.addEventListener('beforeprint',()=>{if(typeof draw==='function')draw()});
window.addEventListener('afterprint',()=>{if(typeof draw==='function')draw()});
renderAssembly(0);
