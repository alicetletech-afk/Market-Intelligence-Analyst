const STORE_KEY=JamAPI.STORE_KEY;
const defaults={
 sources:[{name:'Autodesk Newsroom',category:'Official',value:'https://www.autodesk.com/blogs/',status:'active'},{name:'ZWCAD Blog',category:'Competitor',value:'https://www.zwsoft.com/news',status:'active'}],
 competitors:[{name:'Autodesk',category:'CAD/BIM',value:'Pricing, AI, product updates',status:'active'},{name:'ZWCAD',category:'CAD',value:'Promotion, pricing, campaigns',status:'active'}],
 keywords:[{name:'AI CAD',category:'Trend',value:'AI assistant, smart automation',status:'active'},{name:'Price Increase',category:'Pricing',value:'price update, subscription increase',status:'active'}],
 prompts:{
  morningPrompt:'ค้นข่าวล่าสุดจากเว็บจริงตาม Sources และ Competitors ที่กำหนด คัดเฉพาะเรื่องที่มีผลต่อ CAD, BIM และ B2B Marketing สรุปเป็น Executive Summary, What Matters Today และ Suggested Actions',
  alertPrompt:'ตรวจข่าวใหม่และแจ้งเฉพาะเรื่อง High Impact เช่น การขึ้นราคา ลดราคา เปิดตัวสินค้าใหม่ หรือการเปลี่ยนแปลงที่กระทบตลาดไทย',
  researchPrompt:'Prepared by Jam\\n\\nResearch Topic: {{topic}}\\n\\nค้นเว็บจริง วิเคราะห์ผลกระทบต่อตลาด CAD/BIM ไทย เปรียบเทียบคู่แข่ง และเสนอ Marketing Actions พร้อมแหล่งอ้างอิง',
  actionPrompt:'จากข่าวทั้งหมด สรุปสิ่งที่ทีมการตลาดควรทำต่อ แบ่งเป็น High, Medium และ Low Priority'
 },
 schedules:{briefTime:'08:00',monitorEnd:'18:00',alertThreshold:'high',sendJen:'yes'},
 settings:{workspaceName:'Jam Market Intelligence',analystName:'Jam',appsScriptUrl:'',workspaceUrl:'https://marketing.alicetletech.com/jam',lineEnabled:'yes',themeSetting:'system'},
 history:[{date:'2026-07-15 08:05',type:'Morning Brief',summary:'3 important updates',status:'Sent to Jen'},{date:'2026-07-15 11:42',type:'Breaking Alert',summary:'AutoCAD pricing update',status:'Delivered'}]
};
let data=loadData(),editorState={type:null,index:null};
function cloneDefaults(){return JSON.parse(JSON.stringify(defaults))}
function loadData(){try{const s=JSON.parse(localStorage.getItem(STORE_KEY));if(!s)return cloneDefaults();return {...cloneDefaults(),...s,prompts:{...defaults.prompts,...s.prompts},schedules:{...defaults.schedules,...s.schedules},settings:{...defaults.settings,...s.settings}}}catch(e){return cloneDefaults()}}
function saveData(msg='Saved'){localStorage.setItem(STORE_KEY,JSON.stringify(data));renderAll();showToast(msg)}
function showToast(msg){toast.textContent=msg;toast.classList.add('show');clearTimeout(window.__t);window.__t=setTimeout(()=>toast.classList.remove('show'),2200)}
function switchPanel(name){document.querySelectorAll('.panel').forEach(p=>p.classList.remove('active'));document.querySelectorAll('.nav button').forEach(b=>b.classList.toggle('active',b.dataset.panel===name));document.getElementById('panel-'+name).classList.add('active');pageTitle.textContent=name.charAt(0).toUpperCase()+name.slice(1)}
document.querySelectorAll('.nav button').forEach(b=>b.onclick=()=>switchPanel(b.dataset.panel));document.querySelectorAll('[data-jump]').forEach(b=>b.onclick=()=>switchPanel(b.dataset.jump));
function esc(v){return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]))}
function renderList(type,id){const el=document.getElementById(id);el.innerHTML='';data[type].forEach((it,i)=>{const r=document.createElement('div');r.className='row';r.innerHTML=`<div><div class="row-title">${esc(it.name)} <span class="badge ${it.status==='active'?'green':'amber'}">${it.status}</span></div><div class="row-meta">${esc(it.category)}${it.value?' · '+esc(it.value):''}</div></div><div class="row-actions"><button class="icon-btn edit-item" data-type="${type}" data-index="${i}">Edit</button><button class="icon-btn delete-item" data-type="${type}" data-index="${i}">Delete</button></div>`;el.appendChild(r)})}
function renderAll(){
 renderList('sources','sourcesList');renderList('competitors','competitorsList');renderList('keywords','keywordsList');statSources.textContent=data.sources.length;statCompetitors.textContent=data.competitors.length;
 morningPrompt.value=data.prompts.morningPrompt;alertPrompt.value=data.prompts.alertPrompt;researchPrompt.value=data.prompts.researchPrompt;actionPrompt.value=data.prompts.actionPrompt;
 Object.entries(data.schedules).forEach(([k,v])=>{const e=document.getElementById(k);if(e)e.value=v});Object.entries(data.settings).forEach(([k,v])=>{const e=document.getElementById(k);if(e)e.value=v});
 historyBody.innerHTML=data.history.map(h=>`<tr><td>${esc(h.date)}</td><td>${esc(h.type)}</td><td>${esc(h.summary)}</td><td>${esc(h.status)}</td></tr>`).join('');
}
function openEditor(type,index=null){editorState={type,index};modalTitle.textContent=(index===null?'Add ':'Edit ')+({sources:'Source',competitors:'Competitor',keywords:'Keyword'}[type]);const it=index===null?{name:'',category:'',value:'',status:'active'}:data[type][index];itemName.value=it.name;itemCategory.value=it.category;itemValue.value=it.value;itemStatus.value=it.status;editorModal.classList.add('show')}
function closeEditor(){editorModal.classList.remove('show')}
document.querySelectorAll('.add-btn').forEach(b=>b.onclick=()=>openEditor(b.dataset.type));
document.addEventListener('click',e=>{const ed=e.target.closest('.edit-item');if(ed)openEditor(ed.dataset.type,Number(ed.dataset.index));const del=e.target.closest('.delete-item');if(del&&confirm('Delete this item?')){data[del.dataset.type].splice(Number(del.dataset.index),1);saveData('Item deleted')}});
saveItemBtn.onclick=()=>{const it={name:itemName.value.trim(),category:itemCategory.value.trim(),value:itemValue.value.trim(),status:itemStatus.value};if(!it.name){showToast('กรุณากรอกชื่อ');return}if(editorState.index===null)data[editorState.type].push(it);else data[editorState.type][editorState.index]=it;closeEditor();saveData('Item saved')};
closeModal.onclick=cancelModal.onclick=closeEditor;editorModal.onclick=e=>{if(e.target===editorModal)closeEditor()};
document.querySelectorAll('.save-prompt').forEach(b=>b.onclick=()=>{data.prompts[b.dataset.key]=document.getElementById(b.dataset.key).value;saveData('Prompt saved')});
saveScheduleBtn.onclick=()=>{data.schedules={briefTime:briefTime.value,monitorEnd:monitorEnd.value,alertThreshold:alertThreshold.value,sendJen:sendJen.value};saveData('Schedule saved')};
saveSettingsBtn.onclick=()=>{data.settings={workspaceName:workspaceName.value,analystName:analystName.value,appsScriptUrl:appsScriptUrl.value,workspaceUrl:workspaceUrl.value,lineEnabled:lineEnabled.value,themeSetting:themeSetting.value};saveData('Settings saved')};
clearHistoryBtn.onclick=()=>{if(confirm('Clear all history?')){data.history=[];saveData('History cleared')}};
saveAllBtn.onclick=()=>saveData('All settings saved');
exportBtn.onclick=()=>{const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'}),u=URL.createObjectURL(blob),a=document.createElement('a');a.href=u;a.download='jam-admin-config.json';a.click();URL.revokeObjectURL(u)};
renderAll();
