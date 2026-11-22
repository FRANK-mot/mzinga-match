// Mzinga Match - Core App Logic

const profiles = [
  {
    id: 1,
    name: "Vanessa",
    age: 24,
    distance: "300 metres",
    drink: "KC Pineapple",
    drinkEmoji: "🍍",
    bio: "Looking for someone to finish this mzinga with 😏",
    photo: "👩",
    gradient: "from-pink-500 to-rose-600"
  },
  {
    id: 2,
    name: "Brian",
    age: 27,
    distance: "450 metres",
    drink: "Tusker Lager",
    drinkEmoji: "🍺",
    bio: "Cold Tusker, good vibes only. Who's down?",
    photo: "👨",
    gradient: "from-blue-500 to-cyan-600"
  },
  {
    id: 3,
    name: "Amina",
    age: 23,
    distance: "1.2 km",
    drink: "KC Pineapple",
    drinkEmoji: "🍍",
    bio: "Just opened a fresh mzinga. Don't let it go to waste",
    photo: "🧕",
    gradient: "from-purple-500 to-violet-600"
  },
  {
    id: 4,
    name: "Kevin",
    age: 26,
    distance: "800 metres",
    drink: "Captain Morgan",
    drinkEmoji: "🥃",
    bio: "Rum + good company. Let's make tonight legendary",
    photo: "🧔",
    gradient: "from-amber-500 to-orange-600"
  },
  {
    id: 5,
    name: "Wanjiku",
    age: 25,
    distance: "600 metres",
    drink: "KC Pineapple",
    drinkEmoji: "🍍",
    bio: "Pineapple squad assemble 🍍 Who's joining?",
    photo: "👩‍🦱",
    gradient: "from-yellow-400 to-orange-500"
  },
  {
    id: 6,
    name: "Dennis",
    age: 29,
    distance: "1.5 km",
    drink: "Guinness",
    drinkEmoji: "🖤",
    bio: "Dark and smooth. Just like my beer. Hit me up",
    photo: "👨‍🦲",
    gradient: "from-gray-700 to-gray-900"
  },
  {
    id: 7,
    name: "Faith",
    age: 22,
    distance: "350 metres",
    drink: "KC Pineapple",
    drinkEmoji: "🍍",
    bio: "Halfway through the bottle... need backup ASAP",
    photo: "💃",
    gradient: "from-fuchsia-500 to-pink-600"
  },
  {
    id: 8,
    name: "Ochieng",
    age: 28,
    distance: "900 metres",
    drink: "White Cap",
    drinkEmoji: "🍻",
    bio: "Football + cold ones. Perfect Saturday",
    photo: "⚽",
    gradient: "from-green-500 to-emerald-600"
  }
];

let currentIndex = 0;
let matches = [];
let isDragging = false;
let startX = 0;
let currentX = 0;

function startApp() {
  const splash = document.getElementById('splash');
  splash.style.opacity = '0';
  setTimeout(() => {
    splash.classList.add('hidden');
    document.getElementById('app').classList.remove('hidden');
    document.getElementById('app').classList.add('flex');
    renderCards();
  }, 400);
}

function renderCards() {
  const stack = document.getElementById('card-stack');
  stack.innerHTML = '';

  // Show up to 3 cards (top one is interactive)
  const visible = profiles.slice(currentIndex, currentIndex + 3);

  if (visible.length === 0) {
    document.getElementById('empty-state').classList.remove('hidden');
    return;
  }

  document.getElementById('empty-state').classList.add('hidden');

  // Render from back to front
  visible.reverse().forEach((profile, i) => {
    const isTop = i === visible.length - 1;
    const card = createCard(profile, isTop);
    stack.appendChild(card);
  });
}

function createCard(profile, isTop) {
  const card = document.createElement('div');
  card.className = `card absolute inset-0 rounded-3xl overflow-hidden shadow-2xl bg-dark-800 border border-white/10 ${isTop ? 'z-10' : 'z-0'}`;
  card.dataset.id = profile.id;

  if (!isTop) {
    card.style.transform = 'scale(0.95) translateY(10px)';
    card.style.opacity = '0.7';
  }

  card.innerHTML = `
    <div class="absolute inset-0 bg-gradient-to-br ${profile.gradient} opacity-90"></div>
    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>
    
    <div class="like-stamp">LIKE</div>
    <div class="nope-stamp">NOPE</div>

    <div class="relative h-full flex flex-col justify-end p-6">
      <!-- Big emoji avatar -->
      <div class="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 text-8xl opacity-90">
        ${profile.photo}
      </div>

      <div class="space-y-2">
        <div class="flex items-end gap-2">
          <h2 class="text-3xl font-extrabold">${profile.name}</h2>
          <span class="text-xl text-white/80 mb-0.5">${profile.age}</span>
        </div>
        
        <div class="flex items-center gap-2 text-sm text-white/80">
          <span>📍 ${profile.distance} away</span>
        </div>

        <div class="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/20">
          <span class="text-xl">${profile.drinkEmoji}</span>
          <span class="font-semibold">has a mzinga of ${profile.drink}</span>
        </div>

        <p class="text-white/90 text-sm leading-relaxed mt-2">${profile.bio}</p>
      </div>
    </div>
  `;

  if (isTop) {
    // Touch / mouse events for swipe
    card.addEventListener('touchstart', startDrag, { passive: true });
    card.addEventListener('touchmove', onDrag, { passive: true });
    card.addEventListener('touchend', endDrag);
    card.addEventListener('mousedown', startDrag);
    card.addEventListener('mousemove', onDrag);
    card.addEventListener('mouseup', endDrag);
    card.addEventListener('mouseleave', endDrag);
  }

  return card;
}

function startDrag(e) {
  isDragging = true;
  startX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
  const card = document.querySelector('.card.z-10');
  if (card) card.classList.add('swiping');
}

function onDrag(e) {
  if (!isDragging) return;
  const card = document.querySelector('.card.z-10');
  if (!card) return;

  currentX = (e.type.includes('mouse') ? e.clientX : e.touches[0].clientX) - startX;
  const rotate = currentX * 0.08;
  card.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;

  // Show stamps
  card.classList.remove('show-like', 'show-nope');
  if (currentX > 60) card.classList.add('show-like');
  if (currentX < -60) card.classList.add('show-nope');
}

function endDrag() {
  if (!isDragging) return;
  isDragging = false;

  const card = document.querySelector('.card.z-10');
  if (!card) return;

  card.classList.remove('swiping');

  if (currentX > 120) {
    swipe('right');
  } else if (currentX < -120) {
    swipe('left');
  } else {
    // Snap back
    card.style.transform = '';
    card.classList.remove('show-like', 'show-nope');
  }
  currentX = 0;
}

function swipe(direction) {
  const card = document.querySelector('.card.z-10');
  if (!card) return;

  const profile = profiles[currentIndex];

  if (direction === 'right') {
    card.classList.add('gone-right');
    // 40% chance of match for fun
    if (Math.random() > 0.4) {
      setTimeout(() => showMatch(profile), 350);
    }
  } else {
    card.classList.add('gone-left');
  }

  setTimeout(() => {
    currentIndex++;
    renderCards();
  }, 300);
}

function superLike() {
  const card = document.querySelector('.card.z-10');
  if (!card) return;
  // Treat as like for now
  swipe('right');
}

function showMatch(profile) {
  matches.push(profile);
  updateMatchCount();

  document.getElementById('match-name').textContent = profile.name;
  document.getElementById('match-avatar').textContent = profile.photo;
  document.getElementById('match-modal').classList.remove('hidden');
  document.getElementById('match-modal').classList.add('flex');
}

function closeMatch() {
  document.getElementById('match-modal').classList.add('hidden');
  document.getElementById('match-modal').classList.remove('flex');
}

function sendMessage() {
  alert("Chat coming soon! 💬\n\nFor now, just enjoy the matches.");
  closeMatch();
}

function updateMatchCount() {
  const badge = document.getElementById('match-count');
  if (matches.length > 0) {
    badge.textContent = matches.length;
    badge.classList.remove('hidden');
  }
}

function showMatches() {
  const list = document.getElementById('matches-list');
  list.innerHTML = '';

  if (matches.length === 0) {
    list.innerHTML = `<p class="text-center text-gray-500 mt-20">No matches yet.<br>Keep swiping!</p>`;
  } else {
    matches.forEach(m => {
      list.innerHTML += `
        <div class="flex items-center gap-4 bg-dark-800 p-4 rounded-2xl border border-white/5">
          <div class="w-14 h-14 rounded-full bg-gradient-to-br ${m.gradient} flex items-center justify-center text-2xl">${m.photo}</div>
          <div class="flex-1">
            <h3 class="font-bold">${m.name}, ${m.age}</h3>
            <p class="text-sm text-gray-400">${m.drinkEmoji} ${m.drink} • ${m.distance}</p>
          </div>
          <button class="bg-pineapple-500/20 text-pineapple-400 px-4 py-2 rounded-full text-sm font-medium">Chat</button>
        </div>
      `;
    });
  }

  document.getElementById('matches-screen').classList.remove('hidden');
}

function hideMatches() {
  document.getElementById('matches-screen').classList.add('hidden');
}

function resetCards() {
  currentIndex = 0;
  renderCards();
}

// Prevent pull-to-refresh on mobile
document.body.addEventListener('touchmove', function(e) {
  if (isDragging) e.preventDefault();
}, { passive: false });
