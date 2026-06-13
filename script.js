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
  const heroChatContainer = document.getElementById('hero-chat-container');
  const heroQuickReplies = document.getElementById('hero-quick-replies');
  const heroChatInput = document.getElementById('hero-chat-input');
  const heroSendBtn = document.getElementById('hero-send-btn');
  const heroClearBtn = document.getElementById('hero-clear-btn');

  let currentChatState = 0;
  let selectedService = '';
  let selectedTime = '';
  let clientName = '';
  let clientPhone = '';

  // Helper to add a message bubble
  function addMessage(sender, text, isHtml = false) {
    const bubble = document.createElement('div');
    bubble.className = `insta-bubble ${sender}`;
    if (isHtml) {
      bubble.innerHTML = text;
    } else {
      bubble.textContent = text;
    }
    heroChatContainer.appendChild(bubble);
    heroChatContainer.scrollTop = heroChatContainer.scrollHeight;
  }

  // Helper to show AI typing indicator and then reply
  function showAiReply(text, callback, isHtml = false) {
    const typingBubble = document.createElement('div');
    typingBubble.className = 'insta-bubble ai typing';
    typingBubble.innerHTML = `
      <div class="typing-indicator">
        <span></span>
        <span></span>
        <span></span>
      </div>
    `;
    heroChatContainer.appendChild(typingBubble);
    heroChatContainer.scrollTop = heroChatContainer.scrollHeight;

    setTimeout(() => {
      typingBubble.remove();
      addMessage('ai', text, isHtml);
      if (callback) callback();
    }, 1200);
  }

  // Render quick reply options based on state
  function renderQuickReplies() {
    if (!heroQuickReplies) return;
    heroQuickReplies.innerHTML = '';

    let options = [];
    if (currentChatState === 0) {
      options = ['Request a Booking 📅'];
    } else if (currentChatState === 1) {
      options = ['Botox Treatment 💉', 'Lip Filler 👄', 'Premium Facial 🧴'];
    } else if (currentChatState === 2) {
      options = ['Tomorrow @ 2:30 PM', 'Tomorrow @ 4:00 PM', 'Friday @ 1:00 PM'];
    } else if (currentChatState === 3) {
      options = ['Emily Watson, 555-0199 👤', 'Custom Contact ⌨️'];
    } else if (currentChatState === 4) {
      options = ['Reset & Start New Chat 🔄'];
    }

    options.forEach(opt => {
      const button = document.createElement('button');
      button.className = 'insta-pill';
      button.textContent = opt;
      button.addEventListener('click', () => {
        const cleanText = opt.replace(/[\u2700-\u27BF]|[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF]/g, '').trim();
        handleUserInput(cleanText);
      });
      heroQuickReplies.appendChild(button);
    });
  }

  // Handle user input (from quick reply or manual text input)
  function handleUserInput(input) {
    if (!input) return;

    // Add user message
    addMessage('user', input);

    if (heroChatInput) {
      heroChatInput.value = '';
    }

    // Process State transitions
    if (currentChatState === 0) {
      currentChatState = 1;
      showAiReply('We’d love to help you book an appointment! ✨ Which of our treatments are you looking for?', renderQuickReplies);
    } else if (currentChatState === 1) {
      selectedService = input;
      currentChatState = 2;
      showAiReply(`Excellent choice! We have slots open for a **${selectedService}** tomorrow and Friday. Please pick a slot:`, renderQuickReplies);
    } else if (currentChatState === 2) {
      selectedTime = input;
      currentChatState = 3;
      showAiReply(`Got it: **${selectedService}** on **${selectedTime}**. Who will be booking this? Please share your name & phone number.`, renderQuickReplies);
    } else if (currentChatState === 3) {
      if (input.includes('Emily Watson')) {
        clientName = 'Emily Watson';
        clientPhone = '555-0199';
        submitBooking();
      } else {
        showAiReply('Please type your name and phone number below (format: Name, Phone) and click Send.', () => {
          if (heroChatInput) {
            heroChatInput.disabled = false;
            heroChatInput.placeholder = "e.g., Jane Doe, 555-0123";
            heroChatInput.focus();
          }
        });
      }
    } else if (currentChatState === 4) {
      resetHeroChat();
    } else if (currentChatState === 3.5) {
      const parts = input.split(',');
      clientName = parts[0]?.trim() || 'Valued Client';
      clientPhone = parts[1]?.trim() || 'None provided';
      submitBooking();
    }
  }

  function submitBooking() {
    currentChatState = 4;
    showAiReply('Locking in your appointment details... ⏳', () => {
      // Render booking confirmation card
      const card = document.createElement('div');
      card.className = 'insta-booking-card';
      card.innerHTML = `
        <h5>Booking Confirmed! 🎉</h5>
        <div class="insta-booking-card-detail">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>Treatment: ${selectedService}</span>
        </div>
        <div class="insta-booking-card-detail">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>Time: ${selectedTime}</span>
        </div>
        <div class="insta-booking-card-detail">
          <svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>
          <span>Client: ${clientName}</span>
        </div>
      `;
      heroChatContainer.appendChild(card);
      heroChatContainer.scrollTop = heroChatContainer.scrollHeight;

      setTimeout(() => {
        showAiReply(`Awesome, ${clientName}! Your slot on ${selectedTime} is confirmed. A text has been sent to ${clientPhone}. See you soon! ✨`, renderQuickReplies);
      }, 1200);
    });
  }

  function resetHeroChat() {
    currentChatState = 0;
    selectedService = '';
    selectedTime = '';
    clientName = '';
    clientPhone = '';
    if (heroChatContainer) heroChatContainer.innerHTML = '';
    if (heroChatInput) {
      heroChatInput.value = '';
      heroChatInput.placeholder = "Type a message...";
      heroChatInput.disabled = false;
    }
    
    // Starts completely blank and only shows quick replies
    renderQuickReplies();
  }

  // Set up event listeners
  if (heroSendBtn && heroChatInput) {
    heroSendBtn.addEventListener('click', () => {
      const text = heroChatInput.value.trim();
      if (text) {
        if (currentChatState === 3) {
          currentChatState = 3.5;
        }
        handleUserInput(text);
      }
    });

    heroChatInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const text = heroChatInput.value.trim();
        if (text) {
          if (currentChatState === 3) {
            currentChatState = 3.5;
          }
          handleUserInput(text);
        }
      }
    });
  }

  if (heroClearBtn) {
    heroClearBtn.addEventListener('click', resetHeroChat);
  }

  // Start the chat on load
  resetHeroChat();

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
