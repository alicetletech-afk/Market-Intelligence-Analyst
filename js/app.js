const body = document.body;
    const themeBtn = document.getElementById('themeBtn');
    const toast = document.getElementById('toast');
    const themeKey = 'jam-assistant-theme';

    function showToast(message){
      toast.textContent = message;
      toast.classList.add('show');
      clearTimeout(window.__toastTimer);
      window.__toastTimer = setTimeout(()=>toast.classList.remove('show'),2400);
    }

    function syncTheme(){
      const dark = body.classList.contains('dark');
      themeBtn.textContent = dark ? '☀️' : '🌙';
      localStorage.setItem(themeKey, dark ? 'dark' : 'light');
    }

    if(localStorage.getItem(themeKey)==='dark'){
      body.classList.add('dark');
    }
    syncTheme();

    themeBtn.addEventListener('click',()=>{
      body.classList.toggle('dark');
      syncTheme();
    });

    document.getElementById('refreshBtn').addEventListener('click',()=>{
      showToast('คุณแจมกำลังเช็กข่าวรอบใหม่ค่ะ');
    });

    document.getElementById('previewJenBtn').addEventListener('click',()=>{
      showToast('คุณเจน: วันนี้คุณแจมพบ 3 เรื่องสำคัญ และมี 2 Suggested Actions ค่ะ');
    });

    document.querySelectorAll('.save-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        btn.textContent='Saved ✓';
        btn.disabled=true;
        showToast('คุณแจมบันทึก Insight ไว้แล้วค่ะ');
      });
    });

    document.querySelectorAll('.source-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        showToast('เวอร์ชันจริงจะเปิดแหล่งข่าวต้นทาง');
      });
    });

    const researchModal = document.getElementById('researchModal');
    const modalTopicText = document.getElementById('modalTopicText');
    const openChatGPTBtn = document.getElementById('openChatGPTBtn');
    const modalCloseBtn = document.getElementById('modalCloseBtn');
    const modalCancelBtn = document.getElementById('modalCancelBtn');
    let currentResearchPrompt = '';

    function closeResearchModal(){
      researchModal.classList.remove('show');
      researchModal.setAttribute('aria-hidden','true');
    }

    function buildResearchPrompt(topic){
      return JamAPI.buildResearchPrompt(topic);
    }

    document.querySelectorAll('.research-btn').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const topic = btn.dataset.topic || 'Market Intelligence Research';
        currentResearchPrompt = buildResearchPrompt(topic);
        modalTopicText.textContent = topic;
        researchModal.classList.add('show');
        researchModal.setAttribute('aria-hidden','false');
      });
    });

    openChatGPTBtn.addEventListener('click',async()=>{
      try{
        await navigator.clipboard.writeText(currentResearchPrompt);
        showToast('คัดลอก Prompt ที่คุณแจมเตรียมไว้แล้วค่ะ');
      }catch(e){
        showToast('Prompt พร้อมใช้งานค่ะ');
      }

      window.open('https://chatgpt.com/','_blank','noopener,noreferrer');
      closeResearchModal();
    });

    modalCloseBtn.addEventListener('click',closeResearchModal);
    modalCancelBtn.addEventListener('click',closeResearchModal);

    researchModal.addEventListener('click',(event)=>{
      if(event.target === researchModal){
        closeResearchModal();
      }
    });

    document.addEventListener('keydown',(event)=>{
      if(event.key === 'Escape'){
        closeResearchModal();
      }
    });
