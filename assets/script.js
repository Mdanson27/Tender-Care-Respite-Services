(function(){
  const loader=document.getElementById('site-loader');
  if(loader){
    const first=!sessionStorage.getItem('tenderCareLoaded');
    const started=performance.now();
    const min=first?2350:700;
    const release=()=>{
      const wait=Math.max(0,min-(performance.now()-started));
      setTimeout(()=>{
        loader.classList.add('is-leaving');
        document.body.classList.remove('is-loading');
        sessionStorage.setItem('tenderCareLoaded','1');
        setTimeout(()=>loader.remove(),860);
      },wait);
    };
    if(document.readyState==='complete')release();else window.addEventListener('load',release,{once:true});
  }

  const header=document.querySelector('.site-header');
  const updateHeader=()=>header&&header.classList.toggle('scrolled',window.scrollY>18);
  updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});

  const toggle=document.querySelector('.nav-toggle');
  const links=document.querySelector('.nav-links');
  if(toggle&&links){
    toggle.addEventListener('click',()=>{
      const open=links.classList.toggle('open');
      toggle.setAttribute('aria-expanded',String(open));
      toggle.textContent=open?'✕':'☰';
      document.body.classList.toggle('nav-open',open);
    });
    links.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{
      links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';document.body.classList.remove('nav-open');
    }));
    window.addEventListener('resize',()=>{if(window.innerWidth>920){links.classList.remove('open');toggle.setAttribute('aria-expanded','false');toggle.textContent='☰';}});
  }

  const io='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}});
  },{threshold:.12,rootMargin:'0px 0px -30px 0px'}):null;
  document.querySelectorAll('.reveal').forEach((el,i)=>{
    if(!el.style.getPropertyValue('--delay'))el.style.setProperty('--delay',Math.min((i%4)*70,210)+'ms');
    io?io.observe(el):el.classList.add('in');
  });

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  const back=document.querySelector('.back-top');
  if(back){
    const state=()=>back.classList.toggle('show',window.scrollY>650);
    state();window.addEventListener('scroll',state,{passive:true});
    back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  const intake=document.querySelector('#intake-form');
  if(intake){
    const status=document.querySelector('#form-status');
    document.querySelector('#print-intake')?.addEventListener('click',()=>window.print());
    document.querySelector('#clear-intake')?.addEventListener('click',()=>{
      if(confirm('Clear all information entered in this form?')){intake.reset();if(status)status.style.display='none'}
    });
    document.querySelector('#copy-intake')?.addEventListener('click',async()=>{
      const data=new FormData(intake),labels={};
      intake.querySelectorAll('[name]').forEach(field=>{
        const label=intake.querySelector(`label[for="${field.id}"]`);
        labels[field.name]=label?label.textContent.trim():field.name;
      });
      const lines=['TENDER CARE RESPITE SERVICES — FAMILY INTAKE INFORMATION',''];
      for(const [key,value] of data.entries()){if(String(value).trim())lines.push(`${labels[key]||key}: ${String(value).trim()}`)}
      lines.push('','Parent/Guardian signature: ____________________',`Date: ${new Date().toLocaleDateString()}`);
      try{
        await navigator.clipboard.writeText(lines.join('\n'));
        if(status){status.textContent='Intake summary copied. Contact Tender Care to arrange a secure way to provide it.';status.style.display='block'}
      }catch(e){alert('Copy was not available in this browser. You can use Print / Save PDF instead.')}
    });
  }
})();