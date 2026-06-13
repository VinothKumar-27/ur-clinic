document.addEventListener('DOMContentLoaded', () => {
  
  /* ==========================================================================
     1. MOUSE FOLLOW GLOW EFFECT
     ========================================================================== */
  const glowCards = document.querySelectorAll('.glass-card, .stat-showcase-card, .calendly-mock, .solution-explain');
  
  glowCards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  /* ==========================================================================
     2. NAVBAR ON SCROLL EFFECT
     ========================================================================== */
  const navbar = document.querySelector('.navbar');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  /* ==========================================================================
     3. INTERSECTION OBSERVER FOR FADE-UP ANIMATIONS
     ========================================================================== */
  const fadeUpElements = document.querySelectorAll('.fade-up');
  
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');
        
        // Trigger specific animations when components become visible
        if (entry.target.classList.contains('stat-showcase-card')) {
          animateCircleCounter();
        }
        
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  });

  fadeUpElements.forEach(el => fadeObserver.observe(el));

  /* ==========================================================================
     4. HERO INSTAGRAM DM CHAT SIMULATION
     ========================================================================== */
 /* ==========================================================================
   HERO INSTAGRAM CONSULTATION CHAT
   ========================================================================== */

const heroChatContainer = document.getElementById('hero-chat-container');
const heroQuickReplies = document.getElementById('hero-quick-replies');
const heroChatInput = document.getElementById('hero-chat-input');
const heroSendBtn = document.getElementById('hero-send-btn');
const heroClearBtn = document.getElementById('hero-clear-btn');

let currentChatState = 0;
let selectedTreatment = '';
let selectedDate = '';

function addMessage(sender, text) {
  const bubble = document.createElement('div');
  bubble.className = `insta-bubble ${sender}`;
  bubble.innerHTML = text;

  heroChatContainer.appendChild(bubble);
  heroChatContainer.scrollTop = heroChatContainer.scrollHeight;
}

function aiReply(text, callback) {
  const typing = document.createElement('div');
  typing.className = 'insta-bubble ai typing';

  typing.innerHTML = `
    <div class="typing-indicator">
      <span></span>
      <span></span>
      <span></span>
    </div>
  `;

  heroChatContainer.appendChild(typing);

  setTimeout(() => {
    typing.remove();
    addMessage('ai', text);

    if (callback) callback();
  }, 1200);
}

function renderReplies() {
  heroQuickReplies.innerHTML = '';

  let options = [];

  if (currentChatState === 0) {
    options = [
      'Hi, I need a consultation ✨'
    ];
  }

  else if (currentChatState === 1) {
    options = [
      'Skin Treatment',
      'Hair PRP',
      'Botox'
    ];
  }

  else if (currentChatState === 2) {
    options = [
      'Tomorrow 11 AM',
      'Tomorrow 4 PM',
      'Friday 1 PM'
    ];
  }

  else if (currentChatState === 3) {
    options = [
      'Confirm Appointment ✅'
    ];
  }

  else if (currentChatState === 4) {
    options = [
      'Start New Chat 🔄'
    ];
  }

  options.forEach(option => {
    const btn = document.createElement('button');

    btn.className = 'insta-pill';
    btn.textContent = option;

    btn.addEventListener('click', () => {
      handleUserInput(option);
    });

    heroQuickReplies.appendChild(btn);
  });
}

function handleUserInput(input) {

  addMessage('user', input);

  if (currentChatState === 0) {

    currentChatState = 1;

    aiReply(`
      Hello 👋 <br><br>
      We'd love to help you with your consultation.  
      Which treatment are you interested in?
    `, renderReplies);

  }

  else if (currentChatState === 1) {

    selectedTreatment = input;
    currentChatState = 2;

    aiReply(`
      Great choice ✨ <br><br>
      We have these available slots for <b>${selectedTreatment}</b>.
      Please select a time.
    `, renderReplies);

  }

  else if (currentChatState === 2) {

    selectedDate = input;
    currentChatState = 3;

    aiReply(`
      Perfect 👍 <br><br>
      Your consultation for <b>${selectedTreatment}</b> is scheduled on:
      <br><br>
      <b>${selectedDate}</b>
    `, renderReplies);

  }

  else if (currentChatState === 3) {

    currentChatState = 4;

    aiReply(`
      🎉 Appointment Confirmed <br><br>

      ✅ Treatment: <b>${selectedTreatment}</b><br>
      ✅ Slot: <b>${selectedDate}</b><br><br>

      Our team will contact you shortly.  
      Thank you for choosing us ✨
    `, renderReplies);

  }

  else if (currentChatState === 4) {

    resetChat();

  }
}

function resetChat() {

  currentChatState = 0;

heroChatContainer.innerHTML = '';
heroQuickReplies.innerHTML = '';

// Default auto conversation
setTimeout(() => {
  addMessage('user', 'Hi, I need a consultation ✨');
}, 500);

setTimeout(() => {
  addMessage(
    'ai',
    `Hello 👋 <br><br>
    We'd love to help you with your consultation.
    Which treatment are you interested in?`
  );
}, 1800);

setTimeout(() => {
  addMessage('user', 'Skin Treatment');
}, 3500);

setTimeout(() => {
  addMessage(
    'ai',
    `Perfect ✨ <br><br>
    We have available slots tomorrow.
    Which timing works best for you?`
  );
}, 5000);

setTimeout(() => {
  addMessage('user', 'Tomorrow 4 PM');
}, 6800);

setTimeout(() => {
  addMessage(
    'ai',
    `Awesome 👍 <br><br>
    Your consultation has been scheduled for:
    <br><br>
    <b>Tomorrow at 4:00 PM</b>`
  );
}, 8500);

setTimeout(() => {

  const card = document.createElement('div');

  card.className = 'insta-booking-card';

  card.innerHTML = `
    <h5>Appointment Confirmed 🎉</h5>

    <div class="insta-booking-card-detail">
      <span>✅ Treatment: Skin Treatment</span>
    </div>

    <div class="insta-booking-card-detail">
      <span>✅ Time: Tomorrow 4 PM</span>
    </div>

    <div class="insta-booking-card-detail">
      <span>✅ Status: Confirmed</span>
    </div>
  `;

  heroChatContainer.appendChild(card);

  heroChatContainer.scrollTop =
    heroChatContainer.scrollHeight;

}, 10500);
}

heroSendBtn.addEventListener('click', () => {
  const text = heroChatInput.value.trim();

  if (!text) return;

  handleUserInput(text);

  heroChatInput.value = '';
});

heroChatInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {

    const text = heroChatInput.value.trim();

    if (!text) return;

    handleUserInput(text);

    heroChatInput.value = '';
  }
});

heroClearBtn.addEventListener('click', resetChat);

resetChat();
  /* ==========================================================================
     5. SECTION 4: LIVE AI CHAT BOOKING SIMULATION
     ========================================================================== */
  const dreamChatBody = document.getElementById('dream-chat-body');
  const chatScenario = [
    { type: 'bot', text: 'Hi there! Welcome to Luxe Med Spa. How can I help you today? ✨' },
    { type: 'visitor', text: 'Hi! I would like to book a lip filler consultation.' },
    { type: 'bot', text: 'I can certainly help you with that! We have slots open with Dr. Sarah this Thursday and Friday. Which day works best?' },
    { type: 'visitor', text: 'Thursday afternoon works best for me!' },
    { type: 'bot', text: 'Awesome! We have 2:00 PM and 4:30 PM available on Thursday. Which one would you prefer?' },
    { type: 'visitor', text: 'Let\'s go with 2:00 PM.' },
    { type: 'bot', text: 'Perfect. What is your full name and cell number to lock this in?' },
    { type: 'visitor', text: 'Amanda Rose, 555-0199' },
    { type: 'bot', text: 'Checking schedule... ⏳' },
    { 
      type: 'booking-confirm', 
      title: 'Appointment Scheduled! 🎉',
      details: [
        'Treatment: Lip Filler Consultation',
        'Provider: Dr. Sarah',
        'Time: Thursday, June 18th @ 2:00 PM',
        'Location: Luxe Med Spa'
      ]
    },
    { type: 'bot', text: 'Confirmed! You are all set for Thursday, June 18th at 2:00 PM. A confirmation text is on its way. See you then! 🌟' }
  ];

  let scenarioIndex = 0;

  function runDreamChatLoop() {
    if (!dreamChatBody) return;
    
    if (scenarioIndex === 0) {
      dreamChatBody.innerHTML = '';
    }
    
    if (scenarioIndex < chatScenario.length) {
      const item = chatScenario[scenarioIndex];
      
      // If it is bot typing, show typing indicator first
      if (item.type === 'bot') {
        const typingBubble = document.createElement('div');
        typingBubble.className = 'chat-bubble bot typing';
        typingBubble.innerHTML = `
          <div class="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        `;
        dreamChatBody.appendChild(typingBubble);
        dreamChatBody.scrollTop = dreamChatBody.scrollHeight;
        
        setTimeout(() => {
          typingBubble.remove();
          const bubble = document.createElement('div');
          bubble.className = 'chat-bubble bot';
          bubble.innerHTML = item.text;
          dreamChatBody.appendChild(bubble);
          dreamChatBody.scrollTop = dreamChatBody.scrollHeight;
          
          scenarioIndex++;
          setTimeout(runDreamChatLoop, 2000);
        }, 1500);
        
      } else if (item.type === 'visitor') {
        setTimeout(() => {
          const bubble = document.createElement('div');
          bubble.className = 'chat-bubble visitor';
          bubble.textContent = item.text;
          dreamChatBody.appendChild(bubble);
          dreamChatBody.scrollTop = dreamChatBody.scrollHeight;
          
          scenarioIndex++;
          setTimeout(runDreamChatLoop, 1500);
        }, 800);
        
      } else if (item.type === 'booking-confirm') {
        setTimeout(() => {
          const card = document.createElement('div');
          card.className = 'booking-card fade-up show';
          
          let detailsHTML = '';
          item.details.forEach(detail => {
            detailsHTML += `
              <div class="booking-card-detail">
                <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
                <span>${detail}</span>
              </div>
            `;
          });
          
          card.innerHTML = `
            <h5>${item.title}</h5>
            ${detailsHTML}
            <div class="booking-success">Scheduled via Instagram DM Automation</div>
          `;
          
          dreamChatBody.appendChild(card);
          dreamChatBody.scrollTop = dreamChatBody.scrollHeight;
          
          scenarioIndex++;
          setTimeout(runDreamChatLoop, 2200);
        }, 1000);
      }
    } else {
      // Loop ends, restart after 8 seconds
      setTimeout(() => {
        scenarioIndex = 0;
        runDreamChatLoop();
      }, 8000);
    }
  }

  runDreamChatLoop();

  /* ==========================================================================
     6. INTERACTIVE REVENUE LOSS CALCULATOR
     ========================================================================== */
  const sliderValue = document.getElementById('calc-slider-value');
  const sliderLeads = document.getElementById('calc-slider-leads');
  const displayVal = document.getElementById('calc-display-value');
  const displayLeads = document.getElementById('calc-display-leads');
  
  const statsDaily = document.getElementById('stats-daily');
  const statsMonthly = document.getElementById('stats-monthly');

  function calculateLoss() {
    if (!sliderValue || !sliderLeads) return;
    
    const value = parseInt(sliderValue.value);
    const leads = parseInt(sliderLeads.value);
    
    if (displayVal) displayVal.textContent = `$${value.toLocaleString()}`;
    if (displayLeads) displayLeads.textContent = leads;
    
    const dailyLoss = value * leads;
    const monthlyLoss = dailyLoss * 30;
    
    // Update main text stat blocks with transition
    if (statsDaily) {
      statsDaily.textContent = `$${dailyLoss.toLocaleString()}`;
    }
    if (statsMonthly) {
      statsMonthly.textContent = `$${(monthlyLoss / 1000).toFixed(0)}K`;
    }
  }

  if (sliderValue && sliderLeads) {
    sliderValue.addEventListener('input', calculateLoss);
    sliderLeads.addEventListener('input', calculateLoss);
    calculateLoss(); // initial calculation
  }

  /* ==========================================================================
     7. CIRCULAR STAT COUNTER ANIMATION (SECTION 6)
     ========================================================================== */
  let counterAnimated = false;
  
  function animateCircleCounter() {
    if (counterAnimated) return;
    
    const circle = document.querySelector('.stat-circle-progress');
    const number = document.getElementById('proof-number');
    
    if (!circle || !number) return;
    
    counterAnimated = true;
    
    // Set stroke dash offset to match 78% of 502
    // 78% of 502 is 391.56, so offset is 502 - 391.56 = 110.44
    circle.style.strokeDashoffset = '110';
    
    let currentVal = 0;
    const targetVal = 78;
    const duration = 2000; // 2 seconds
    const intervalTime = duration / targetVal;
    
    const countInterval = setInterval(() => {
      currentVal++;
      number.textContent = `${currentVal}%`;
      
      if (currentVal >= targetVal) {
        clearInterval(countInterval);
      }
    }, intervalTime);
  }

  /* ==========================================================================
     8. CALENDLY WIDGET MOCKUP INTERACTION
     ========================================================================== */
  const calDays = document.querySelectorAll('.calendar-day.active');
  const timeSlotsContainer = document.querySelector('.time-slots');
  const calendarGrid = document.querySelector('.calendar-grid');
  const selectedDateText = document.getElementById('selected-date-text');
  const confirmBookingBtn = document.getElementById('confirm-booking-btn');
  const timeSlots = document.querySelectorAll('.time-slot');
  const calendlyRight = document.querySelector('.calendly-right');

  let selectedDay = null;
  let selectedTime = null;

  calDays.forEach(day => {
    day.addEventListener('click', () => {
      // Clear previous selection
      calDays.forEach(d => d.classList.remove('selected'));
      timeSlots.forEach(t => t.classList.remove('selected'));
      selectedTime = null;
      confirmBookingBtn.style.display = 'none';
      
      day.classList.add('selected');
      selectedDay = day.textContent;
      
      // Update heading text
      if (selectedDateText) {
        selectedDateText.textContent = `Select Time for June ${selectedDay}`;
      }
      
      // Show time slots
      if (timeSlotsContainer) {
        timeSlotsContainer.classList.add('show');
      }
    });
  });

  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(t => t.classList.remove('selected'));
      slot.classList.add('selected');
      selectedTime = slot.textContent;
      
      // Show booking button
      if (confirmBookingBtn) {
        confirmBookingBtn.style.display = 'block';
        confirmBookingBtn.textContent = `CONFIRM BOOKING: JUNE ${selectedDay} @ ${selectedTime}`;
      }
    });
  });

  if (confirmBookingBtn) {
    confirmBookingBtn.addEventListener('click', () => {
      if (selectedDay && selectedTime) {
        // Change right side to success state
        calendlyRight.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center; padding: 40px; gap:20px; animation: fadeIn 0.5s ease both;">
            <div style="width: 80px; height: 80px; border-radius: 50%; background-color: var(--lime-color); display:flex; align-items:center; justify-content:center; color:#000; box-shadow:0 0 30px var(--lime-glow-strong);">
              <svg viewBox="0 0 24 24" style="width:40px; height:40px; fill:currentColor;"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>
            </div>
            <h3 style="font-size: 1.8rem; color:#fff;">You're Booked! 🎉</h3>
            <p style="color:var(--text-muted); font-size:1rem; max-width:320px;">
              Your 30-minute live consultation is scheduled for <strong>June ${selectedDay} at ${selectedTime}</strong>.
            </p>
            <div style="background-color:rgba(192, 255, 4, 0.05); border:1px solid rgba(192,255,4,0.15); border-radius:16px; padding:16px; width:100%; max-width:320px;">
              <span style="font-size:0.8rem; color:var(--lime-color); font-weight:700; display:block; margin-bottom:4px;">WHAT TO EXPECT:</span>
              <span style="font-size:0.85rem; color:#fff;">We'll call you to show your custom AI Front Desk in action on your WhatsApp/Instagram.</span>
            </div>
            <button class="btn btn-secondary" onclick="location.reload()" style="margin-top:10px; font-size:0.85rem; padding:10px 20px;">Schedule another time</button>
          </div>
        `;
      }
    });
  }

  /* ==========================================================================
     9. CLINIC VISUAL SHOWCASE TAB TOGGLE
     ========================================================================== */
  const btnShowcaseRoom = document.getElementById('btn-showcase-room');
  const btnShowcaseTools = document.getElementById('btn-showcase-tools');
  const visualRoomContainer = document.getElementById('visual-room-container');
  const visualToolsContainer = document.getElementById('visual-tools-container');

  if (btnShowcaseRoom && btnShowcaseTools && visualRoomContainer && visualToolsContainer) {
    btnShowcaseRoom.addEventListener('click', () => {
      btnShowcaseRoom.classList.add('active-tab');
      btnShowcaseTools.classList.remove('active-tab');
      visualRoomContainer.style.display = 'block';
      visualToolsContainer.style.display = 'none';
    });

    btnShowcaseTools.addEventListener('click', () => {
      btnShowcaseTools.classList.add('active-tab');
      btnShowcaseRoom.classList.remove('active-tab');
      visualRoomContainer.style.display = 'none';
      visualToolsContainer.style.display = 'block';
    });
  }

});
