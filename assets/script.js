(function(){
  const loader=document.getElementById('site-loader');
  if(loader){
    const started=performance.now();
    const minimumVisible=3300;
    const release=()=>{
      const wait=Math.max(0,minimumVisible-(performance.now()-started));
      setTimeout(()=>{
        loader.classList.add('is-leaving');
        document.body.classList.remove('is-loading');
        setTimeout(()=>loader.remove(),700);
      },wait);
    };
    if(document.readyState==='complete')release();
    else window.addEventListener('load',release,{once:true});
  }

  const header=document.querySelector('.site-header');
  const updateHeader=()=>header&&header.classList.toggle('scrolled',window.scrollY>18);
  updateHeader();
  window.addEventListener('scroll',updateHeader,{passive:true});

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
      links.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.textContent='☰';
      document.body.classList.remove('nav-open');
    }));
    window.addEventListener('resize',()=>{
      if(window.innerWidth>920){
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded','false');
        toggle.textContent='☰';
      }
    });
  }

  const io='IntersectionObserver' in window?new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  },{threshold:.12,rootMargin:'0px 0px -30px 0px'}):null;
  document.querySelectorAll('.reveal').forEach((el,i)=>{
    if(!el.style.getPropertyValue('--delay'))el.style.setProperty('--delay',Math.min((i%4)*70,210)+'ms');
    io?io.observe(el):el.classList.add('in');
  });

  document.querySelectorAll('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());

  /* Consistent phone icon wherever a telephone action appears */
  document.querySelectorAll('a[href^="tel:"]:not(.floating-call)').forEach(a=>{
    if(!a.querySelector('.phone-icon')){
      const icon=document.createElement('span');
      icon.className='phone-icon';
      icon.setAttribute('aria-hidden','true');
      icon.textContent='☎';
      a.prepend(icon);
    }
  });

  const flipCopy={
    'Respite Care':'Protected respite time can help caregivers rest, work, attend appointments or manage responsibilities while the child receives attentive support.',
    'In-Home Child Support':'Familiar surroundings can help preserve routines and reduce unnecessary disruption for the child.',
    'Evening & Weekend Support':'Flexible timing can make support more practical for families whose needs do not fit standard daytime hours.',
    'After-School Support':'A calm transition after school can support routine, play and meaningful engagement.',
    'School Break & Holiday Support':'Planned support during school closures can help families maintain continuity and structure.',
    'Play & Recreation':'Purposeful play can encourage enjoyment, confidence, creativity, social interaction and age-appropriate independence.',
    'Community Support':'Agreed community activities can create opportunities for participation, recreation and connection beyond the home.',
    'Individualized Support':'The care plan should reflect the child’s routines, strengths, interests, abilities and family expectations.',
    'Family Communication':'Clear updates keep parents and caregivers connected to the child’s experience and help care remain aligned over time.',
    'Compassion':'Kindness and patience help children feel heard, understood and emotionally safe.',
    'Safety':'Good care protects both physical well-being and emotional security.',
    'Respect':'Respect means recognizing each child, family, culture, ability and individual difference.',
    'Inclusion':'Belonging grows when children are welcomed, valued and able to participate meaningfully.',
    'Integrity':'Dependability, honesty and professional responsibility help families know what to expect.',
    'Dignity':'Dignity means seeing strengths, preferences, choices and individuality before limitations.',
    'Partnership':'Consistent care is stronger when families and caregivers are active partners in planning and communication.',
    'Scheduled Care':'Advance scheduling helps Tender Care plan responsibly around staff availability and family needs.',
    '24-Hour Notice':'Giving notice whenever possible helps protect availability and keeps expectations fair and clear.',
    'Late Cancellation':'The family service agreement should make any late-cancellation fee clear before care begins.',
    'Emergency Cancellation':'Emergencies are considered individually so compassion and practical flexibility can both be maintained.',
    'Late Arrival':'A quick update helps everyone coordinate pickup or handover safely and respectfully.',
    'Schedule Changes':'Additional hours or changed times only become part of the booking once Tender Care confirms availability.',
    'Call Tender Care':'A direct conversation is the fastest way to discuss services, availability and family-specific questions.',
    'Edmonton Address':'Tender Care Respite Services is listed at 12245 95 St, Edmonton, Alberta.',
    'Directions':'Use the map link for navigation and confirm any planned care arrangement before travelling.'
  };

  const candidates=document.querySelectorAll('.service-tile,.audience-card,.service-card,.value-card,.policy-card,.principle,.contact-card');
  candidates.forEach(card=>{
    if(card.querySelector('.card-reveal'))return;
    const heading=card.querySelector('h3,h4,b');
    const paragraph=card.querySelector('p');
    if(!heading||!paragraph)return;
    const title=heading.textContent.trim();
    const detail=flipCopy[title]||paragraph.textContent.trim();
    card.classList.add('interactive-card');
    card.tabIndex=0;
    card.setAttribute('role','button');
    card.setAttribute('aria-expanded','false');

    const hint=document.createElement('span');
    hint.className='flip-hint';
    hint.textContent=window.matchMedia('(hover:none)').matches?'Tap to explore':'Hover to explore';
    card.appendChild(hint);

    const reveal=document.createElement('div');
    reveal.className='card-reveal';
    reveal.setAttribute('aria-hidden','true');
    reveal.innerHTML='<span class="card-reveal-label">Why it matters</span><h4></h4><p></p>';
    reveal.querySelector('h4').textContent=title;
    reveal.querySelector('p').textContent=detail;
    card.appendChild(reveal);

    const toggleCard=()=>{
      const open=card.classList.toggle('is-flipped');
      card.setAttribute('aria-expanded',String(open));
      reveal.setAttribute('aria-hidden',String(!open));
    };
    card.addEventListener('click',e=>{
      if(e.target.closest('a,button,input,textarea,select,summary'))return;
      if(window.matchMedia('(hover:none)').matches)toggleCard();
    });
    card.addEventListener('keydown',e=>{
      if(e.key==='Enter'||e.key===' '){
        e.preventDefault();
        toggleCard();
      }
    });
    card.addEventListener('mouseleave',()=>{
      if(!window.matchMedia('(hover:none)').matches){
        card.classList.remove('is-flipped');
        card.setAttribute('aria-expanded','false');
        reveal.setAttribute('aria-hidden','true');
      }
    });
  });

  const back=document.querySelector('.back-top');
  if(back){
    const state=()=>back.classList.toggle('show',window.scrollY>650);
    state();
    window.addEventListener('scroll',state,{passive:true});
    back.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
  }

  const intake=document.querySelector('#intake-form');
  if(intake){
    const status=document.querySelector('#form-status');
    document.querySelector('#print-intake')?.addEventListener('click',()=>window.print());
    document.querySelector('#clear-intake')?.addEventListener('click',()=>{
      if(confirm('Clear all information entered in this form?')){
        intake.reset();
        if(status)status.style.display='none';
      }
    });
    document.querySelector('#copy-intake')?.addEventListener('click',async()=>{
      const data=new FormData(intake),labels={};
      intake.querySelectorAll('[name]').forEach(field=>{
        const label=intake.querySelector(`label[for="${field.id}"]`);
        labels[field.name]=label?label.textContent.trim():field.name;
      });
      const lines=['TENDER CARE RESPITE SERVICES — FAMILY INTAKE INFORMATION',''];
      for(const [key,value] of data.entries()){
        if(String(value).trim())lines.push(`${labels[key]||key}: ${String(value).trim()}`);
      }
      lines.push('','Parent/Guardian signature: ____________________',`Date: ${new Date().toLocaleDateString()}`);
      try{
        await navigator.clipboard.writeText(lines.join('\n'));
        if(status){
          status.textContent='Intake summary copied. Contact Tender Care to arrange a secure way to provide it.';
          status.style.display='block';
        }
      }catch(e){
        alert('Copy was not available in this browser. You can use Print / Save PDF instead.');
      }
    });
  }
})();