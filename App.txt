const part1 = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Maze Tanks</title>
  <style>
    :root {
      --bg: #dcd3bc;
      --panel: #e6dcc7;
      --panel-2: #d7ccb7;
      --line: rgba(0,0,0,.12);
      --text: #23262b;
      --muted: #6f6257;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      color: var(--text);
      background: linear-gradient(180deg, #e5e7eb 0%, #cfd4dc 100%);
    }
    .page {
      max-width: 1460px;
      margin: 0 auto;
      padding: 20px;
      background: transparent;
    }
    .topbar {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
      margin-bottom: 16px;
      padding: 14px 16px;
      border-radius: 18px;
      background: rgba(255, 255, 255, .42);
      border: 1px solid rgba(71, 85, 105, .24);
      box-shadow: 0 10px 26px rgba(30, 41, 59, .14);
    }
    h1 {
      margin: 0 0 6px;
      font-size: 34px;
      color: #203552;
      text-shadow: 0 1px 0 rgba(255,255,255,.28);
    }
    .subtitle {
      margin: 0;
      color: #4b5563;
    }
    .status {
      margin-top: 10px;
      min-height: 42px;
      padding: 10px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, .42);
      border: 1px solid rgba(71, 85, 105, .26);
      color: #1f2937;
      box-shadow: inset 0 1px 0 rgba(255,255,255,.3);
    }
    .buttons {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      justify-content: flex-end;
    }
    button {
      border: 1px solid rgba(0,0,0,.16);
      border-radius: 14px;
      padding: 12px 18px;
      font-size: 15px;
      font-weight: 700;
      color: #1b2530;
      background: #e5e7eb;
      cursor: pointer;
      box-shadow: 0 8px 18px rgba(30, 41, 59, .14);
      transition: transform .15s ease, box-shadow .15s ease, filter .15s ease;
    }
    button:hover {
      transform: translateY(-1px);
      filter: saturate(1.06);
      box-shadow: 0 12px 22px rgba(30, 41, 59, .2);
    }
    button:active {
      transform: translateY(0);
      box-shadow: 0 5px 10px rgba(30, 41, 59, .18);
    }
    #restartBtn {
      background: #f2cf7b;
      border-color: rgba(130, 95, 31, .35);
    }
    #roundBtn {
      background: #67c075;
      border-color: rgba(30, 103, 48, .4);
    }
    .layout {
      display: grid;
      grid-template-columns: minmax(720px, 1fr) 340px;
      gap: 16px;
    }
    .game-wrap,
    .panel {
      background: rgba(244, 245, 247, .95);
      border: 1px solid var(--line);
      border-radius: 22px;
      box-shadow: 0 18px 34px rgba(30, 41, 59, .14);
    }
    .game-wrap { padding: 14px; }
    canvas {
      display: block;
      width: 100%;
      height: auto;
      border-radius: 16px;
      background: #d7dde5;
    }
    .panel { padding: 18px; }
    .panel {
      background: rgba(244, 245, 247, .95);
    }
    .panel h2 {
      margin: 0 0 10px;
      font-size: 18px;
      color: #334155;
    }
    .panel section + section {
      margin-top: 18px;
      padding-top: 18px;
      border-top: 1px solid var(--line);
    }
    .panel ul {
      margin: 0;
      padding-left: 18px;
      color: var(--muted);
    }
    .panel li + li { margin-top: 8px; }
    .name-edit {
      margin-top: 12px;
      display: grid;
      gap: 8px;
    }
    .name-edit input {
      width: 100%;
      border: 1px solid rgba(0,0,0,.16);
      border-radius: 10px;
      padding: 8px 10px;
      font-size: 14px;
      background: rgba(255,255,255,.62);
      color: #1f2430;
    }
    .name-edit button {
      padding: 10px 12px;
      border-radius: 10px;
      font-size: 14px;
    }
    .card {
      margin-top: 10px;
      padding: 12px;
      border-radius: 14px;
      background: rgba(255,255,255,.46);
      color: #4b5563;
      border-left: 4px solid transparent;
    }
    .card strong {
      display: block;
      margin-bottom: 5px;
      color: var(--text);
    }
    .p1 { border-left-color: #61dd90; background: rgba(129, 227, 166, .22); }
    .p2 { border-left-color: #d4524d; background: rgba(242, 137, 132, .22); }
    .p3 { border-left-color: #315fbe; background: rgba(131, 168, 245, .22); }
    @media (max-width: 1160px) {
      .layout { grid-template-columns: 1fr; }
    }
    @media (max-width: 760px) {
      .page { padding: 12px; }
      .topbar { flex-direction: column; }
      .buttons { justify-content: flex-start; }
      h1 { font-size: 28px; }
    }
  </style>
</head>
<body>
  <div class="page">
    <div class="topbar">
      <div>
        <h1>Maze Tanks</h1>
        <p class="subtitle">Хаос-режим: порталы, торнадо и случайный размер лабиринта каждый раунд.</p>
        <div class="status" id="status">Загрузка...</div>
      </div>
      <div class="buttons">
        <button id="roundBtn" type="button">Новый раунд</button>
      </div>
    </div>

    <div class="layout">
      <div class="game-wrap">
        <canvas id="game" width="1100" height="760"></canvas>
      </div>

      <aside class="panel">
        <section>
          <h2>Управление</h2>
          <div class="card p1">
            <strong>Игрок 1</strong>
            W/S - вперед/назад<br>
            A/D - поворот<br>
            Q - выстрел
          </div>
          <div class="card p2">
            <strong>Игрок 2</strong>
            I/K - вперед/назад<br>
            J/L - поворот<br>
            Space - выстрел
          </div>
          <div class="card p3">
            <strong>Игрок 3</strong>
            Up/Down - вперед/назад<br>
            Left/Right - поворот<br>
            Enter - выстрел
          </div>
          <div class="name-edit">
            <input id="name1" type="text" maxlength="14" placeholder="Имя Игрока 1" />
            <input id="name2" type="text" maxlength="14" placeholder="Имя Игрока 2" />
            <input id="name3" type="text" maxlength="14" placeholder="Имя Игрока 3" />
            <button id="applyNamesBtn" type="button">Применить имена</button>
          </div>
        </section>
      </aside>
    </div>
  </div>

  <script>
    (function () {
      if (window.__mazeTanksApp && typeof window.__mazeTanksApp.destroy === 'function') {
        try { window.__mazeTanksApp.destroy(); } catch (e) {}
      }
`;

const part2 = `
      function resetNode(id) {
        var node = document.getElementById(id);
        if (!node) return null;
        var clone = node.cloneNode(true);
        if (node.parentNode) node.parentNode.replaceChild(clone, node);
        return clone;
      }

      var statusEl = document.getElementById('status');
      var canvas = resetNode('game');
      var roundBtn = resetNode('roundBtn');
      var applyNamesBtn = resetNode('applyNamesBtn');
      var name1El = document.getElementById('name1');
      var name2El = document.getElementById('name2');
      var name3El = document.getElementById('name3');
      if (!canvas) return;
      var ctx = canvas.getContext('2d');
      if (!ctx) return;

      function setStatus(text) {
        if (statusEl) statusEl.textContent = text;
      }

      window.onerror = function (message) {
        var msg = String(message || '');
        if (msg && msg.indexOf('SecurityError') === -1 && statusEl) statusEl.textContent = 'Ошибка JS: ' + msg;
      };

      try {
        var VIEW_W = canvas.width;
        var VIEW_H = canvas.height;

        var CELL = 96;
        var COLS = 10;
        var ROWS = 6;
        var WALL = 6;
        var WORLD_W = COLS * CELL;
        var WORLD_H = ROWS * CELL;
        var WORLD_SCALE = CELL / 96;
        var OFFSET_X = Math.round((VIEW_W - WORLD_W) / 2);
        var OFFSET_Y = 132;
        var arenaPresets = [
          { cols: 8, rows: 5, cell: 112, label: 'Компакт' },
          { cols: 10, rows: 6, cell: 96, label: 'Стандарт' },
          { cols: 12, rows: 7, cell: 78, label: 'Широкий' }
        ];

        var players = [
          { id: 1, name: 'Игрок 1', color: '#4fbf73', shell: '#7fe09d', keys: { f: 'KeyW', b: 'KeyS', l: 'KeyA', r: 'KeyD', s: 'KeyQ' } },
          { id: 2, name: 'Игрок 2', color: '#d4524d', shell: '#ef8b86', keys: { f: 'KeyI', b: 'KeyK', l: 'KeyJ', r: 'KeyL', s: 'Space' } },
          { id: 3, name: 'Игрок 3', color: '#315fbe', shell: '#6f97ea', keys: { f: 'ArrowUp', b: 'ArrowDown', l: 'ArrowLeft', r: 'ArrowRight', s: 'Enter' } }
        ];
        if (name1El) name1El.value = players[0].name;
        if (name2El) name2El.value = players[1].name;
        if (name3El) name3El.value = players[2].name;

        var state = {
          started: true,
          cells: [],
          walls: [],
          obstacles: [],
          solids: [],
          tanks: [],
          bullets: [],
          groundDecals: [],
          explosions: [],
          rocketStrikes: [],
          pickups: [],
          pickupTimer: 0,
          scores: { 1: 0, 2: 0, 3: 0 },
          round: 1,
          countdown: 0,
          message: 'Раунд 1',
          lastWinner: 0,
          flash: 0,
          time: 0,
          portals: [],
          arenaLabel: 'Стандарт',
          toastText: '',
          toastTimer: 0,
          laserBeams: [],
          tankTracks: [],
          tankSmoke: [],
          cameraShake: 0,
          eventTimer: 12,
          eventName: '',
          eventTimeLeft: 0,
          lastEvent: '',
          eventPortalShiftTimer: 0,
          chatterTimer: 20
        };

        var keysDown = Object.create(null);
        var animId = 0;
        var destroyed = false;
        var audioCtx = null;
        var audioUnlocked = false;
        var MAX_BULLETS_PER_TANK = 5;
        var nextBulletId = 1;
        var runId = (window.__mazeTanksRunId || 0) + 1;
        window.__mazeTanksRunId = runId;
        var usedKeys = {
          Space: true, Enter: true, KeyQ: true,
          ArrowUp: true, ArrowDown: true, ArrowLeft: true, ArrowRight: true,
          KeyW: true, KeyS: true, KeyA: true, KeyD: true,
          KeyI: true, KeyK: true, KeyJ: true, KeyL: true
        };

        var groundTextures = {
          asphalt: null,
          stones: null
        };
`;

const part3 = `
        function loadGroundTexture(key, url) {
          try {
            var img = new Image();
            img.src = url;
            groundTextures[key] = img;
          } catch (e) {}
        }

        loadGroundTexture('asphalt', '/images/grass-texture.jpg');

        function clamp(v, min, max) {
          return Math.max(min, Math.min(max, v));
        }

        function SR(v) {
          return v * WORLD_SCALE;
        }

        function hypot2(dx, dy) {
          return Math.sqrt(dx * dx + dy * dy);
        }

        function rand(min, max) {
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }

        function shuffle(arr) {
          var out = arr.slice();
          for (var i = out.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var t = out[i];
            out[i] = out[j];
            out[j] = t;
          }
          return out;
        }

        function roundRect(x, y, w, h, r) {
          ctx.beginPath();
          ctx.moveTo(x + r, y);
          ctx.lineTo(x + w - r, y);
          ctx.quadraticCurveTo(x + w, y, x + w, y + r);
          ctx.lineTo(x + w, y + h - r);
          ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
          ctx.lineTo(x + r, y + h);
          ctx.quadraticCurveTo(x, y + h, x, y + h - r);
          ctx.lineTo(x, y + r);
          ctx.quadraticCurveTo(x, y, x + r, y);
          ctx.closePath();
        }

        function ensureAudio() {
          var Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) return null;
          if (!audioCtx) audioCtx = new Ctx();
          if (audioCtx.state === 'suspended') {
            audioCtx.resume();
          }
          audioUnlocked = true;
          return audioCtx;
        }

        var webSfx = {
          shoot: 'https://actions.google.com/sounds/v1/weapons/gun_shooting_cocking_foam.ogg',
          hit: 'https://actions.google.com/sounds/v1/weapons/explosion_hiss_bop_bang.ogg',
          roundEnd: 'https://actions.google.com/sounds/v1/weapons/cocking_a_50cal_gun.ogg',
          crate: 'https://actions.google.com/sounds/v1/weapons/gun_reload.ogg',
          bulletFade: 'https://actions.google.com/sounds/v1/weapons/gun_drop_on_metal_grate.ogg',
          goofyPortal: 'https://www.soundjay.com/mechanical/sounds/spring-boing-1.mp3',
          goofyHit: 'https://www.soundjay.com/human/sounds/fart-01.mp3',
          goofyPickup: 'https://www.soundjay.com/button/sounds/button-16.mp3',
          bounce: 'https://actions.google.com/sounds/v1/impacts/metal_thin_impact.ogg',
          laser: 'https://www.soundjay.com/mechanical/sounds/laser-gun-81720.mp3',
          move: 'https://www.soundjay.com/transportation/sounds/car-drive-by-1.mp3',
          click: 'https://www.soundjay.com/button/sounds/button-20.mp3'
        };

        var activeSfx = [];
        var lastBounceAt = 0;
        var lastMoveSoundAt = 0;
        var selectedMaleVoice = null;
        var speechLockUntil = 0;
        var chatterPhrases = [
          'Аккуратно на поворотах.',
          'Кто последний, тот чинит гусеницы.',
          'Не стой под рикошетом.',
          'Мина любит спешащих.',
          'Лазер ошибок не прощает.',
          'Порталы не так дружелюбны как выглядят.',
          'Держитесь подальше от стен.',
          'Кто стоит на месте, тот мишень.',
          'Осторожно, торнадо не выбирает друзей.',
          'Рикошет может вернуться к хозяину.',
          'Ящик не всегда подарок.',
          'Дробовик хорош вблизи.',
          'Мега пуля летит медленно, но бьёт больно.',
          'Бур ломает стены, но не спину.',
          'Ракета найдёт тебя.',
          'Танки не умеют плавать.'
        ];

        function resolveMaleVoice() {
          if (!('speechSynthesis' in window)) return null;
          var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
          if (!voices || !voices.length) return null;
          var maleHints = ['male', 'man', 'maxim', 'alexander', 'sergey', 'ivan', 'pavel', 'dmit', 'yuri'];
          var ruVoices = voices.filter(function (v) { return (v.lang || '').toLowerCase().indexOf('ru') !== -1; });
          for (var i = 0; i < ruVoices.length; i++) {
            var name = (ruVoices[i].name || '').toLowerCase();
            for (var j = 0; j < maleHints.length; j++) {
              if (name.indexOf(maleHints[j]) !== -1) return ruVoices[i];
            }
          }
          for (var k = 0; k < voices.length; k++) {
            var name2 = (voices[k].name || '').toLowerCase();
            for (var h = 0; h < maleHints.length; h++) {
              if (name2.indexOf(maleHints[h]) !== -1) return voices[k];
            }
          }
          return null;
        }

        function playWebSound(url, volume, fromSec, maxDurationSec) {
          if (!audioUnlocked) return;
          try {
            var audio = new Audio(url);
            audio.preload = 'auto';
            audio.volume = typeof volume === 'number' ? volume : 0.35;
            audio.muted = false;
            audio.loop = false;
            if (typeof fromSec === 'number') {
              audio.currentTime = fromSec;
            }
            activeSfx.push(audio);

            function cleanupAudio() {
              var idx = activeSfx.indexOf(audio);
              if (idx !== -1) activeSfx.splice(idx, 1);
            }

            var cutTimer = 0;
            var cutMs = typeof maxDurationSec === 'number' && maxDurationSec > 0 ? Math.floor(maxDurationSec * 1000) : 0;
            if (cutMs > 0) {
              audio.addEventListener('playing', function () {
                cutTimer = window.setTimeout(function () {
                  try {
                    audio.pause();
                    audio.currentTime = 0;
                  } catch (e) {}
                  cleanupAudio();
                }, cutMs);
              }, { once: true });
            }
            audio.addEventListener('ended', function () {
              if (cutTimer) window.clearTimeout(cutTimer);
              cleanupAudio();
            }, { once: true });
            window.setTimeout(cleanupAudio, 4000);
            audio.play().catch(function () {
              cleanupAudio();
            });
          } catch (e) {}
        }

        function playTone(freq, dur, type, vol, endFreq) {
          var ac = ensureAudio();
          if (!ac) return;
          var now = ac.currentTime;
          var osc = ac.createOscillator();
          var gain = ac.createGain();
          osc.type = type || 'sine';
          osc.frequency.setValueAtTime(freq, now);
          if (typeof endFreq === 'number') {
            osc.frequency.exponentialRampToValueAtTime(Math.max(18, endFreq), now + dur);
          }
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol || 0.08), now + 0.015);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
          osc.connect(gain);
          gain.connect(ac.destination);
          osc.start(now);
          osc.stop(now + dur + 0.02);
        }

        function playShootSound() {
          playTone(360, 0.045, 'square', 0.095, 220);
          setTimeout(function () { playTone(220, 0.08, 'triangle', 0.075, 130); }, 12);
          setTimeout(function () { playTone(520, 0.045, 'triangle', 0.05, 360); }, 92);
        }

        function playShotgunSound() {
          playShootSound();
        }

        function playRocketSound() {
          playShootSound();
        }

        function playRocketBurstSound() {
          playTone(130, 0.16, 'sawtooth', 0.08, 65);
          setTimeout(function () { playTone(240, 0.08, 'square', 0.05, 120); }, 24);
        }

        function playRocketLockBeep() {
          playTone(760, 0.045, 'square', 0.045, 700);
        }

        function playMegaLaunchSound() {
          playShootSound();
        }

        function playMegaExplodeSound() {
          playTone(95, 0.22, 'sawtooth', 0.09, 48);
          setTimeout(function () { playTone(160, 0.14, 'square', 0.05, 80); }, 45);
        }

        function playTornadoCastSound() {
          playShootSound();
        }

        function playFireClickSound() {
          playWebSound(webSfx.click, 0.2, 0.01, 0.12);
        }

        function playTornadoHitSound() {
          playTone(180, 0.09, 'sawtooth', 0.04, 110);
        }

        function playLaserSound() {
          playTone(840, 0.08, 'sine', 0.04, 690);
        }

        function playMachinegunSound() {
          playTone(420, 0.04, 'square', 0.026, 300);
        }

        function playCrateSpawnSound() {
          playWebSound(webSfx.crate, 0.55, 0.02, 0.35);
        }

        function playPickupSound() {
          playWebSound(webSfx.goofyPickup, 0.35, 0.01, 0.25);
        }

        function playHitSound() {
          playWebSound(webSfx.goofyHit, 0.2, 0, 0.22);
          playTone(210, 0.1, 'square', 0.11, 120);
          setTimeout(function () { playTone(120, 0.18, 'sawtooth', 0.09, 55); }, 24);
        }

        function playPortalSound() {
          playWebSound(webSfx.goofyPortal, 0.35, 0.05, 0.25);
          playTone(680, 0.06, 'triangle', 0.05, 530);
        }

        function playBulletFadeSound(kind) {
          playTone(540, 0.055, 'triangle', 0.065, 390);
        }

        function playWinSound() {
          playTone(480, 0.11, 'triangle', 0.07, 620);
          setTimeout(function () { playTone(680, 0.14, 'triangle', 0.075, 860); }, 90);
        }

        function playBounceSound() {
          if (state.time - lastBounceAt < 0.045) return;
          lastBounceAt = state.time;
          playWebSound(webSfx.bounce, 0.3, 0.01, 0.18);
          playTone(640, 0.03, 'triangle', 0.03, 520);
        }

        function playDrillSound() {
          playWebSound(webSfx.shoot, 0.24, 0.03, 0.18);
          playTone(180, 0.1, 'sawtooth', 0.06, 100);
        }

        function playMinePlaceSound() {
          playWebSound(webSfx.crate, 0.32, 0.02, 0.2);
        }

        function playLaserFireSound() {
          playWebSound(webSfx.laser, 0.26, 0.02, 0.22);
          playLaserSound();
        }

        function playMoveSound() {
          if (state.time - lastMoveSoundAt < 0.22) return;
          lastMoveSoundAt = state.time;
          playWebSound(webSfx.move, 0.16, 0.05, 0.16);
        }

        function speakText(text, lockSec) {
          try {
            if (!('speechSynthesis' in window)) return;
            window.speechSynthesis.cancel();
            var u = new SpeechSynthesisUtterance(text);
            u.lang = 'ru-RU';
            u.rate = 1;
            u.pitch = 0.75;
            var voices = window.speechSynthesis.getVoices ? window.speechSynthesis.getVoices() : [];
            if (voices && voices.length) {
              var maleHints = ['male', 'man', 'maxim', 'dmit', 'ivan', 'pavel', 'sergey', 'alex', 'yuri'];
              var ruVoices = voices.filter(function (v) { return (v.lang || '').toLowerCase().indexOf('ru') !== -1; });
              var pick = null;
              var pool = ruVoices.length ? ruVoices : voices;
              for (var i = 0; i < pool.length; i++) {
                var n = (pool[i].name || '').toLowerCase();
                for (var j = 0; j < maleHints.length; j++) {
                  if (n.indexOf(maleHints[j]) !== -1) { pick = pool[i]; break; }
                }
                if (pick) break;
              }
              if (pick) u.voice = pick;
              else if (ruVoices.length) u.voice = ruVoices[0];
            }
            window.speechSynthesis.speak(u);
            if (typeof lockSec === 'number' && lockSec > 0) {
              speechLockUntil = Math.max(speechLockUntil, state.time + lockSec);
            }
          } catch (e) {}
        }

        function maybeSpeakRandomLine() {
          if (state.time < speechLockUntil) return;
          if ('speechSynthesis' in window && window.speechSynthesis.speaking) return;
          var line = chatterPhrases[rand(0, chatterPhrases.length - 1)];
          speakText(line, 0.6);
        }
`;

const part4 = `
        function makeGrid() {
          var cells = [];
          for (var y = 0; y < ROWS; y++) {
            var row = [];
            for (var x = 0; x < COLS; x++) {
              row.push({
                x: x,
                y: y,
                v: true,
                walls: { top: true, right: true, bottom: true, left: true }
              });
            }
            cells.push(row);
          }
          return cells;
        }

        function inBounds(x, y) {
          return x >= 0 && y >= 0 && x < COLS && y < ROWS;
        }

        function carveMaze(cells) {
          var stack = [];
          var start = cells[0][0];
          start.v = false;
          stack.push(start);

          while (stack.length) {
            var current = stack[stack.length - 1];
            var dirs = shuffle([
              { dx: 0, dy: -1, side: 'top', other: 'bottom' },
              { dx: 1, dy: 0, side: 'right', other: 'left' },
              { dx: 0, dy: 1, side: 'bottom', other: 'top' },
              { dx: -1, dy: 0, side: 'left', other: 'right' }
            ]);

            var moved = false;
            for (var i = 0; i < dirs.length; i++) {
              var d = dirs[i];
              var nx = current.x + d.dx;
              var ny = current.y + d.dy;
              if (!inBounds(nx, ny)) continue;
              var next = cells[ny][nx];
              if (!next.v) continue;

              current.walls[d.side] = false;
              next.walls[d.other] = false;
              next.v = false;
              stack.push(next);
              moved = true;
              break;
            }

            if (!moved) stack.pop();
          }

          var extra = 6;
          while (extra > 0) {
            var x = rand(0, COLS - 1);
            var y = rand(0, ROWS - 1);
            var choices = [];
            if (x < COLS - 1 && cells[y][x].walls.right) choices.push({ dx: 1, dy: 0, side: 'right', other: 'left' });
            if (y < ROWS - 1 && cells[y][x].walls.bottom) choices.push({ dx: 0, dy: 1, side: 'bottom', other: 'top' });
            if (!choices.length) continue;
            var pick = choices[rand(0, choices.length - 1)];
            var n = cells[y + pick.dy][x + pick.dx];
            cells[y][x].walls[pick.side] = false;
            n.walls[pick.other] = false;
            extra -= 1;
          }
        }

        function buildWalls(cells) {
          var hEdges = [];
          var vEdges = [];
          var rects = [];

          for (var hy = 0; hy <= ROWS; hy++) {
            hEdges[hy] = [];
            for (var hx = 0; hx < COLS; hx++) hEdges[hy][hx] = false;
          }
          for (var vy = 0; vy < ROWS; vy++) {
            vEdges[vy] = [];
            for (var vx = 0; vx <= COLS; vx++) vEdges[vy][vx] = false;
          }

          for (var y = 0; y < ROWS; y++) {
            for (var x = 0; x < COLS; x++) {
              var cell = cells[y][x];
              if (cell.walls.top) hEdges[y][x] = true;
              if (cell.walls.bottom) hEdges[y + 1][x] = true;
              if (cell.walls.left) vEdges[y][x] = true;
              if (cell.walls.right) vEdges[y][x + 1] = true;
            }
          }

          for (var y2 = 0; y2 <= ROWS; y2++) {
            var startX = -1;
            for (var x2 = 0; x2 <= COLS; x2++) {
              var activeH = x2 < COLS && hEdges[y2][x2];
              if (activeH && startX === -1) startX = x2;
              if ((!activeH || x2 === COLS) && startX !== -1) {
                rects.push({
                  x: startX * CELL - WALL / 2,
                  y: y2 * CELL - WALL / 2,
                  w: (x2 - startX) * CELL + WALL,
                  h: WALL,
                  axis: 'h',
                  destroyedUntil: 0
                });
                startX = -1;
              }
            }
          }

          for (var x3 = 0; x3 <= COLS; x3++) {
            var startY = -1;
            for (var y3 = 0; y3 <= ROWS; y3++) {
              var activeV = y3 < ROWS && vEdges[y3][x3];
              if (activeV && startY === -1) startY = y3;
              if ((!activeV || y3 === ROWS) && startY !== -1) {
                rects.push({
                  x: x3 * CELL - WALL / 2,
                  y: startY * CELL,
                  w: WALL,
                  h: (y3 - startY) * CELL,
                  axis: 'v',
                  destroyedUntil: 0
                });
                startY = -1;
              }
            }
          }

          return rects;
        }

        function buildObstacles(spawnCells) {
          if (!spawnCells || !spawnCells.length) return [];
          return [];
        }

        function rebuildSolids() {
          state.solids = state.walls.concat(state.obstacles);
        }

        function getOpenCells() {
          var list = [];
          for (var y = 0; y < ROWS; y++) {
            for (var x = 0; x < COLS; x++) {
              list.push({ x: x, y: y });
            }
          }
          return shuffle(list);
        }

        function chooseSpawnCells(count) {
          var all = getOpenCells();
          var minDist = 3;
          while (minDist >= 2) {
            var result = [];
            for (var i = 0; i < all.length; i++) {
              var c = all[i];
              var ok = true;
              for (var j = 0; j < result.length; j++) {
                var dx = result[j].x - c.x;
                var dy = result[j].y - c.y;
                if (hypot2(dx, dy) < minDist) ok = false;
              }
              if (ok) result.push(c);
              if (result.length === count) return result;
            }
            minDist -= 1;
          }
          return all.slice(0, count);
        }

        function cellCenter(cell) {
          return {
            x: cell.x * CELL + CELL / 2,
            y: cell.y * CELL + CELL / 2
          };
        }
`;

const part5 = `
        function makeTank(def, point) {
          return {
            id: def.id,
            name: def.name,
            color: def.color,
            shell: def.shell,
            x: point.x,
            y: point.y,
            angle: Math.random() * Math.PI * 2,
            radius: SR(16),
            speed: SR(122 + rand(0, 22)),
            turn: 4.1,
            cooldown: 0.15,
            weapon: 'normal',
            weaponAmmo: 0,
            weaponTimer: 0,
            megaBulletId: 0,
            rocketBulletId: 0,
            rocketAiming: false,
            rocketAimX: point.x,
            rocketAimY: point.y,
            drillActive: false,
            drillTimer: 0,
            fireHeld: false,
            slowUntil: 0,
            alive: true,
            keys: def.keys
          };
        }

        function normAngle(a) {
          while (a > Math.PI) a -= Math.PI * 2;
          while (a < -Math.PI) a += Math.PI * 2;
          return a;
        }

        function getOwnedActiveBulletCount(ownerId) {
          var count = 0;
          for (var i = 0; i < state.bullets.length; i++) {
            if (!state.bullets[i].dead && state.bullets[i].owner === ownerId) count += 1;
          }
          return count;
        }

        function findNearestEnemy(ownerId, x, y) {
          var nearest = null;
          var best = Infinity;
          for (var i = 0; i < state.tanks.length; i++) {
            var t = state.tanks[i];
            if (!t.alive || t.id === ownerId) continue;
            var d = hypot2(t.x - x, t.y - y);
            if (d < best) {
              best = d;
              nearest = t;
            }
          }
          return nearest;
        }

        function getTankById(id) {
          for (var i = 0; i < state.tanks.length; i++) {
            if (state.tanks[i].id === id) return state.tanks[i];
          }
          return null;
        }

        function mixHex(colorA, colorB, t) {
          var a = String(colorA || '').replace('#', '');
          var b = String(colorB || '').replace('#', '');
          if (a.length !== 6 || b.length !== 6) return colorA;
          var ar = parseInt(a.slice(0, 2), 16);
          var ag = parseInt(a.slice(2, 4), 16);
          var ab = parseInt(a.slice(4, 6), 16);
          var br = parseInt(b.slice(0, 2), 16);
          var bg = parseInt(b.slice(2, 4), 16);
          var bb = parseInt(b.slice(4, 6), 16);
          var r = Math.round(ar + (br - ar) * t);
          var g = Math.round(ag + (bg - ag) * t);
          var bl = Math.round(ab + (bb - ab) * t);
          var hex = function (n) {
            var s = Math.max(0, Math.min(255, n)).toString(16);
            return s.length === 1 ? '0' + s : s;
          };
          return '#' + hex(r) + hex(g) + hex(bl);
        }

        function getWeaponPalette(ownerId) {
          var tank = getTankById(ownerId);
          var primary = tank ? tank.color : '#9aa0aa';
          var secondary = tank ? tank.shell : '#c7d0de';
          return {
            primary: primary,
            secondary: secondary,
            stroke: mixHex(primary, '#111111', 0.45),
            accent: mixHex(secondary, '#ffffff', 0.35),
            flame: mixHex(secondary, '#ffd66b', 0.38)
          };
        }

        function cellFromWorld(x, y) {
          return {
            x: clamp(Math.floor(x / CELL), 0, COLS - 1),
            y: clamp(Math.floor(y / CELL), 0, ROWS - 1)
          };
        }

        function buildPathBetweenCells(start, goal) {
          var key = function (c) { return c.x + ':' + c.y; };
          var startKey = key(start);
          var goalKey = key(goal);
          if (startKey === goalKey) return [start];

          var queue = [start];
          var head = 0;
          var visited = Object.create(null);
          var prev = Object.create(null);
          visited[startKey] = true;

          while (head < queue.length) {
            var cur = queue[head++];
            var cell = state.cells[cur.y] && state.cells[cur.y][cur.x];
            if (!cell) continue;

            var neighbors = [];
            if (!cell.walls.top && cur.y > 0) neighbors.push({ x: cur.x, y: cur.y - 1 });
            if (!cell.walls.right && cur.x < COLS - 1) neighbors.push({ x: cur.x + 1, y: cur.y });
            if (!cell.walls.bottom && cur.y < ROWS - 1) neighbors.push({ x: cur.x, y: cur.y + 1 });
            if (!cell.walls.left && cur.x > 0) neighbors.push({ x: cur.x - 1, y: cur.y });

            for (var i = 0; i < neighbors.length; i++) {
              var n = neighbors[i];
              var nk = key(n);
              if (visited[nk]) continue;
              visited[nk] = true;
              prev[nk] = cur;
              if (nk === goalKey) {
                var path = [n];
                var walk = cur;
                while (walk) {
                  path.push(walk);
                  if (key(walk) === startKey) break;
                  walk = prev[key(walk)] || null;
                }
                path.reverse();
                return path;
              }
              queue.push(n);
            }
          }

          return null;
        }

        function buildRocketRoute(fromX, fromY, toX, toY) {
          var start = cellFromWorld(fromX, fromY);
          var goal = cellFromWorld(toX, toY);
          return buildPathBetweenCells(start, goal);
        }

        function hasLineOfSight(x1, y1, x2, y2, probeRadius) {
          var dist = hypot2(x2 - x1, y2 - y1);
          var steps = Math.max(1, Math.ceil(dist / 10));
          for (var i = 1; i <= steps; i++) {
            var t = i / steps;
            var px = x1 + (x2 - x1) * t;
            var py = y1 + (y2 - y1) * t;
            if (circleHitsWall(px, py, probeRadius)) return false;
          }
          return true;
        }

        function traceLaser(originX, originY, angle, maxRange, maxBounces, ownerId, applyDamage) {
          var segments = [];
          var step = SR(8);
          var probe = SR(3);
          var x = originX;
          var y = originY;
          var dx = Math.cos(angle);
          var dy = Math.sin(angle);
          var remaining = maxRange;
          var bounces = 0;
          var loops = 0;

          while (remaining > 0 && loops < 18) {
            loops += 1;
            var startX = x;
            var startY = y;
            var traveled = 0;
            var collided = false;

            while (traveled < remaining) {
              var nx = x + dx * step;
              var ny = y + dy * step;
              var blocked = nx < 0 || nx > WORLD_W || ny < 0 || ny > WORLD_H || circleHitsWall(nx, ny, probe);

              if (blocked) {
                segments.push({ x1: startX, y1: startY, x2: x, y2: y });
                if (bounces >= maxBounces) {
                  return { segments: segments, hitTank: null };
                }
                var blockX = nx < 0 || nx > WORLD_W || circleHitsWall(nx, y, probe);
                var blockY = ny < 0 || ny > WORLD_H || circleHitsWall(x, ny, probe);
                if (blockX) dx *= -1;
                if (blockY) dy *= -1;
                if (!blockX && !blockY) {
                  dx *= -1;
                  dy *= -1;
                }
                x = clamp(x + dx * SR(4), SR(2), WORLD_W - SR(2));
                y = clamp(y + dy * SR(4), SR(2), WORLD_H - SR(2));
                bounces += 1;
                remaining -= traveled;
                collided = true;
                break;
              }

              for (var ti = 0; ti < state.tanks.length; ti++) {
                var tank = state.tanks[ti];
                if (!tank.alive || tank.id === ownerId) continue;
                if (hypot2(tank.x - nx, tank.y - ny) <= tank.radius + probe) {
                  segments.push({ x1: startX, y1: startY, x2: nx, y2: ny });
                  if (applyDamage) tank.alive = false;
                  return { segments: segments, hitTank: tank };
                }
              }

              x = nx;
              y = ny;
              traveled += step;
            }

            if (!collided) {
              segments.push({ x1: startX, y1: startY, x2: x, y2: y });
              break;
            }
          }

          return { segments: segments, hitTank: null };
        }

        function steerBulletTo(bullet, tx, ty, dt) {
          var currentAngle = Math.atan2(bullet.vy, bullet.vx);
          var targetAngle = Math.atan2(ty - bullet.y, tx - bullet.x);
          var diff = normAngle(targetAngle - currentAngle);
          var maxTurn = bullet.turnRate * dt;
          var nextAngle = currentAngle + clamp(diff, -maxTurn, maxTurn);
          var speed = bullet.speed || SR(132);
          bullet.vx = Math.cos(nextAngle) * speed;
          bullet.vy = Math.sin(nextAngle) * speed;
        }

        function updateRocketGuidance(bullet, dt) {
          if (bullet.homingDelay > 0) {
            bullet.homingDelay -= dt;
            return;
          }

          bullet.homingTime = (bullet.homingTime || 0) + dt;
          if (bullet.homingTime > 2.2) return;

          var target = findNearestEnemy(bullet.owner, bullet.x, bullet.y);
          if (!target) return;

          var targetDist = hypot2(target.x - bullet.x, target.y - bullet.y);
          bullet.navTimer -= dt;
          if (bullet.navTimer <= 0 || typeof bullet.lockX !== 'number') {
            var targetIntent = getTankMoveIntent(target);
            var lead = Math.min(0.07, targetDist / 1700);
            bullet.lockX = target.x + Math.cos(target.angle) * target.speed * targetIntent * lead;
            bullet.lockY = target.y + Math.sin(target.angle) * target.speed * targetIntent * lead;
            bullet.navTimer = 0.2 + Math.random() * 0.12;
          }

          var desiredSpeed = targetDist > 260 ? 185 : 145;
          bullet.speed += (desiredSpeed - bullet.speed) * Math.min(1, dt * 1.8);
          bullet.turnRate = targetDist < 120 ? 3.2 : 4.2;
          steerBulletTo(bullet, bullet.lockX, bullet.lockY, dt);
        }

        function getTankMoveIntent(tank) {
          var k = tank.keys;
          return (keysDown[k.f] ? 1 : 0) + (keysDown[k.b] ? -0.68 : 0);
        }

        function buildTornadoRoamPath(startX, startY) {
          var margin = 40;
          var rowStep = Math.max(68, Math.floor(CELL * 0.82));
          var colStep = Math.max(92, Math.floor(CELL * 1.05));
          var points = [];
          var row = 0;

          for (var y = margin; y <= WORLD_H - margin; y += rowStep) {
            if (row % 2 === 0) {
              for (var x = margin; x <= WORLD_W - margin; x += colStep) {
                points.push({ x: x, y: y });
              }
            } else {
              for (var xr = WORLD_W - margin; xr >= margin; xr -= colStep) {
                points.push({ x: xr, y: y });
              }
            }
            row += 1;
          }

          if (!points.length) points.push({ x: WORLD_W / 2, y: WORLD_H / 2 });

          var nearest = 0;
          var best = Infinity;
          for (var i = 0; i < points.length; i++) {
            var d = hypot2(points[i].x - startX, points[i].y - startY);
            if (d < best) {
              best = d;
              nearest = i;
            }
          }

          return { points: points, index: nearest, stuck: 0, lastDist: Infinity };
        }

        function updateTornadoGuidance(bullet, dt) {
          if (!bullet.roam) {
            bullet.roam = buildTornadoRoamPath(bullet.x, bullet.y);
          }

          var roam = bullet.roam;
          var speed = bullet.speed || 360;
          var point = roam.points[roam.index];
          var dist = hypot2(point.x - bullet.x, point.y - bullet.y);

          if (dist < 34) {
            roam.index = (roam.index + 1) % roam.points.length;
            point = roam.points[roam.index];
            dist = hypot2(point.x - bullet.x, point.y - bullet.y);
            roam.stuck = 0;
            bullet.navPath = null;
            bullet.navIndex = 1;
          }

          if (dist >= roam.lastDist - 0.8) {
            roam.stuck += dt;
          } else {
            roam.stuck = Math.max(0, roam.stuck - dt * 0.6);
          }
          roam.lastDist = dist;

          if (roam.stuck > 1.6) {
            roam.index = (roam.index + 3) % roam.points.length;
            point = roam.points[roam.index];
            roam.stuck = 0;
            bullet.navPath = null;
            bullet.navIndex = 1;
          }

          bullet.navTimer -= dt;
          if (!bullet.navPath || bullet.navTimer <= 0) {
            bullet.navPath = buildRocketRoute(bullet.x, bullet.y, point.x, point.y);
            bullet.navIndex = 1;
            bullet.navTimer = bullet.navInterval || 0.18;
          }

          var aimX = point.x;
          var aimY = point.y;
          if (bullet.navPath && bullet.navPath.length > 1) {
            if (bullet.navIndex >= bullet.navPath.length) bullet.navIndex = bullet.navPath.length - 1;
            var wpCell = bullet.navPath[bullet.navIndex];
            var wp = cellCenter(wpCell);
            while (bullet.navIndex < bullet.navPath.length - 1 && hypot2(wp.x - bullet.x, wp.y - bullet.y) < 12) {
              bullet.navIndex += 1;
              wpCell = bullet.navPath[bullet.navIndex];
              wp = cellCenter(wpCell);
            }
            aimX = wp.x;
            aimY = wp.y;
          }

          bullet.wanderTimer = (bullet.wanderTimer || 0) - dt;
          if (bullet.wanderTimer <= 0) {
            bullet.wanderTimer = 0.18 + Math.random() * 0.2;
            bullet.wanderAngle = (Math.random() - 0.5) * 0.5;
          }

          var desiredAngle = Math.atan2(aimY - bullet.y, aimX - bullet.x) + (bullet.wanderAngle || 0);
          var probeX = bullet.x + Math.cos(desiredAngle) * (bullet.radius + 20);
          var probeY = bullet.y + Math.sin(desiredAngle) * (bullet.radius + 20);
          if (circleHitsWall(probeX, probeY, bullet.radius * 0.7)) {
            var leftA = desiredAngle - 0.75;
            var rightA = desiredAngle + 0.75;
            var leftBlocked = circleHitsWall(bullet.x + Math.cos(leftA) * (bullet.radius + 18), bullet.y + Math.sin(leftA) * (bullet.radius + 18), bullet.radius * 0.65);
            var rightBlocked = circleHitsWall(bullet.x + Math.cos(rightA) * (bullet.radius + 18), bullet.y + Math.sin(rightA) * (bullet.radius + 18), bullet.radius * 0.65);
            if (leftBlocked && !rightBlocked) desiredAngle = rightA;
            else if (!leftBlocked && rightBlocked) desiredAngle = leftA;
            else desiredAngle += (Math.random() < 0.5 ? -1 : 1) * 0.75;
          }

          var currentAngle = Math.atan2(bullet.vy, bullet.vx);
          var turnRate = bullet.turnRate || 4.8;
          var nextAngle = currentAngle + clamp(normAngle(desiredAngle - currentAngle), -turnRate * dt, turnRate * dt);
          bullet.vx = Math.cos(nextAngle) * speed;
          bullet.vy = Math.sin(nextAngle) * speed;
        }

        function spawnBullet(ownerTank, cfg) {
          state.bullets.push({
            id: nextBulletId++,
            owner: ownerTank.id,
            kind: cfg.kind || 'normal',
            x: cfg.x,
            y: cfg.y,
            vx: cfg.vx,
            vy: cfg.vy,
            radius: cfg.radius,
            color: cfg.color,
            strokeColor: '#000000',
            accentColor: cfg.accentColor || cfg.color,
            flameColor: cfg.flameColor || cfg.color,
            safe: cfg.safe,
            bounces: 0,
            maxBounces: typeof cfg.maxBounces === 'number' ? cfg.maxBounces : 120,
            noBounce: !!cfg.noBounce,
            life: cfg.life,
            homingDelay: cfg.homingDelay || 0,
            turnRate: cfg.turnRate || 0,
            speed: cfg.speed || 0,
            fuse: typeof cfg.fuse === 'number' ? cfg.fuse : 0,
            stuck: !!cfg.stuck,
            hitLock: cfg.hitLock || 0,
            wanderTimer: cfg.wanderTimer || 0,
            navTargetId: 0,
            navPath: null,
            navIndex: 1,
            navTimer: 0,
            navInterval: cfg.navInterval || 0.22,
            rocketMode: '',
            avoidSide: 0,
            axisPref: cfg.axisPref || 'x',
            lastTornadoDirKey: '',
            wanderAngle: cfg.wanderAngle || 0,
            stuckTimer: 0,
            lastTargetDist: 0,
            portalCooldown: 0,
            trail: [],
            dead: false
          });
        }

        function getWeaponName(type) {
          if (type === 'shotgun') return 'Дробовик';
          if (type === 'rocket') return 'Ракета';
          if (type === 'drill') return 'Бур';
          if (type === 'mega') return 'Мега пуля';
          if (type === 'tornado') return 'Торнадо';
          if (type === 'laser') return 'Лазер';
          if (type === 'mine') return 'Мина';
          return 'Обычный';
        }

        function drawPickupIcon(type, size) {
          var s = size;
          if (type === 'mine') {
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.3, 0, Math.PI * 2);
            ctx.fillStyle = '#3a3a3a';
            ctx.fill();
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.12, 0, Math.PI * 2);
            ctx.fillStyle = '#ff5555';
            ctx.fill();
            for (var mi = 0; mi < 4; mi++) {
              var ma = (Math.PI * 2 * mi) / 4 + 0.4;
              ctx.beginPath();
              ctx.moveTo(Math.cos(ma) * s * 0.3, Math.sin(ma) * s * 0.3);
              ctx.lineTo(Math.cos(ma) * s * 0.48, Math.sin(ma) * s * 0.48);
              ctx.strokeStyle = '#eee';
              ctx.lineWidth = 2;
              ctx.stroke();
            }
            return;
          }
          if (type === 'tornado') {
            ctx.strokeStyle = '#9ed8f0';
            ctx.lineWidth = 1.6;
            ctx.beginPath();
            ctx.arc(0, -s * 0.12, s * 0.12, 0.3, Math.PI * 1.7);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, s * 0.04, s * 0.2, 0.3, Math.PI * 1.7);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, s * 0.2, s * 0.28, 0.3, Math.PI * 1.7);
            ctx.stroke();
            return;
          }
          if (type === 'shotgun') {
            var angles = [-0.34, -0.17, 0, 0.17, 0.34];
            for (var si = 0; si < angles.length; si++) {
              var bx = Math.cos(angles[si]) * s * 0.34;
              var by = Math.sin(angles[si]) * s * 0.34;
              ctx.beginPath();
              ctx.arc(bx, by, s * 0.07, 0, Math.PI * 2);
              ctx.fillStyle = '#eee';
              ctx.fill();
            }
            return;
          }
          if (type === 'mega') {
            ctx.beginPath();
            ctx.arc(0, 0, s * 0.22, 0, Math.PI * 2);
            ctx.fillStyle = '#ffd84a';
            ctx.fill();
            ctx.strokeStyle = '#aa8822';
            ctx.lineWidth = 2;
            ctx.stroke();
            return;
          }
          if (type === 'rocket') {
            ctx.save();
            roundRect(-s * 0.22, -s * 0.08, s * 0.44, s * 0.16, s * 0.05);
            ctx.fillStyle = '#c8d6e0';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(s * 0.26, 0);
            ctx.lineTo(s * 0.16, -s * 0.13);
            ctx.lineTo(s * 0.16, s * 0.13);
            ctx.closePath();
            ctx.fillStyle = '#ff9944';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-s * 0.22, -s * 0.05);
            ctx.lineTo(-s * 0.32, -s * 0.12);
            ctx.lineTo(-s * 0.22, -s * 0.02);
            ctx.closePath();
            ctx.fillStyle = '#8899aa';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(-s * 0.22, s * 0.05);
            ctx.lineTo(-s * 0.32, s * 0.12);
            ctx.lineTo(-s * 0.22, s * 0.02);
            ctx.closePath();
            ctx.fillStyle = '#8899aa';
            ctx.fill();
            ctx.restore();
            return;
          }
          if (type === 'laser') {
            ctx.strokeStyle = '#77ddff';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(-s * 0.4, 0);
            ctx.lineTo(s * 0.05, -s * 0.25);
            ctx.lineTo(s * 0.35, s * 0.12);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(s * 0.35, s * 0.12, s * 0.06, 0, Math.PI * 2);
            ctx.fillStyle = '#aaeeff';
            ctx.fill();
            return;
          }
          if (type === 'drill') {
            ctx.save();
            ctx.rotate(0.5);
            roundRect(-s * 0.12, -s * 0.24, s * 0.24, s * 0.48, s * 0.06);
            ctx.fillStyle = '#b0b0b0';
            ctx.fill();
            ctx.beginPath();
            ctx.moveTo(0, -s * 0.28);
            ctx.lineTo(-s * 0.08, -s * 0.2);
            ctx.lineTo(s * 0.08, -s * 0.2);
            ctx.closePath();
            ctx.fillStyle = '#ddd';
            ctx.fill();
            ctx.restore();
            return;
          }
          ctx.beginPath();
          ctx.arc(0, 0, s * 0.16, 0, Math.PI * 2);
          ctx.fillStyle = '#e0e4ea';
          ctx.fill();
        }

        function applyPickup(tank, pickupType) {
          tank.weapon = pickupType;
          tank.weaponAmmo = 0;
          tank.weaponTimer = 5;
          tank.megaBulletId = 0;
          tank.rocketAiming = false;
          tank.drillActive = false;
          tank.drillTimer = 0;
          if (pickupType === 'shotgun') tank.weaponAmmo = 3;
          if (pickupType === 'rocket') tank.weaponAmmo = 1;
          if (pickupType === 'drill') tank.weaponAmmo = 1;
          if (pickupType === 'mega') tank.weaponAmmo = 1;
          if (pickupType === 'tornado') tank.weaponAmmo = 1;
          if (pickupType === 'laser') tank.weaponAmmo = 1;
          if (pickupType === 'mine') tank.weaponAmmo = 2;
          playPickupSound();
          var bonusText = tank.name + ' взял бонус: ' + getWeaponName(pickupType);
          setStatus(bonusText);
          state.toastText = bonusText;
          state.toastTimer = 2.4;
          speakText(getWeaponName(pickupType), 2.2);
        }

        function triggerEvent(now) {
          var events = ['speedRush', 'crateRain', 'flood', 'rapidFire', 'ricochet', 'gravity', 'vortex', 'slip'];
          var pool = events.filter(function (ev) { return ev !== state.lastEvent; });
          if (!pool.length) pool = events.slice();
          var picked = pool[rand(0, pool.length - 1)];
          state.lastEvent = picked;

          if (picked === 'speedRush') {
            state.eventName = 'speedRush';
            state.eventTimeLeft = 7;
            setStatus('Событие: турбо-рывок');
            if (now) state.toastText = 'Событие: турбо-рывок';
            if (now) speakText('Турбо рывок');
          } else if (picked === 'crateRain') {
            state.eventName = '';
            state.eventTimeLeft = 0;
            state.pickupTimer = 0;
            spawnPickupIfNeeded();
            setStatus('Событие: дождь ящиков');
            if (now) state.toastText = 'Событие: дождь ящиков';
            if (now) speakText('Дождь ящиков');
          } else if (picked === 'flood') {
            state.eventName = 'flood';
            state.eventTimeLeft = 8;
            setStatus('Событие: наводнение');
            if (now) state.toastText = 'Событие: наводнение';
            if (now) speakText('Наводнение');
          } else if (picked === 'rapidFire') {
            state.eventName = 'rapidFire';
            state.eventTimeLeft = 7;
            setStatus('Событие: ускоренная перезарядка');
            if (now) state.toastText = 'Событие: ускоренная перезарядка';
            if (now) speakText('Ускоренная перезарядка');
          } else if (picked === 'ricochet') {
            state.eventName = 'ricochet';
            state.eventTimeLeft = 9;
            setStatus('Событие: бешеный рикошет');
            if (now) state.toastText = 'Событие: бешеный рикошет';
            if (now) speakText('Бешеный рикошет');
          } else if (picked === 'gravity') {
            state.eventName = 'gravity';
            state.eventTimeLeft = 8;
            setStatus('Событие: грави волна');
            if (now) state.toastText = 'Событие: грави волна';
            if (now) speakText('Грави волна');
          } else if (picked === 'vortex') {
            state.eventName = 'vortex';
            state.eventTimeLeft = 9;
            setStatus('Событие: вихрь центра');
            if (now) state.toastText = 'Событие: вихрь центра';
            if (now) speakText('Вихрь центра');
          } else {
            state.eventName = 'slip';
            state.eventTimeLeft = 8;
            setStatus('Событие: скользкий грунт');
            if (now) state.toastText = 'Событие: скользкий грунт';
            if (now) speakText('Скользкий грунт');
          }
          if (now) state.toastTimer = 1.7;
          state.eventTimer = rand(24, 55);
        }

        function spawnPickupIfNeeded() {
          if (state.countdown > 0) return;
          if (state.pickupTimer > 0) return;
          if (state.pickups.length >= 10) {
            state.pickupTimer = rand(6, 10);
            return;
          }

          var candidates = getOpenCells();
          var spawned = 0;
          var targetSpawnCount = 1;
          for (var i = 0; i < candidates.length; i++) {
            var c = candidates[i];
            var center = cellCenter(c);
            var x = center.x;
            var y = center.y;
            var ok = !circleHitsWall(x, y, SR(14));
            if (!ok) continue;
            for (var t = 0; t < state.tanks.length; t++) {
              var tank = state.tanks[t];
              if (!tank.alive) continue;
              if (hypot2(tank.x - x, tank.y - y) < SR(130)) {
                ok = false;
                break;
              }
            }
            for (var px = 0; px < state.pickups.length; px++) {
              if (hypot2(state.pickups[px].x - x, state.pickups[px].y - y) < SR(96)) ok = false;
            }
            if (!ok) continue;

            var pool = ['drill', 'shotgun', 'rocket', 'tornado', 'laser', 'mine', 'mega'];
            state.pickups.push({
              x: x,
              y: y,
              radius: SR(13),
              type: pool[rand(0, pool.length - 1)]
            });
            spawned += 1;
            if (spawned >= targetSpawnCount || state.pickups.length >= 10) break;
          }

          if (spawned > 0) playCrateSpawnSound();
          state.pickupTimer = rand(6, 11);
        }

        function circleIntersectsRect(x, y, r, rect) {
          var cx = clamp(x, rect.x, rect.x + rect.w);
          var cy = clamp(y, rect.y, rect.y + rect.h);
          var dx = x - cx;
          var dy = y - cy;
          return dx * dx + dy * dy < r * r;
        }

        function isWallIntact(wall) {
          return !wall || !wall.destroyedUntil || state.time >= wall.destroyedUntil;
        }

        function breakWallsNear(x, y, radius, restoreDelay) {
          var broken = 0;
          for (var i = 0; i < state.walls.length; i++) {
            var wall = state.walls[i];
            if (!isWallIntact(wall)) continue;
            if (!circleIntersectsRect(x, y, radius, wall)) continue;
            wall.destroyedUntil = state.time + restoreDelay;
            broken += 1;
          }
          return broken;
        }

        function isHitOnShieldFront(tank, hitX, hitY) {
          var fx = Math.cos(tank.angle);
          var fy = Math.sin(tank.angle);
          var vx = hitX - tank.x;
          var vy = hitY - tank.y;
          var len = Math.max(0.0001, hypot2(vx, vy));
          return (vx / len) * fx + (vy / len) * fy > 0.35;
        }

        function resolveDrillContact(drillTank) {
          if (!drillTank.alive) return;
          if (state.eventName === 'vortex' && state.eventTimeLeft > 0) return;
          for (var i = 0; i < state.tanks.length; i++) {
            var target = state.tanks[i];
            if (!target.alive || target.id === drillTank.id) continue;
            var d = hypot2(target.x - drillTank.x, target.y - drillTank.y);
            if (d > drillTank.radius + target.radius + 2) continue;

            if (isHitOnShieldFront(drillTank, target.x, target.y)) {
              target.alive = false;
              state.flash = Math.max(state.flash, 0.14);
              playHitSound();
            } else {
              drillTank.alive = false;
              state.flash = Math.max(state.flash, 0.14);
              playHitSound();
              return;
            }
          }
        }

        function circleHitsWall(x, y, r) {
          for (var i = 0; i < state.solids.length; i++) {
            var solid = state.solids[i];
            if (!isWallIntact(solid)) continue;
            if (circleIntersectsRect(x, y, r, solid)) return true;
          }
          return false;
        }

        function hitsWallOnAxis(x, y, r, axis) {
          for (var i = 0; i < state.solids.length; i++) {
            var wall = state.solids[i];
            if (!isWallIntact(wall)) continue;
            if (wall.axis !== axis && wall.axis !== 'both') continue;
            if (circleIntersectsRect(x, y, r, wall)) return true;
          }
          return false;
        }

        function insideWorld(x, y, r) {
          return x - r >= 0 && x + r <= WORLD_W && y - r >= 0 && y + r <= WORLD_H;
        }

        function moveBodyWithCollisions(body, dx, dy, radius) {
          var steps = Math.max(1, Math.ceil(Math.max(Math.abs(dx), Math.abs(dy)) / 2));
          var sx = dx / steps;
          var sy = dy / steps;

          for (var i = 0; i < steps; i++) {
            var nx = body.x + sx;
            if (insideWorld(nx, body.y, radius) && !circleHitsWall(nx, body.y, radius)) {
              body.x = nx;
            }

            var ny = body.y + sy;
            if (insideWorld(body.x, ny, radius) && !circleHitsWall(body.x, ny, radius)) {
              body.y = ny;
            }
          }

          body.x = clamp(body.x, radius, WORLD_W - radius);
          body.y = clamp(body.y, radius, WORLD_H - radius);
        }

        function findFreeSpawnOnRay(originX, originY, angle, radius, minDist, maxDist) {
          var step = 6;
          for (var dist = minDist; dist <= maxDist; dist += step) {
            var sx = originX + Math.cos(angle) * dist;
            var sy = originY + Math.sin(angle) * dist;
            if (!insideWorld(sx, sy, radius)) continue;
            if (!circleHitsWall(sx, sy, radius)) {
              return { x: sx, y: sy };
            }
          }
          return null;
        }

        function randomOpenPoint(margin) {
          for (var i = 0; i < 50; i++) {
            var x = rand(margin, WORLD_W - margin);
            var y = rand(margin, WORLD_H - margin);
            if (!circleHitsWall(x, y, margin * 0.7)) return { x: x, y: y };
          }
          return { x: WORLD_W / 2, y: WORLD_H / 2 };
        }

        function spawnPortals() {
          state.portals = [];
          if (Math.random() < 0.35) return;
          var portalRadius = SR(22);
          var minPortalDist = SR(340);
          var a = randomOpenPoint(SR(28));
          var b = randomOpenPoint(SR(28));
          var tries = 0;
          while (tries < 30 && hypot2(a.x - b.x, a.y - b.y) < minPortalDist) {
            b = randomOpenPoint(SR(28));
            tries += 1;
          }
          if (hypot2(a.x - b.x, a.y - b.y) < minPortalDist) {
            b = { x: clamp(a.x + SR(360), SR(50), WORLD_W - SR(50)), y: clamp(a.y + SR(260), SR(50), WORLD_H - SR(50)) };
          }
          state.portals.push({ id: 1, x: a.x, y: a.y, radius: portalRadius, pair: 2 });
          state.portals.push({ id: 2, x: b.x, y: b.y, radius: portalRadius, pair: 1 });
        }

        function getPortalById(id) {
          for (var i = 0; i < state.portals.length; i++) {
            if (state.portals[i].id === id) return state.portals[i];
          }
          return null;
        }

        function teleportEntity(entity, radius) {
          if (!state.portals || state.portals.length < 2) return;
          var insidePortalId = 0;
          for (var ci = 0; ci < state.portals.length; ci++) {
            var cp = state.portals[ci];
            if (hypot2(entity.x - cp.x, entity.y - cp.y) <= cp.radius + radius) {
              insidePortalId = cp.id;
              break;
            }
          }
          if (entity.portalLockId) {
            if (insidePortalId === entity.portalLockId) return;
            if (!insidePortalId) entity.portalLockId = 0;
          }
          if (!insidePortalId) return;
          for (var i = 0; i < state.portals.length; i++) {
            var p = state.portals[i];
            if (hypot2(entity.x - p.x, entity.y - p.y) > p.radius + radius) continue;
            var out = getPortalById(p.pair);
            if (!out) return;
            var savedVx = entity.vx;
            var savedVy = entity.vy;
            var savedSpeed = entity.speed;
            entity.x = clamp(out.x, radius + 2, WORLD_W - radius - 2);
            entity.y = clamp(out.y, radius + 2, WORLD_H - radius - 2);
            if (typeof savedVx === 'number') entity.vx = savedVx;
            if (typeof savedVy === 'number') entity.vy = savedVy;
            if (typeof savedSpeed === 'number') entity.speed = savedSpeed;
            entity.portalLockId = out.id;
            playPortalSound();
            return;
          }
        }

        function findSafeSpotNear(cx, cy, radius, bodyRadius) {
          for (var i = 0; i < 24; i++) {
            var a = Math.random() * Math.PI * 2;
            var d = Math.random() * radius;
            var x = clamp(cx + Math.cos(a) * d, bodyRadius + 3, WORLD_W - bodyRadius - 3);
            var y = clamp(cy + Math.sin(a) * d, bodyRadius + 3, WORLD_H - bodyRadius - 3);
            if (!circleHitsWall(x, y, bodyRadius)) return { x: x, y: y };
          }
          return { x: clamp(cx, bodyRadius + 3, WORLD_W - bodyRadius - 3), y: clamp(cy, bodyRadius + 3, WORLD_H - bodyRadius - 3) };
        }

        function startRocketAim(tank) {
          tank.rocketAimX = clamp(tank.x + Math.cos(tank.angle) * 180, 24, WORLD_W - 24);
          tank.rocketAimY = clamp(tank.y + Math.sin(tank.angle) * 180, 24, WORLD_H - 24);
          tank.rocketAiming = true;
          setStatus(tank.name + ' наводит ракету. Нажми выстрел еще раз для подрыва.');
        }

        function confirmRocketAim(tank) {
          state.rocketStrikes.push({
            owner: tank.id,
            x: tank.rocketAimX,
            y: tank.rocketAimY,
            timer: 2.5,
            total: 2.5,
            nextBeep: 0,
            beepGap: 0.42
          });
          tank.rocketAiming = false;
          tank.weaponAmmo -= 1;
          if (tank.weaponAmmo <= 0) tank.weaponTimer = 5;
          tank.weapon = 'normal';
          tank.weaponAmmo = 0;
          setStatus(tank.name + ' зафиксировал цель ракеты.');
        }

        function updateRocketStrikeTimers(dt) {
          for (var i = 0; i < state.rocketStrikes.length; i++) {
            var strike = state.rocketStrikes[i];
            strike.timer -= dt;
            strike.nextBeep -= dt;

            if (strike.nextBeep <= 0 && strike.timer > 0) {
              playRocketLockBeep();
              var t = clamp(strike.timer / strike.total, 0, 1);
              strike.beepGap = 0.12 + t * 0.4;
              strike.nextBeep = strike.beepGap;
            }

            if (strike.timer <= 0) {
              state.explosions.push({
                x: strike.x,
                y: strike.y,
                owner: strike.owner,
                maxRadius: 142,
                radius: 40,
                life: 0.38,
                duration: 0.38,
                hit: Object.create(null)
              });
              state.flash = Math.max(state.flash, 0.18);
              playRocketBurstSound();
              strike.dead = true;
            }
          }

          state.rocketStrikes = state.rocketStrikes.filter(function (s) { return !s.dead; });
        }

        function shoot(tank) {
          var palette = getWeaponPalette(tank.id);

          if (tank.weapon === 'drill') {
            if (tank.drillActive) return false;
            tank.drillActive = true;
            tank.drillTimer = 4.8;
            tank.weapon = 'normal';
            tank.weaponAmmo = 0;
            tank.weaponTimer = 0;
            setStatus(tank.name + ' активировал бур. Лоб защищен, фланги уязвимы.');
            playDrillSound();
            tank.cooldown = 0.35;
            return true;
          }

          if (tank.weapon === 'rocket') {
            if (tank.rocketAiming) {
              confirmRocketAim(tank);
              playRocketSound();
              tank.cooldown = 0.35;
              return true;
            }

            startRocketAim(tank);
            playRocketSound();
            tank.cooldown = 0.18;
            return true;
          }

          if (tank.weapon === 'mega' && tank.megaBulletId) {
            var mega = null;
            for (var mb = 0; mb < state.bullets.length; mb++) {
              if (!state.bullets[mb].dead && state.bullets[mb].id === tank.megaBulletId) {
                mega = state.bullets[mb];
                break;
              }
            }

            if (mega) {
              mega.dead = true;
              state.explosions.push({
                x: mega.x,
                y: mega.y,
                owner: tank.id,
                maxRadius: Math.max(WORLD_W, WORLD_H) * 0.5,
                radius: SR(40),
                life: 0.42,
                duration: 0.42,
                hit: Object.create(null)
              });
              state.flash = Math.max(state.flash, 0.28);
              tank.megaBulletId = 0;
              tank.weapon = 'normal';
              tank.weaponAmmo = 0;
              playMegaExplodeSound();
              tank.cooldown = 0.24;
              return true;
            }

            tank.megaBulletId = 0;
            tank.weapon = 'normal';
            tank.weaponAmmo = 0;
          }

          var activeBullets = getOwnedActiveBulletCount(tank.id);
          var slots = MAX_BULLETS_PER_TANK - activeBullets;
          if (slots <= 0) return false;

          var effectiveWeapon = tank.weapon;
          if (effectiveWeapon !== 'normal' && tank.weaponAmmo <= 0 && !(effectiveWeapon === 'mega' && tank.megaBulletId)) {
            effectiveWeapon = 'normal';
          }

          var muzzle = tank.radius + SR(8);
          var bx = tank.x + Math.cos(tank.angle) * muzzle;
          var by = tank.y + Math.sin(tank.angle) * muzzle;
          if (effectiveWeapon !== 'tornado' && circleHitsWall(bx, by, SR(4))) return false;

          playFireClickSound();

          if (effectiveWeapon === 'shotgun') {
            var pellets = Math.min(5, slots);
            for (var p = 0; p < pellets; p++) {
              var spread = ((p / Math.max(1, pellets - 1)) - 0.5) * 0.5 + (Math.random() - 0.5) * 0.08;
              var a = tank.angle + spread;
              spawnBullet(tank, {
                kind: 'shotgun',
                x: bx,
                y: by,
                vx: Math.cos(a) * SR(175),
                vy: Math.sin(a) * SR(175),
                radius: SR(2.5),
                color: palette.secondary,
                strokeColor: palette.stroke,
                safe: 0.08,
                maxBounces: 0,
                noBounce: true,
                life: 0.95
              });
            }
            playShotgunSound();
            tank.weaponAmmo -= 1;
            if (tank.weaponAmmo <= 0) tank.weaponTimer = 5;
            tank.cooldown = 0.72;
          } else if (effectiveWeapon === 'mega') {
            spawnBullet(tank, {
              kind: 'mega',
              x: bx,
              y: by,
              vx: Math.cos(tank.angle) * SR(120),
              vy: Math.sin(tank.angle) * SR(120),
              radius: SR(8),
              color: mixHex(palette.primary, '#f4dc67', 0.42),
              strokeColor: mixHex(palette.primary, '#aa8822', 0.5),
              safe: 0.14,
              maxBounces: 4,
              life: 12
            });
            tank.megaBulletId = nextBulletId - 1;
            playMegaLaunchSound();
            tank.weaponAmmo -= 1;
            if (tank.weaponAmmo <= 0) tank.weaponTimer = 5;
            tank.cooldown = 0.55;
          } else if (effectiveWeapon === 'tornado') {
            var tornadoRadius = SR(36);
            var tornadoSpawn = findFreeSpawnOnRay(tank.x, tank.y, tank.angle, tornadoRadius, 34, 140);
            if (!tornadoSpawn) return false;
            spawnBullet(tank, {
              kind: 'tornado',
              x: tornadoSpawn.x,
              y: tornadoSpawn.y,
              vx: Math.cos(tank.angle) * SR(430),
              vy: Math.sin(tank.angle) * SR(430),
              radius: tornadoRadius,
              color: mixHex(palette.primary, '#8fd3ff', 0.4),
              strokeColor: palette.stroke,
              safe: 0.2,
              maxBounces: 999,
              noBounce: false,
              life: 9,
              speed: SR(430),
              turnRate: 5.4,
              axisPref: Math.abs(Math.cos(tank.angle)) >= Math.abs(Math.sin(tank.angle)) ? 'x' : 'y',
              navInterval: 0.16,
              wanderTimer: 0
            });
            playTornadoCastSound();
            tank.weaponAmmo -= 1;
            if (tank.weaponAmmo <= 0) tank.weaponTimer = 5;
            tank.cooldown = 0.7;
          } else if (effectiveWeapon === 'laser') {
            var laserSpeed = SR(520);
            spawnBullet(tank, {
              kind: 'laser-bolt',
              x: bx,
              y: by,
              vx: Math.cos(tank.angle) * laserSpeed,
              vy: Math.sin(tank.angle) * laserSpeed,
              radius: SR(3),
              color: '#111111',
              strokeColor: '#333333',
              safe: 0.06,
              maxBounces: 7,
              noBounce: false,
              life: 2.4,
              speed: laserSpeed
            });
            playLaserFireSound();
            tank.weaponAmmo -= 1;
            if (tank.weaponAmmo <= 0) tank.weaponTimer = 5;
            tank.cooldown = 0.5;
          } else if (effectiveWeapon === 'mine') {
            spawnBullet(tank, {
              kind: 'mine',
              x: tank.x - Math.cos(tank.angle) * SR(14),
              y: tank.y - Math.sin(tank.angle) * SR(14),
              vx: 0,
              vy: 0,
              radius: SR(10),
              color: mixHex(palette.primary, '#2f2a2a', 0.45),
              strokeColor: palette.stroke,
              safe: 0.2,
              noBounce: true,
              life: 16,
              maxBounces: 0
            });
            playMinePlaceSound();
            tank.weaponAmmo -= 1;
            if (tank.weaponAmmo <= 0) tank.weaponTimer = 5;
            tank.cooldown = 0.45;
          } else {
            spawnBullet(tank, {
              kind: 'normal',
              x: bx,
              y: by,
              vx: Math.cos(tank.angle) * SR(170),
              vy: Math.sin(tank.angle) * SR(170),
              radius: SR(3),
              color: palette.secondary,
              strokeColor: palette.stroke,
              safe: 0.16,
              life: 14
            });
            playShootSound();
            tank.cooldown = 0.52;
          }

          if (tank.weapon !== 'normal' && tank.weaponAmmo <= 0) tank.weaponAmmo = 0;
          return true;
        }

        function startRound() {
          var preset = arenaPresets[rand(0, arenaPresets.length - 1)];
          COLS = preset.cols;
          ROWS = preset.rows;
          CELL = preset.cell;
          WORLD_W = COLS * CELL;
          WORLD_H = ROWS * CELL;
          WORLD_SCALE = CELL / 96;
          OFFSET_X = Math.round((VIEW_W - WORLD_W) / 2);
          state.arenaLabel = preset.label + ' ' + COLS + 'x' + ROWS;
          state.cells = makeGrid();
          carveMaze(state.cells);
          state.walls = buildWalls(state.cells);
          state.groundDecals = [];
          for (var gd = 0; gd < 220; gd++) {
            state.groundDecals.push({
              kind: 'asphalt',
              x: Math.random() * WORLD_W,
              y: Math.random() * WORLD_H,
              r: 5 + Math.random() * 16,
              a: 0.03 + Math.random() * 0.09
            });
          }
          for (var gs = 0; gs < 56; gs++) {
            state.groundDecals.push({
              kind: 'stone',
              x: 18 + Math.random() * (WORLD_W - 36),
              y: 18 + Math.random() * (WORLD_H - 36),
              w: 8 + Math.random() * 24,
              h: 6 + Math.random() * 14,
              rot: (Math.random() - 0.5) * 1.1,
              a: 0.1 + Math.random() * 0.18
            });
          }
          var spawnCells = chooseSpawnCells(players.length);
          var spawns = spawnCells.map(cellCenter);
          state.obstacles = buildObstacles(spawnCells);
          rebuildSolids();
          state.tanks = players.map(function (p, i) { return makeTank(p, spawns[i]); });
          state.bullets = [];
          state.explosions = [];
          state.rocketStrikes = [];
          state.laserBeams = [];
          state.tankTracks = [];
          state.tankSmoke = [];
          state.pickups = [];
          state.pickupTimer = rand(2, 5);
          spawnPortals();
          state.eventTimer = rand(18, 42);
          state.eventName = '';
          state.eventTimeLeft = 0;
          state.eventPortalShiftTimer = 0;
          state.chatterTimer = rand(16, 32);
          state.countdown = 0;
          state.flash = 0;
          state.time = 0;
          state.message = 'Раунд ' + state.round + ' - ' + state.arenaLabel;
        }

        function startMatch() {
          keysDown = Object.create(null);
          lastTime = 0;
          state.scores = { 1: 0, 2: 0, 3: 0 };
          state.round = 1;
          state.lastWinner = 0;
          startRound();
          setStatus('Игра запущена. Лабиринт и танки готовы к бою.');
        }

        function endRound(alive) {
          state.countdown = 2.1;
          if (alive.length === 1) {
            var winner = alive[0];
            state.scores[winner.id] += 1;
            state.lastWinner = winner.id;
            state.message = winner.name + ' победил';
            playWinSound();
            speakText(winner.name + ' победил в раунде');
          } else {
            state.lastWinner = 0;
            state.message = 'Ничья';
            speakText('Ничья в раунде');
          }
        }

        function updateTank(tank, dt) {
          if (!tank.alive) return;
          var k = tank.keys;
          var prevX = tank.x;
          var prevY = tank.y;

          if (tank.tornadoCarry && tank.tornadoCarry.timeLeft > 0) {
            tank.tornadoCarry.timeLeft -= dt;
            var source = null;
            for (var tb = 0; tb < state.bullets.length; tb++) {
              if (!state.bullets[tb].dead && state.bullets[tb].id === tank.tornadoCarry.bulletId) {
                source = state.bullets[tb];
                break;
              }
            }
            if (source) {
              tank.tornadoCarry.spin += dt * 9;
              tank.x = source.x + Math.cos(tank.tornadoCarry.spin) * 26;
              tank.y = source.y + Math.sin(tank.tornadoCarry.spin) * 26;
              tank.angle += dt * 9;
            }
            if (!source || tank.tornadoCarry.timeLeft <= 0) {
              var lastX = source ? source.x : tank.x;
              var lastY = source ? source.y : tank.y;
              var eject = findSafeSpotNear(lastX, lastY, 90, tank.radius);
              tank.x = eject.x;
              tank.y = eject.y;
              tank.tornadoCarry = null;
              playPortalSound();
            }
            return;
          }

          if (tank.drillActive) {
            tank.drillTimer -= dt;
            if (tank.drillTimer <= 0) {
              tank.drillActive = false;
              tank.drillTimer = 0;
            }
          }

          if (tank.weapon === 'rocket' && tank.rocketAiming) {
            var aimSpeed = 260;
            var aimDX = (keysDown[k.r] ? 1 : 0) - (keysDown[k.l] ? 1 : 0);
            var aimDY = (keysDown[k.b] ? 1 : 0) - (keysDown[k.f] ? 1 : 0);
            tank.rocketAimX = clamp(tank.rocketAimX + aimDX * aimSpeed * dt, 14, WORLD_W - 14);
            tank.rocketAimY = clamp(tank.rocketAimY + aimDY * aimSpeed * dt, 14, WORLD_H - 14);
            tank.angle = Math.atan2(tank.rocketAimY - tank.y, tank.rocketAimX - tank.x);
          } else {
            if (keysDown[k.l]) tank.angle -= tank.turn * dt;
            if (keysDown[k.r]) tank.angle += tank.turn * dt;

            if (tank.drillActive) {
              var drillFrontX = tank.x + Math.cos(tank.angle) * (tank.radius + SR(11));
              var drillFrontY = tank.y + Math.sin(tank.angle) * (tank.radius + SR(11));
              breakWallsNear(drillFrontX, drillFrontY, SR(13), 9.5);
              var drillMove = (tank.speed * 0.72) * dt;
              moveBodyWithCollisions(tank, Math.cos(tank.angle) * drillMove, Math.sin(tank.angle) * drillMove, tank.radius);
              resolveDrillContact(tank);
            } else {
              var intent = (keysDown[k.f] ? 1 : 0) + (keysDown[k.b] ? -0.68 : 0);
              if (intent !== 0) {
                var speedMul = state.time < tank.slowUntil ? 0.55 : 1;
                if (state.eventName === 'speedRush' && state.eventTimeLeft > 0) speedMul *= 1.25;
                if (state.eventName === 'flood' && state.eventTimeLeft > 0) speedMul *= 0.68;
                var move = tank.speed * speedMul * intent * dt;
                moveBodyWithCollisions(tank, Math.cos(tank.angle) * move, Math.sin(tank.angle) * move, tank.radius);
              }
              if (state.eventName === 'gravity' && state.eventTimeLeft > 0) {
                var driftX = Math.sin(state.time * 2.3 + tank.id * 1.7) * SR(26) * dt;
                var driftY = Math.cos(state.time * 2.1 + tank.id * 1.3) * SR(26) * dt;
                moveBodyWithCollisions(tank, driftX, driftY, tank.radius);
              }
              if (state.eventName === 'vortex' && state.eventTimeLeft > 0) {
                var toCx = WORLD_W / 2 - tank.x;
                var toCy = WORLD_H / 2 - tank.y;
                var len = Math.max(SR(10), hypot2(toCx, toCy));
                moveBodyWithCollisions(tank, (toCx / len) * SR(36) * dt, (toCy / len) * SR(36) * dt, tank.radius);
              }
              if (state.eventName === 'slip' && state.eventTimeLeft > 0) {
                moveBodyWithCollisions(tank, Math.cos(tank.angle) * SR(22) * dt, Math.sin(tank.angle) * SR(22) * dt, tank.radius);
              }
            }
          }

          var movedDist = hypot2(tank.x - prevX, tank.y - prevY);
          if (movedDist > SR(0.9)) {
            playMoveSound();
            var backX = tank.x - Math.cos(tank.angle) * tank.radius * 0.78;
            var backY = tank.y - Math.sin(tank.angle) * tank.radius * 0.78;
            var sideX = Math.cos(tank.angle + Math.PI / 2) * tank.radius * 0.54;
            var sideY = Math.sin(tank.angle + Math.PI / 2) * tank.radius * 0.54;
            state.tankTracks.push({ x: backX + sideX, y: backY + sideY, a: tank.angle, size: tank.radius * 0.68, life: 0.45, color: 'rgba(42,46,54,0.2)' });
            state.tankTracks.push({ x: backX - sideX, y: backY - sideY, a: tank.angle, size: tank.radius * 0.68, life: 0.45, color: 'rgba(42,46,54,0.2)' });
            if (Math.random() < 0.7) {
              var smokeA = Math.random() * Math.PI * 2;
              var smokeR = tank.radius * (0.25 + Math.random() * 0.65);
              state.tankSmoke.push({
                x: tank.x + Math.cos(smokeA) * smokeR,
                y: tank.y + Math.sin(smokeA) * smokeR,
                vx: (Math.random() - 0.5) * SR(14),
                vy: (Math.random() - 0.5) * SR(14),
                r: SR(4 + Math.random() * 4),
                life: 0.7,
              });
            }
          }

          teleportEntity(tank, tank.radius);

          if (tank.weapon !== 'normal' && tank.weaponAmmo <= 0 && !(tank.weapon === 'mega' && tank.megaBulletId)) {
            tank.weaponTimer -= dt;
            if (tank.weaponTimer <= 0) {
              tank.weapon = 'normal';
              tank.weaponAmmo = 0;
              tank.weaponTimer = 0;
              tank.megaBulletId = 0;
            }
          }

          var fireRateMul = state.eventName === 'rapidFire' && state.eventTimeLeft > 0 ? 1.65 : 1;
          tank.cooldown -= dt * fireRateMul;
          var firePressed = !!keysDown[k.s];
          if (tank.weapon === 'rocket' && tank.rocketAiming) {
            if (firePressed && !tank.fireHeld && tank.cooldown <= 0) {
              shoot(tank);
            }
            tank.fireHeld = firePressed;
            return;
          }
          if (tank.weapon === 'mega') {
            if (firePressed && !tank.fireHeld && tank.cooldown <= 0) {
              shoot(tank);
            }
          } else if (firePressed && tank.cooldown <= 0) {
            shoot(tank);
          }
          tank.fireHeld = firePressed;
        }

        function reflectBullet(bullet, axis) {
          if (bullet.noBounce) {
            bullet.dead = true;
            playBulletFadeSound(bullet.kind);
            return;
          }
          if (axis === 'v') bullet.vx *= -1;
          else if (axis === 'h') bullet.vy *= -1;
          else {
            bullet.vx *= -1;
            bullet.vy *= -1;
          }
          if (state.eventName === 'ricochet' && state.eventTimeLeft > 0) {
            var bounceSpeed = Math.max(SR(120), hypot2(bullet.vx, bullet.vy) * 1.06);
            var bounceAngle = Math.atan2(bullet.vy, bullet.vx) + (Math.random() - 0.5) * 0.22;
            bullet.vx = Math.cos(bounceAngle) * bounceSpeed;
            bullet.vy = Math.sin(bounceAngle) * bounceSpeed;
          }
          playBounceSound();
          bullet.bounces += 1;
          if (bullet.bounces > bullet.maxBounces) {
            bullet.dead = true;
            playBulletFadeSound(bullet.kind);
          }
        }

        function detonateRocket(bullet) {
          if (!bullet || bullet.dead || bullet.kind !== 'rocket') return;
          bullet.dead = true;
          state.explosions.push({
            x: bullet.x,
            y: bullet.y,
            owner: bullet.owner,
            maxRadius: 118,
            radius: 32,
            life: 0.34,
            duration: 0.34,
            hit: Object.create(null)
          });
          state.flash = Math.max(state.flash, 0.16);
          playRocketBurstSound();
        }

        function updateExplosions(dt) {
          for (var e = 0; e < state.explosions.length; e++) {
            var explosion = state.explosions[e];
            explosion.life -= dt;
            var progress = 1 - clamp(explosion.life / explosion.duration, 0, 1);
            explosion.radius = explosion.maxRadius * (0.28 + progress * 0.72);

            for (var t = 0; t < state.tanks.length; t++) {
              var tank = state.tanks[t];
              if (!tank.alive) continue;
              if (tank.id === explosion.owner) continue;
              if (explosion.hit[tank.id]) continue;
              if (state.eventName === 'vortex' && state.eventTimeLeft > 0) continue;
              var d = hypot2(tank.x - explosion.x, tank.y - explosion.y);
              if (d > explosion.radius + tank.radius) continue;
              if (!explosion.ignoreLOS && !hasLineOfSight(explosion.x, explosion.y, tank.x, tank.y, 6)) continue;
              explosion.hit[tank.id] = true;
              tank.alive = false;
              state.flash = Math.max(state.flash, 0.2);
              playHitSound();
            }
          }

          state.explosions = state.explosions.filter(function (exp) {
            return exp.life > 0;
          });
        }

        function updateBullet(bullet, dt) {
          if (bullet.hitLock > 0) bullet.hitLock = Math.max(0, bullet.hitLock - dt);

          bullet.safe -= dt;
          bullet.life -= dt;
          if (bullet.kind === 'mine') {
            if (state.eventName === 'vortex' && state.eventTimeLeft > 0) return;
            for (var mi = 0; mi < state.tanks.length; mi++) {
              var mineVictim = state.tanks[mi];
              if (!mineVictim.alive || mineVictim.id === bullet.owner) continue;
              if (hypot2(mineVictim.x - bullet.x, mineVictim.y - bullet.y) <= SR(78)) {
                bullet.dead = true;
                state.explosions.push({
                  x: bullet.x,
                  y: bullet.y,
                  owner: bullet.owner,
                  maxRadius: SR(140),
                  radius: SR(36),
                  life: 0.26,
                  duration: 0.26,
                  hit: Object.create(null),
                  ignoreLOS: true
                });
                playHitSound();
                return;
              }
            }
            return;
          }

          if (state.eventName === 'gravity' && state.eventTimeLeft > 0) {
            bullet.vx += Math.sin(state.time * 3.5 + bullet.id) * SR(10) * dt;
            bullet.vy += Math.cos(state.time * 3.2 + bullet.id * 0.7) * SR(10) * dt;
          }
          if (state.eventName === 'flood' && state.eventTimeLeft > 0) {
            bullet.vx *= 1 - dt * 0.16;
            bullet.vy *= 1 - dt * 0.16;
          }
          if (state.eventName === 'ricochet' && state.eventTimeLeft > 0 && !bullet.noBounce) {
            bullet.maxBounces = Math.max(bullet.maxBounces || 0, 260);
          }
          if (bullet.kind === 'rocket') {
            if (bullet.stuck) {
              bullet.fuse -= dt;
              if (bullet.fuse <= 0) {
                detonateRocket(bullet);
                return;
              }
            } else {
              bullet.speed = Math.min(SR(230), (bullet.speed || SR(175)) + dt * SR(28));
              var rocketAngle = Math.atan2(bullet.vy, bullet.vx);
              bullet.vx = Math.cos(rocketAngle) * bullet.speed;
              bullet.vy = Math.sin(rocketAngle) * bullet.speed;
            }
          }
          if (bullet.life <= 0) {
            if (bullet.kind === 'rocket') {
              detonateRocket(bullet);
            } else {
              bullet.dead = true;
              playBulletFadeSound(bullet.kind);
            }
            return;
          }

          if (bullet.kind === 'rocket' && bullet.trail && bullet.trail.length) {
            for (var ti = 0; ti < bullet.trail.length; ti++) {
              bullet.trail[ti].life -= dt;
            }
            bullet.trail = bullet.trail.filter(function (p) { return p.life > 0; });
          }

          if (bullet.kind === 'tornado') {
            updateTornadoGuidance(bullet, dt);
          }

          var steps = Math.max(1, Math.ceil((Math.max(Math.abs(bullet.vx), Math.abs(bullet.vy)) * dt) / 3));
          var sdt = dt / steps;

          for (var i = 0; i < steps; i++) {
            var nextX = bullet.x + bullet.vx * sdt;
            var nextY = bullet.y + bullet.vy * sdt;

            if (bullet.kind === 'tornado') {
              if (nextX < bullet.radius) nextX = WORLD_W - bullet.radius;
              else if (nextX > WORLD_W - bullet.radius) nextX = bullet.radius;
              if (nextY < bullet.radius) nextY = WORLD_H - bullet.radius;
              else if (nextY > WORLD_H - bullet.radius) nextY = bullet.radius;

              bullet.x = nextX;
              bullet.y = nextY;

              for (var tw = 0; tw < state.tanks.length; tw++) {
                var victim = state.tanks[tw];
                if (!victim.alive) continue;
                if (victim.id === bullet.owner) continue;
                if (hypot2(victim.x - bullet.x, victim.y - bullet.y) <= victim.radius + bullet.radius) {
                  if (bullet.hitLock <= 0 && !victim.tornadoCarry) {
                    victim.tornadoCarry = {
                      bulletId: bullet.id,
                      timeLeft: 2.2,
                      spin: Math.random() * Math.PI * 2
                    };
                    bullet.hitLock = 0.35;
                    playTornadoHitSound();
                  }
                }
              }
              continue;
            }

            var ignoresWalls = false;
            var blockedNext = !insideWorld(nextX, nextY, bullet.radius) || (!ignoresWalls && circleHitsWall(nextX, nextY, bullet.radius));

            if (!blockedNext) {
              bullet.x = nextX;
              bullet.y = nextY;
            } else {
              if (bullet.kind === 'rocket') {
                bullet.stuck = true;
                bullet.vx = 0;
                bullet.vy = 0;
                bullet.x = clamp(bullet.x, bullet.radius, WORLD_W - bullet.radius);
                bullet.y = clamp(bullet.y, bullet.radius, WORLD_H - bullet.radius);
                break;
              }

              var blockedX = !insideWorld(nextX, bullet.y, bullet.radius) || (!ignoresWalls && circleHitsWall(nextX, bullet.y, bullet.radius));
              var blockedY = !insideWorld(bullet.x, nextY, bullet.radius) || (!ignoresWalls && circleHitsWall(bullet.x, nextY, bullet.radius));

              if (blockedX && !blockedY) {
                reflectBullet(bullet, 'v');
                bullet.x += (bullet.vx >= 0 ? 1 : -1) * 2;
                bullet.y = nextY;
              } else if (!blockedX && blockedY) {
                reflectBullet(bullet, 'h');
                bullet.x = nextX;
                bullet.y += (bullet.vy >= 0 ? 1 : -1) * 2;
              } else {
                reflectBullet(bullet, 'both');
                bullet.x += (bullet.vx >= 0 ? 1 : -1) * 2;
                bullet.y += (bullet.vy >= 0 ? 1 : -1) * 2;
              }

              var pushTries = 0;
              while (pushTries < 4 && (!insideWorld(bullet.x, bullet.y, bullet.radius) || circleHitsWall(bullet.x, bullet.y, bullet.radius))) {
                bullet.x += (bullet.vx >= 0 ? 1 : -1) * 1.5;
                bullet.y += (bullet.vy >= 0 ? 1 : -1) * 1.5;
                pushTries += 1;
              }
            }

            bullet.x = clamp(bullet.x, bullet.radius, WORLD_W - bullet.radius);
            bullet.y = clamp(bullet.y, bullet.radius, WORLD_H - bullet.radius);
            teleportEntity(bullet, bullet.radius);

            if (bullet.dead) return;

            for (var t = 0; t < state.tanks.length; t++) {
              var tank = state.tanks[t];
              if (!tank.alive) continue;
              if (bullet.kind === 'tornado' && tank.id === bullet.owner) continue;
              if (bullet.kind === 'mine' && tank.id === bullet.owner) continue;
              if (tank.id === bullet.owner && bullet.safe > 0) continue;
              if (hypot2(tank.x - bullet.x, tank.y - bullet.y) <= tank.radius + bullet.radius) {
                if (state.eventName === 'vortex' && state.eventTimeLeft > 0) continue;
                if (bullet.kind === 'tornado') {
                  if (bullet.hitLock <= 0 && !tank.tornadoCarry) {
                    tank.tornadoCarry = {
                      bulletId: bullet.id,
                      timeLeft: 2.2,
                      spin: Math.random() * Math.PI * 2
                    };
                    bullet.hitLock = 0.35;
                    playTornadoHitSound();
                  }
                  continue;
                }
                if (tank.drillActive && isHitOnShieldFront(tank, bullet.x, bullet.y)) {
                  bullet.dead = true;
                  playBulletFadeSound(bullet.kind);
                  continue;
                }
                if (bullet.kind === 'rocket') {
                  detonateRocket(bullet);
                  return;
                }
                tank.alive = false;
                bullet.dead = true;
                playBulletFadeSound(bullet.kind);
                state.flash = 0.14;
                playHitSound();
                return;
              }
            }
          }

          if (bullet.kind === 'rocket' && !bullet.dead && !bullet.stuck) {
            bullet.trail.push({ x: bullet.x, y: bullet.y, life: 0.22, size: bullet.radius });
            if (bullet.trail.length > 10) bullet.trail.shift();
          }
          if (bullet.kind === 'laser-bolt' && !bullet.dead) {
            var prevLX = bullet.x - bullet.vx * dt;
            var prevLY = bullet.y - bullet.vy * dt;
            state.laserBeams.push({
              x1: prevLX,
              y1: prevLY,
              x2: bullet.x,
              y2: bullet.y,
              life: 0.35,
              dur: 0.35,
              color: '#111'
            });
          }
        }

        function update(dt) {
          state.time += dt;
          if (state.flash > 0) state.flash = Math.max(0, state.flash - dt);
          state.eventTimer -= dt;
          if (state.eventTimeLeft > 0) {
            state.eventTimeLeft -= dt;
            if (state.eventTimeLeft <= 0) {
              state.eventName = '';
              state.eventTimeLeft = 0;
              state.eventPortalShiftTimer = 0;
            }
          }
          if (state.eventTimer <= 0) triggerEvent(true);

          if (state.eventName === 'crateRain' && state.eventTimeLeft > 0) {
            state.pickupTimer -= dt * 2.4;
            state.cameraShake = Math.max(state.cameraShake, 0.22);
          }
          state.pickupTimer -= dt;
          if (state.pickupTimer <= 0) spawnPickupIfNeeded();
          if (state.toastTimer > 0) state.toastTimer = Math.max(0, state.toastTimer - dt);
          state.chatterTimer -= dt;
          if (state.chatterTimer <= 0) {
            maybeSpeakRandomLine();
            state.chatterTimer = rand(18, 40);
          }
          if (state.cameraShake > 0) state.cameraShake = Math.max(0, state.cameraShake - dt * 1.8);

          if (state.countdown > 0) {
            state.countdown -= dt;
            if (state.countdown <= 0) {
              state.round += 1;
              startRound();
            }
            return;
          }

          for (var i = 0; i < state.tanks.length; i++) updateTank(state.tanks[i], dt);
          for (var j = 0; j < state.bullets.length; j++) {
            if (!state.bullets[j].dead) updateBullet(state.bullets[j], dt);
          }
          state.bullets = state.bullets.filter(function (b) { return !b.dead; });
          for (var lb = 0; lb < state.laserBeams.length; lb++) {
            state.laserBeams[lb].life -= dt;
          }
          state.laserBeams = state.laserBeams.filter(function (beam) { return beam.life > 0; });
          for (var tr = 0; tr < state.tankTracks.length; tr++) state.tankTracks[tr].life -= dt;
          for (var sm = 0; sm < state.tankSmoke.length; sm++) {
            var s = state.tankSmoke[sm];
            s.life -= dt;
            s.x += s.vx * dt;
            s.y += s.vy * dt;
            s.r += SR(5) * dt;
          }
          state.tankTracks = state.tankTracks.filter(function (t) { return t.life > 0; });
          state.tankSmoke = state.tankSmoke.filter(function (s) { return s.life > 0; });
          updateRocketStrikeTimers(dt);
          updateExplosions(dt);

          for (var mt = 0; mt < state.tanks.length; mt++) {
            var owner = state.tanks[mt];
            if (!owner.megaBulletId) continue;
            var megaAlive = false;
            for (var bi = 0; bi < state.bullets.length; bi++) {
              if (!state.bullets[bi].dead && state.bullets[bi].id === owner.megaBulletId) {
                megaAlive = true;
                break;
              }
            }
            if (!megaAlive) {
              owner.megaBulletId = 0;
              if (owner.weapon === 'mega' && owner.weaponAmmo <= 0) {
                owner.weapon = 'normal';
              }
            }
          }

          for (var rt = 0; rt < state.tanks.length; rt++) {
            var rocketOwner = state.tanks[rt];
            if (!rocketOwner.rocketBulletId) continue;
            var rocketAlive = false;
            for (var rbi = 0; rbi < state.bullets.length; rbi++) {
              if (!state.bullets[rbi].dead && state.bullets[rbi].id === rocketOwner.rocketBulletId) {
                rocketAlive = true;
                break;
              }
            }
            if (!rocketAlive) {
              rocketOwner.rocketBulletId = 0;
              if (rocketOwner.weapon === 'rocket' && rocketOwner.weaponAmmo <= 0) {
                rocketOwner.weapon = 'normal';
              }
            }
          }

          if (state.eventName !== 'vortex' || state.eventTimeLeft <= 0) {
            for (var p = state.pickups.length - 1; p >= 0; p--) {
              var pickup = state.pickups[p];
              var collectors = [];
              for (var pt = 0; pt < state.tanks.length; pt++) {
                var tank = state.tanks[pt];
                if (!tank.alive) continue;
                if (tank.weapon !== 'normal' && tank.weaponAmmo > 0) continue;
                if (tank.weapon === 'mega' && tank.megaBulletId) continue;
                if (hypot2(tank.x - pickup.x, tank.y - pickup.y) <= tank.radius + pickup.radius) {
                  collectors.push(tank);
                }
              }
              if (!collectors.length) continue;
              var winner = collectors[rand(0, collectors.length - 1)];
              if (collectors.length > 1) {
                var clashText = 'Спорный ящик: ' + getWeaponName(pickup.type);
                state.toastText = clashText;
                state.toastTimer = 1.6;
                speakText('Спорный бонус');
              }
              applyPickup(winner, pickup.type);
              state.pickups.splice(p, 1);
              state.pickupTimer = rand(2, 5);
            }
          }

          var alive = state.tanks.filter(function (t) { return t.alive; });
          if (alive.length <= 1) endRound(alive);
        }

        function drawBackground() {
          ctx.fillStyle = '#e7edf5';
          ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          if (state.eventName === 'flood' && state.eventTimeLeft > 0) {
            var wave = Math.sin(state.time * 2.2) * 0.5 + 0.5;
            ctx.fillStyle = 'rgba(70, 140, 190, ' + (0.07 + wave * 0.06).toFixed(3) + ')';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          } else if (state.eventName === 'speedRush' && state.eventTimeLeft > 0) {
            var rush = Math.sin(state.time * 8) * 0.5 + 0.5;
            ctx.fillStyle = 'rgba(150, 215, 255, ' + (0.04 + rush * 0.05).toFixed(3) + ')';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          } else if (state.eventName === 'rapidFire' && state.eventTimeLeft > 0) {
            var pulse = Math.sin(state.time * 12) * 0.5 + 0.5;
            ctx.fillStyle = 'rgba(186, 164, 255, ' + (0.03 + pulse * 0.06).toFixed(3) + ')';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          } else if (state.eventName === 'ricochet' && state.eventTimeLeft > 0) {
            var rc = Math.sin(state.time * 16) * 0.5 + 0.5;
            ctx.fillStyle = 'rgba(210, 255, 180, ' + (0.03 + rc * 0.05).toFixed(3) + ')';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          } else if (state.eventName === 'gravity' && state.eventTimeLeft > 0) {
            var gv = Math.sin(state.time * 5) * 0.5 + 0.5;
            ctx.fillStyle = 'rgba(150, 170, 255, ' + (0.03 + gv * 0.05).toFixed(3) + ')';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          } else if (state.eventName === 'vortex' && state.eventTimeLeft > 0) {
            var vx = Math.sin(state.time * 7) * 0.5 + 0.5;
            ctx.fillStyle = 'rgba(200, 150, 255, ' + (0.03 + vx * 0.06).toFixed(3) + ')';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          } else if (state.eventName === 'slip' && state.eventTimeLeft > 0) {
            var sl = Math.sin(state.time * 9) * 0.5 + 0.5;
            ctx.fillStyle = 'rgba(185, 245, 255, ' + (0.03 + sl * 0.05).toFixed(3) + ')';
            ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          }
        }

        function drawScores() {
          roundRect(18, 10, VIEW_W - 36, 98, 14);
          ctx.fillStyle = 'rgba(255,255,255,.22)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,.12)';
          ctx.lineWidth = 1;
          ctx.stroke();

          var cards = [
            { x: 28, y: 18, id: 1, color: players[0].color, label: players[0].name },
            { x: 390, y: 18, id: 2, color: players[1].color, label: players[1].name },
            { x: 752, y: 18, id: 3, color: players[2].color, label: players[2].name }
          ];
          ctx.textBaseline = 'middle';
          for (var i = 0; i < cards.length; i++) {
            var c = cards[i];
            roundRect(c.x, c.y, 320, 42, 13);
            ctx.fillStyle = 'rgba(255,255,255,.36)';
            ctx.fill();
            ctx.lineWidth = 1.5;
            ctx.strokeStyle = state.lastWinner === c.id ? c.color : 'rgba(0,0,0,.12)';
            ctx.stroke();

            ctx.beginPath();
            ctx.arc(c.x + 24, c.y + 21, 8, 0, Math.PI * 2);
            ctx.fillStyle = c.color;
            ctx.fill();

            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'left';
            ctx.fillStyle = '#20242a';
            ctx.fillText(c.label, c.x + 42, c.y + 21);
            ctx.font = 'bold 30px Arial';
            ctx.textAlign = 'right';
            ctx.fillText(String(state.scores[c.id]), c.x + 292, c.y + 21);
          }
        }

        function drawMessage() {
          roundRect(VIEW_W / 2 - 380, 64, 760, 40, 12);
          ctx.fillStyle = 'rgba(255,255,255,.42)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,.12)';
          ctx.stroke();
          ctx.fillStyle = '#1f2328';
          ctx.font = 'bold 22px Arial';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          var suffix = state.countdown > 0 ? ' - новый раунд через ' + Math.ceil(state.countdown) : '';
          var eventSuffix = state.eventName && state.eventTimeLeft > 0 ? ' | ' + Math.ceil(state.eventTimeLeft) + 'с' : '';
          ctx.fillText(state.message + suffix + eventSuffix, VIEW_W / 2, 84);

          if (state.toastTimer > 0 && state.toastText) {
            var a = clamp(state.toastTimer / 2.4, 0, 1);
            roundRect(VIEW_W / 2 - 330, 108, 660, 46, 12);
            ctx.fillStyle = 'rgba(25,30,35,' + (0.5 + a * 0.35).toFixed(3) + ')';
            ctx.fill();
            ctx.strokeStyle = 'rgba(255,230,120,' + (0.4 + a * 0.5).toFixed(3) + ')';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#fff6cc';
            ctx.font = 'bold 24px Arial';
            ctx.fillText(state.toastText, VIEW_W / 2, 131);
          }
        }

        function drawArena() {
          ctx.save();
          var shakeX = state.cameraShake > 0 ? (Math.random() - 0.5) * SR(10) * state.cameraShake : 0;
          var shakeY = state.cameraShake > 0 ? (Math.random() - 0.5) * SR(10) * state.cameraShake : 0;
          ctx.translate(OFFSET_X + shakeX, OFFSET_Y + shakeY);

          roundRect(-10, -10, WORLD_W + 20, WORLD_H + 20, 22);
          ctx.fillStyle = '#d7dee8';
          ctx.fill();
          ctx.strokeStyle = 'rgba(0,0,0,.16)';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = '#d6e8f7';
          ctx.fillRect(0, 0, WORLD_W, WORLD_H);

          for (var trk = 0; trk < state.tankTracks.length; trk++) {
            var track = state.tankTracks[trk];
            var ta = clamp(track.life / 0.45, 0, 1);
            ctx.save();
            ctx.translate(track.x, track.y);
            ctx.rotate(track.a);
            ctx.fillStyle = 'rgba(42,46,54,' + (0.05 + ta * 0.18).toFixed(3) + ')';
            roundRect(-track.size * 0.42, -track.size * 0.15, track.size * 0.84, track.size * 0.3, track.size * 0.07);
            ctx.fill();
            ctx.restore();
          }

          for (var sk = 0; sk < state.tankSmoke.length; sk++) {
            var sm = state.tankSmoke[sk];
            var sa = clamp(sm.life / 0.7, 0, 1);
            ctx.beginPath();
            ctx.arc(sm.x, sm.y, sm.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(70,70,70,' + (sa * 0.16).toFixed(3) + ')';
            ctx.fill();
          }

          for (var i = 0; i < state.walls.length; i++) {
            var wall = state.walls[i];
            if (!isWallIntact(wall)) {
              var restoreT = clamp((wall.destroyedUntil - state.time) / 9.5, 0, 1);
              ctx.fillStyle = 'rgba(112,108,103,' + (0.16 + (1 - restoreT) * 0.14).toFixed(3) + ')';
              ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
              continue;
            }
            ctx.fillStyle = '#605b56';
            ctx.fillRect(wall.x, wall.y, wall.w, wall.h);
          }

          for (var o = 0; o < state.obstacles.length; o++) {
            var obstacle = state.obstacles[o];
            ctx.fillStyle = '#8e877f';
            roundRect(obstacle.x, obstacle.y, obstacle.w, obstacle.h, 6);
            ctx.fill();
            ctx.strokeStyle = 'rgba(0,0,0,.2)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }

          for (var lb = 0; lb < state.laserBeams.length; lb++) {
            var beam = state.laserBeams[lb];
            var ba = clamp(beam.life / beam.dur, 0, 1);
            ctx.strokeStyle = 'rgba(0,0,0,' + (0.25 + ba * 0.45).toFixed(3) + ')';
            ctx.lineWidth = SR(4);
            ctx.beginPath();
            ctx.moveTo(beam.x1, beam.y1);
            ctx.lineTo(beam.x2, beam.y2);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(60,60,60,' + (0.3 + ba * 0.5).toFixed(3) + ')';
            ctx.lineWidth = SR(2);
            ctx.beginPath();
            ctx.moveTo(beam.x1, beam.y1);
            ctx.lineTo(beam.x2, beam.y2);
            ctx.stroke();
          }

          for (var pp = 0; pp < state.portals.length; pp++) {
            var portal = state.portals[pp];
            var wob = Math.sin(state.time * 6 + pp) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(portal.x, portal.y, portal.radius + wob * 3, 0, Math.PI * 2);
            ctx.strokeStyle = pp === 0 ? 'rgba(120, 255, 240, 0.85)' : 'rgba(255, 164, 255, 0.85)';
            ctx.lineWidth = 3;
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(portal.x, portal.y, portal.radius * 0.55, 0, Math.PI * 2);
            ctx.fillStyle = pp === 0 ? 'rgba(92, 210, 255, 0.3)' : 'rgba(234, 121, 255, 0.3)';
            ctx.fill();
          }

          for (var at = 0; at < state.tanks.length; at++) {
            var aimTank = state.tanks[at];
            if (!aimTank.alive || aimTank.weapon !== 'laser') continue;
            var aimLen = SR(380);
            var aimX1 = aimTank.x + Math.cos(aimTank.angle) * (aimTank.radius + SR(4));
            var aimY1 = aimTank.y + Math.sin(aimTank.angle) * (aimTank.radius + SR(4));
            var aimX2 = aimTank.x + Math.cos(aimTank.angle) * aimLen;
            var aimY2 = aimTank.y + Math.sin(aimTank.angle) * aimLen;
            ctx.strokeStyle = 'rgba(0,0,0,0.22)';
            ctx.lineWidth = SR(1.6);
            ctx.setLineDash([SR(6), SR(4)]);
            ctx.beginPath();
            ctx.moveTo(aimX1, aimY1);
            ctx.lineTo(aimX2, aimY2);
            ctx.stroke();
            ctx.setLineDash([]);
          }

          for (var b = 0; b < state.bullets.length; b++) {
            var bullet = state.bullets[b];
            if (bullet.kind === 'tornado') {
              var spin = state.time * 10 + b * 0.2;
              ctx.save();
              ctx.translate(bullet.x, bullet.y);
              ctx.rotate(spin);
              ctx.globalAlpha = 0.9;
              for (var sw = 0; sw < 3; sw++) {
                ctx.beginPath();
                ctx.strokeStyle = bullet.strokeColor;
                ctx.lineWidth = 1.4;
                ctx.arc(0, 0, bullet.radius - sw * 4, 0.4, Math.PI * 1.85);
                ctx.stroke();
              }
              ctx.beginPath();
              ctx.fillStyle = bullet.color;
              ctx.arc(0, 0, 3.2, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            } else if (bullet.kind === 'rocket') {
              if (bullet.trail && bullet.trail.length) {
                for (var tr = 0; tr < bullet.trail.length; tr++) {
                  var tp = bullet.trail[tr];
                  var alpha = Math.max(0, tp.life / 0.22);
                  ctx.beginPath();
                  ctx.fillStyle = 'rgba(255, 210, 120,' + (alpha * 0.22).toFixed(3) + ')';
                  ctx.arc(tp.x, tp.y, tp.size * (0.4 + alpha * 0.3), 0, Math.PI * 2);
                  ctx.fill();
                }
              }

              var rocketAng = Math.atan2(bullet.vy, bullet.vx);
              var rocketBlink = bullet.stuck ? (Math.sin(state.time * 16) * 0.5 + 0.5) : 0;
              ctx.save();
              ctx.translate(bullet.x, bullet.y);
              ctx.rotate(rocketAng);

              roundRect(-8, -2.7, 12, 5.4, 2);
              ctx.fillStyle = mixHex(bullet.color, '#d9d9d9', 0.35);
              ctx.fill();
              ctx.lineWidth = 1;
              ctx.strokeStyle = '#101214';
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(7, 0);
              ctx.lineTo(3.2, -3.5);
              ctx.lineTo(3.2, 3.5);
              ctx.closePath();
              ctx.fillStyle = '#cfd8df';
              ctx.fill();
              ctx.strokeStyle = '#101214';
              ctx.stroke();

              ctx.beginPath();
              ctx.moveTo(-7, -2);
              ctx.lineTo(-10, -4.5);
              ctx.lineTo(-6.2, -2.4);
              ctx.closePath();
              ctx.fillStyle = '#4a525a';
              ctx.fill();

              ctx.beginPath();
              ctx.moveTo(-7, 2);
              ctx.lineTo(-10, 4.5);
              ctx.lineTo(-6.2, 2.4);
              ctx.closePath();
              ctx.fillStyle = '#4a525a';
              ctx.fill();

              if (bullet.stuck) {
                ctx.beginPath();
                ctx.arc(0, 0, 10.5, 0, Math.PI * 2);
                ctx.strokeStyle = 'rgba(255, 90, 60,' + (0.35 + rocketBlink * 0.6).toFixed(3) + ')';
                ctx.lineWidth = 2;
                ctx.stroke();
              } else {
                ctx.beginPath();
                ctx.moveTo(-8, 0);
                ctx.lineTo(-12 - Math.random() * 2.4, 2.1);
                ctx.lineTo(-10.1, 0);
                ctx.lineTo(-12 - Math.random() * 2.4, -2.1);
                ctx.closePath();
                ctx.fillStyle = '#ffbc54';
                ctx.fill();

                ctx.beginPath();
                ctx.moveTo(-8.2, 0);
                ctx.lineTo(-10.8 - Math.random() * 1.4, 1.2);
                ctx.lineTo(-9.4, 0);
                ctx.lineTo(-10.8 - Math.random() * 1.4, -1.2);
                ctx.closePath();
                ctx.fillStyle = '#fff1b4';
                ctx.fill();
              }
              ctx.restore();
            } else if (bullet.kind === 'mega') {
              var megaPulse = Math.sin(state.time * 14) * 0.5 + 0.5;
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, bullet.radius + SR(3) * megaPulse, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255,220,100,' + (0.15 + megaPulse * 0.12).toFixed(3) + ')';
              ctx.fill();
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
              ctx.fillStyle = bullet.color;
              ctx.fill();
              ctx.strokeStyle = bullet.strokeColor;
              ctx.lineWidth = 2;
              ctx.stroke();
            } else if (bullet.kind === 'mega-shard') {
              var ang = Math.atan2(bullet.vy, bullet.vx);
              ctx.save();
              ctx.translate(bullet.x, bullet.y);
              ctx.rotate(ang);
              ctx.fillStyle = bullet.color;
              ctx.beginPath();
              ctx.moveTo(3.2, 0);
              ctx.lineTo(-2.4, 1.8);
              ctx.lineTo(-2.4, -1.8);
              ctx.closePath();
              ctx.fill();
              ctx.lineWidth = 1;
              ctx.strokeStyle = bullet.strokeColor;
              ctx.stroke();
              ctx.restore();
            } else if (bullet.kind === 'laser-bolt') {
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
              ctx.fillStyle = '#111';
              ctx.fill();
              ctx.strokeStyle = '#444';
              ctx.lineWidth = 1.4;
              ctx.stroke();
            } else if (bullet.kind === 'mine') {
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
              ctx.fillStyle = bullet.color;
              ctx.fill();
              ctx.strokeStyle = bullet.strokeColor;
              ctx.lineWidth = 2;
              ctx.stroke();
              var minePulse = Math.sin(state.time * 12) * 0.5 + 0.5;
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, 2.4 + minePulse * 1.8, 0, Math.PI * 2);
              ctx.fillStyle = 'rgba(255,70,70,0.9)';
              ctx.fill();
            } else {
              ctx.fillStyle = bullet.color;
              ctx.beginPath();
              ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
              ctx.fill();
              ctx.lineWidth = 1.3;
              ctx.strokeStyle = bullet.strokeColor;
              ctx.stroke();
            }
          }

          for (var rs = 0; rs < state.rocketStrikes.length; rs++) {
            var strike = state.rocketStrikes[rs];
            var pulse = Math.sin(state.time * 18) * 0.5 + 0.5;
            var strikeAlpha = clamp(strike.timer / strike.total, 0, 1);
            ctx.beginPath();
            ctx.arc(strike.x, strike.y, 18 + pulse * 4, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 96, 64,' + (0.35 + (1 - strikeAlpha) * 0.5).toFixed(3) + ')';
            ctx.lineWidth = 2.2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(strike.x - 10, strike.y);
            ctx.lineTo(strike.x + 10, strike.y);
            ctx.moveTo(strike.x, strike.y - 10);
            ctx.lineTo(strike.x, strike.y + 10);
            ctx.strokeStyle = 'rgba(255, 236, 170,' + (0.35 + pulse * 0.5).toFixed(3) + ')';
            ctx.lineWidth = 1.4;
            ctx.stroke();
          }

          for (var ta = 0; ta < state.tanks.length; ta++) {
            var aimingTank = state.tanks[ta];
            if (!aimingTank.alive || !aimingTank.rocketAiming) continue;
            var aimPulse = Math.sin(state.time * 10 + ta) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(aimingTank.rocketAimX, aimingTank.rocketAimY, 14 + aimPulse * 3, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(255, 84, 54, 0.75)';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(aimingTank.rocketAimX - 12, aimingTank.rocketAimY);
            ctx.lineTo(aimingTank.rocketAimX + 12, aimingTank.rocketAimY);
            ctx.moveTo(aimingTank.rocketAimX, aimingTank.rocketAimY - 12);
            ctx.lineTo(aimingTank.rocketAimX, aimingTank.rocketAimY + 12);
            ctx.strokeStyle = 'rgba(255, 250, 210, 0.85)';
            ctx.lineWidth = 1.6;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(aimingTank.x, aimingTank.y);
            ctx.lineTo(aimingTank.rocketAimX, aimingTank.rocketAimY);
            ctx.strokeStyle = 'rgba(255, 110, 80, 0.25)';
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }

          for (var ex = 0; ex < state.explosions.length; ex++) {
            var explosion = state.explosions[ex];
            var a = clamp(explosion.life / explosion.duration, 0, 1);
            ctx.beginPath();
            ctx.fillStyle = 'rgba(255, 176, 92,' + (0.18 * a + 0.08).toFixed(3) + ')';
            ctx.arc(explosion.x, explosion.y, explosion.radius, 0, Math.PI * 2);
            ctx.fill();

            ctx.beginPath();
            ctx.lineWidth = 2.4;
            ctx.strokeStyle = 'rgba(255, 238, 170,' + (0.62 * a).toFixed(3) + ')';
            ctx.arc(explosion.x, explosion.y, explosion.radius * 0.82, 0, Math.PI * 2);
            ctx.stroke();
          }

          for (var pk = 0; pk < state.pickups.length; pk++) {
            var pack = state.pickups[pk];
            ctx.save();
            ctx.translate(pack.x, pack.y);
            var s = pack.radius;
            roundRect(-s, -s, s * 2, s * 2, s * 0.35);
            ctx.fillStyle = '#9b6e43';
            ctx.fill();
            ctx.lineWidth = 1.4;
            ctx.strokeStyle = '#5f3f23';
            ctx.stroke();
            ctx.fillStyle = '#f7e0b5';
            drawPickupIcon(pack.type, s);
            ctx.restore();
          }

          for (var t = 0; t < state.tanks.length; t++) {
            var tank = state.tanks[t];
            if (!tank.alive) continue;
            drawTank(tank);
          }

          ctx.restore();
        }

        function drawTank(tank) {
          ctx.save();
          ctx.translate(tank.x, tank.y);
          ctx.rotate(tank.angle);
          var tankScale = tank.radius / 20;
          ctx.scale(tankScale, tankScale);

          ctx.shadowColor = 'rgba(0,0,0,0.3)';
          ctx.shadowBlur = 8;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 3;

          var baseDark = mixHex(tank.color, '#111111', 0.35);
          var baseMid = mixHex(tank.color, '#111111', 0.18);
          var baseLight = mixHex(tank.color, '#ffffff', 0.22);

          var railGrad = ctx.createLinearGradient(-20, 0, 20, 0);
          railGrad.addColorStop(0, '#2b2b2b');
          railGrad.addColorStop(0.5, '#5a5a5a');
          railGrad.addColorStop(1, '#1f1f1f');
          ctx.fillStyle = railGrad;
          roundRect(-20, -15, 40, 8, 2);
          ctx.fill();
          roundRect(-20, 7, 40, 8, 2);
          ctx.fill();

          var hullGrad = ctx.createLinearGradient(-18, -14, 18, 14);
          hullGrad.addColorStop(0, baseLight);
          hullGrad.addColorStop(0.6, baseMid);
          hullGrad.addColorStop(1, baseDark);
          ctx.fillStyle = hullGrad;
          roundRect(-18, -14, 36, 28, 4);
          ctx.fill();

          var topGrad = ctx.createLinearGradient(-14, -10, 14, 10);
          topGrad.addColorStop(0, mixHex(tank.color, '#ffffff', 0.28));
          topGrad.addColorStop(1, mixHex(tank.color, '#111111', 0.12));
          ctx.fillStyle = topGrad;
          roundRect(-14, -10, 28, 20, 3);
          ctx.fill();

          var barrelGrad = ctx.createLinearGradient(0, -3, 26, 3);
          barrelGrad.addColorStop(0, '#202020');
          barrelGrad.addColorStop(0.55, '#585858');
          barrelGrad.addColorStop(1, '#1a1a1a');
          ctx.fillStyle = barrelGrad;
          roundRect(0, -3, 26, 6, 2);
          ctx.fill();

          var turretGrad = ctx.createRadialGradient(-4, -4, 2, 0, 0, 12);
          turretGrad.addColorStop(0, mixHex(tank.color, '#ffffff', 0.32));
          turretGrad.addColorStop(0.7, mixHex(tank.color, '#111111', 0.12));
          turretGrad.addColorStop(1, mixHex(tank.color, '#111111', 0.35));
          ctx.fillStyle = turretGrad;
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#232323';
          ctx.beginPath();
          ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#5a5a5a';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.arc(0, 0, 12, 0, Math.PI * 2);
          ctx.stroke();

          ctx.shadowColor = 'transparent';
          ctx.shadowBlur = 0;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 0;

          var boltPos = [[-9, -6], [9, -6], [-9, 6], [9, 6]];
          ctx.fillStyle = '#1d1d1d';
          for (var b = 0; b < boltPos.length; b++) {
            ctx.beginPath();
            ctx.arc(boltPos[b][0], boltPos[b][1], 1.2, 0, Math.PI * 2);
            ctx.fill();
          }

          if (tank.drillActive) {
            var glow = Math.sin(state.time * 14 + tank.id) * 0.5 + 0.5;
            ctx.beginPath();
            ctx.arc(20, 0, 12, -1.05, 1.05);
            ctx.strokeStyle = 'rgba(170, 225, 255,' + (0.45 + glow * 0.35).toFixed(3) + ')';
            ctx.lineWidth = 4;
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(26, 0);
            ctx.lineTo(33 + glow * 3, 0);
            ctx.strokeStyle = '#dff8ff';
            ctx.lineWidth = 3;
            ctx.stroke();
          }

          ctx.restore();
        }

        function drawFooter() {
          ctx.fillStyle = 'rgba(30,30,30,.68)';
          ctx.font = '15px Arial';
          ctx.textAlign = 'left';
          ctx.fillText('Локальный режим: 3 игрока на одной клавиатуре', 58, VIEW_H - 28);
        }

        function drawFlash() {
          if (state.flash <= 0) return;
          ctx.save();
          ctx.globalAlpha = state.flash * 1.7;
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, VIEW_W, VIEW_H);
          ctx.restore();
        }

        function render() {
          drawBackground();
          drawScores();
          drawMessage();
          drawArena();
          drawFooter();
          drawFlash();
        }

        var lastTime = 0;
        function loop(ts) {
          if (destroyed || window.__mazeTanksRunId !== runId) return;
          if (!lastTime) lastTime = ts;
          var dt = Math.min(0.033, (ts - lastTime) / 1000);
          lastTime = ts;
          update(dt);
          render();
          animId = requestAnimationFrame(loop);
        }

        function onKeyDown(event) {
          var target = event.target;
          if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
          }
          if (!audioUnlocked) ensureAudio();
          if (usedKeys[event.code]) event.preventDefault();
          keysDown[event.code] = true;
        }

        function onKeyUp(event) {
          var target = event.target;
          if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
            return;
          }
          if (usedKeys[event.code]) event.preventDefault();
          keysDown[event.code] = false;
        }

        function onBlur() {
          keysDown = Object.create(null);
        }

        function applyPlayerNames() {
          var n1 = name1El && name1El.value ? name1El.value.trim() : '';
          var n2 = name2El && name2El.value ? name2El.value.trim() : '';
          var n3 = name3El && name3El.value ? name3El.value.trim() : '';
          players[0].name = n1 || 'Игрок 1';
          players[1].name = n2 || 'Игрок 2';
          players[2].name = n3 || 'Игрок 3';
          for (var i = 0; i < state.tanks.length; i++) {
            var t = state.tanks[i];
            for (var p = 0; p < players.length; p++) {
              if (players[p].id === t.id) t.name = players[p].name;
            }
          }
          setStatus('Имена обновлены');
        }

        function onNewRound() {
          ensureAudio();
          applyPlayerNames();
          keysDown = Object.create(null);
          lastTime = 0;
          startRound();
        }

        window.onkeydown = onKeyDown;
        window.onkeyup = onKeyUp;
        window.onblur = onBlur;
        if (roundBtn) roundBtn.onclick = onNewRound;
        if (applyNamesBtn) applyNamesBtn.onclick = applyPlayerNames;

        window.__mazeTanksApp = {
          destroy: function () {
            destroyed = true;
            window.__mazeTanksRunId = runId + 1;
            if (animId && typeof cancelAnimationFrame === 'function') cancelAnimationFrame(animId);
            if (window.onkeydown === onKeyDown) window.onkeydown = null;
            if (window.onkeyup === onKeyUp) window.onkeyup = null;
            if (window.onblur === onBlur) window.onblur = null;
            if (roundBtn) roundBtn.onclick = null;
            if (applyNamesBtn) applyNamesBtn.onclick = null;
            if (ctx && canvas) {
              try {
                ctx.setTransform(1, 0, 0, 1, 0, 0);
                ctx.clearRect(0, 0, canvas.width, canvas.height);
              } catch (e) {}
            }
          }
        };

        startMatch();
        animId = requestAnimationFrame(loop);
      } catch (e) {
        setStatus('Ошибка запуска игры: ' + (e && e.message ? e.message : e));
      }
    })();
  </script>
</body>
</html>`;

const mazeTanksHtml = part1 + part2 + part3 + part4 + part5;

export default function App() {
  return (
    <main className="min-h-screen bg-stone-200 p-4 md:p-6">
      <iframe
        title="Maze Tanks test"
        srcDoc={mazeTanksHtml}
        allow="autoplay"
        className="mx-auto block h-[92vh] w-full max-w-[1500px] rounded-xl border border-black/10 bg-white shadow-lg"
      />
    </main>
  );
}
