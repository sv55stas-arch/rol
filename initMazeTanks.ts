type PlayerConfig = {
  id: number;
  name: string;
  color: string;
  shell: string;
  keys: {
    f: string;
    b: string;
    l: string;
    r: string;
    s: string;
  };
};

type WallSide = "top" | "right" | "bottom" | "left";

type MazeCell = {
  x: number;
  y: number;
  v: boolean;
  walls: Record<WallSide, boolean>;
};

type MazeWallRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  axis: "h" | "v";
  destroyedUntil: number;
};

type GridCellPos = {
  x: number;
  y: number;
};

type TankEntity = {
  id: number;
  name: string;
  color: string;
  shell: string;
  x: number;
  y: number;
  angle: number;
  radius: number;
  speed: number;
  turn: number;
  cooldown: number;
  weapon: string;
  weaponAmmo: number;
  weaponTimer: number;
  megaBulletId: number;
  rocketBulletId: number;
  rocketAiming: boolean;
  rocketAimX: number;
  rocketAimY: number;
  drillActive: boolean;
  drillTimer: number;
  fireHeld: boolean;
  slowUntil: number;
  alive: boolean;
  keys: PlayerConfig["keys"];
};

type BulletEntity = {
  id: number;
  owner: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  dead?: boolean;
};

type MazeState = {
  started: boolean;
  cells: unknown[];
  walls: unknown[];
  obstacles: unknown[];
  solids: unknown[];
  tanks: unknown[];
  bullets: unknown[];
  groundDecals: unknown[];
  explosions: unknown[];
  rocketStrikes: unknown[];
  pickup: unknown;
  pickupTimer: number;
  scores: Record<number, number>;
  round: number;
  countdown: number;
  message: string;
  lastWinner: number;
  flash: number;
  time: number;
};

type MazeRuntime = {
  runId: number;
  destroy: () => void;
  setStatus: (text: string) => void;
  statusEl: HTMLElement | null;
  canvas: HTMLCanvasElement | null;
  ctx: CanvasRenderingContext2D | null;
  restartBtn: HTMLButtonElement | null;
  roundBtn: HTMLButtonElement | null;
  view: { width: number; height: number };
  world: {
    cell: number;
    cols: number;
    rows: number;
    wall: number;
    width: number;
    height: number;
    offsetX: number;
    offsetY: number;
  };
  players: PlayerConfig[];
  state: MazeState;
  keysDown: Record<string, boolean>;
  animId: number;
  destroyed: boolean;
  audioCtx: AudioContext | null;
  audioUnlocked: boolean;
  maxBulletsPerTank: number;
  nextBulletId: number;
  usedKeys: Record<string, boolean>;
  groundTextures: {
    asphalt: unknown;
    stones: unknown;
  };
  utils: {
    clamp: (v: number, min: number, max: number) => number;
    hypot2: (dx: number, dy: number) => number;
    rand: (min: number, max: number) => number;
    shuffle: <T>(arr: T[]) => T[];
    roundRect: (x: number, y: number, w: number, h: number, r: number) => void;
  };
  sounds: {
    loadGroundTexture: (key: "asphalt" | "stones", url: string) => void;
    ensureAudio: () => AudioContext | null;
    playWebSound: (url: string, volume?: number, fromSec?: number, maxDurationSec?: number) => void;
    playTone: (freq: number, dur: number, type?: OscillatorType, vol?: number, endFreq?: number) => void;
    playShootSound: () => void;
    playShotgunSound: () => void;
    playRocketSound: () => void;
    playRocketBurstSound: () => void;
    playRocketLockBeep: () => void;
    playMegaLaunchSound: () => void;
    playMegaExplodeSound: () => void;
    playTornadoCastSound: () => void;
    playFireClickSound: () => void;
    playTornadoHitSound: () => void;
    playLaserSound: () => void;
    playMachinegunSound: () => void;
    playCrateSpawnSound: () => void;
    playPickupSound: () => void;
    playHitSound: () => void;
    playBulletFadeSound: (_kind: unknown) => void;
    playWinSound: () => void;
  };
  activeSfx: HTMLAudioElement[];
  worldGen: {
    makeGrid: () => MazeCell[][];
    inBounds: (x: number, y: number) => boolean;
    carveMaze: (cells: MazeCell[][]) => void;
    buildWalls: (cells: MazeCell[][]) => MazeWallRect[];
    buildObstacles: (spawnCells: GridCellPos[]) => unknown[];
    rebuildSolids: () => void;
    getOpenCells: () => GridCellPos[];
    chooseSpawnCells: (count: number) => GridCellPos[];
    cellCenter: (cell: GridCellPos) => { x: number; y: number };
  };
  combat: {
    makeTank: (def: PlayerConfig, point: { x: number; y: number }) => TankEntity;
    normAngle: (a: number) => number;
    getOwnedActiveBulletCount: (ownerId: number) => number;
    findNearestEnemy: (ownerId: number, x: number, y: number) => TankEntity | null;
    getTankById: (id: number) => TankEntity | null;
    mixHex: (colorA: string, colorB: string, t: number) => string;
    getWeaponPalette: (ownerId: number) => {
      primary: string;
      secondary: string;
      stroke: string;
      accent: string;
      flame: string;
    };
    cellFromWorld: (x: number, y: number) => GridCellPos;
    buildPathBetweenCells: (start: GridCellPos, goal: GridCellPos) => GridCellPos[] | null;
    buildRocketRoute: (fromX: number, fromY: number, toX: number, toY: number) => GridCellPos[] | null;
    hasLineOfSight: (x1: number, y1: number, x2: number, y2: number, probeRadius: number) => boolean;
    steerBulletTo: (bullet: BulletEntity, tx: number, ty: number, dt: number) => void;
  };
};

declare global {
  interface Window {
    __mazeTanksRunId?: number;
    __mazeTanksApp?: MazeRuntime;
    webkitAudioContext?: typeof AudioContext;
  }
}

function resetNode<T extends HTMLElement>(id: string): T | null {
  const node = document.getElementById(id) as T | null;
  if (!node) return null;
  const clone = node.cloneNode(true) as T;
  if (node.parentNode) node.parentNode.replaceChild(clone, node);
  return clone;
}

export function initMazeTanks() {
  if (window.__mazeTanksApp && typeof window.__mazeTanksApp.destroy === "function") {
    window.__mazeTanksApp.destroy();
  }

  const statusEl = document.getElementById("status");
  const canvas = resetNode<HTMLCanvasElement>("game");
  const restartBtn = resetNode<HTMLButtonElement>("restartBtn");
  const roundBtn = resetNode<HTMLButtonElement>("roundBtn");

  if (!canvas) {
    return { destroy: () => {} };
  }

  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return { destroy: () => {} };
  }

  const setStatus = (text: string) => {
    if (statusEl) statusEl.textContent = text;
  };

  const previousOnError = window.onerror;
  window.onerror = (message) => {
    const msg = String(message || "");
    if (msg && msg.indexOf("SecurityError") === -1 && statusEl) {
      statusEl.textContent = "Ошибка JS: " + msg;
    }
    return false;
  };

  const VIEW_W = canvas.width;
  const VIEW_H = canvas.height;

  const CELL = 96;
  const COLS = 10;
  const ROWS = 6;
  const WALL = 6;
  const WORLD_W = COLS * CELL;
  const WORLD_H = ROWS * CELL;
  const OFFSET_X = Math.round((VIEW_W - WORLD_W) / 2);
  const OFFSET_Y = 132;

  const players: PlayerConfig[] = [
    { id: 1, name: "Игрок 1", color: "#4fbf73", shell: "#7fe09d", keys: { f: "KeyW", b: "KeyS", l: "KeyA", r: "KeyD", s: "Space" } },
    {
      id: 2,
      name: "Игрок 2",
      color: "#d4524d",
      shell: "#ef8b86",
      keys: { f: "ArrowUp", b: "ArrowDown", l: "ArrowLeft", r: "ArrowRight", s: "Enter" },
    },
    { id: 3, name: "Игрок 3", color: "#315fbe", shell: "#6f97ea", keys: { f: "KeyI", b: "KeyK", l: "KeyJ", r: "KeyL", s: "KeyN" } },
  ];

  const state: MazeState = {
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
    pickup: null,
    pickupTimer: 0,
    scores: { 1: 0, 2: 0, 3: 0 },
    round: 1,
    countdown: 0,
    message: "Раунд 1",
    lastWinner: 0,
    flash: 0,
    time: 0,
  };

  const keysDown: Record<string, boolean> = Object.create(null) as Record<string, boolean>;
  let animId = 0;
  let destroyed = false;
  let audioCtx: AudioContext | null = null;
  let audioUnlocked = false;
  const MAX_BULLETS_PER_TANK = 5;
  let nextBulletId = 1;
  const runId = (window.__mazeTanksRunId || 0) + 1;
  window.__mazeTanksRunId = runId;

  const usedKeys: Record<string, boolean> = {
    Space: true,
    Enter: true,
    ArrowUp: true,
    ArrowDown: true,
    ArrowLeft: true,
    ArrowRight: true,
    KeyW: true,
    KeyS: true,
    KeyA: true,
    KeyD: true,
    KeyI: true,
    KeyK: true,
    KeyJ: true,
    KeyL: true,
    KeyN: true,
  };

  const groundTextures: { asphalt: HTMLImageElement | null; stones: HTMLImageElement | null } = {
    asphalt: null,
    stones: null,
  };

  const loadGroundTexture = (key: "asphalt" | "stones", url: string) => {
    try {
      const img = new Image();
      img.src = url;
      groundTextures[key] = img;
    } catch {
      return;
    }
  };

  loadGroundTexture("asphalt", "/images/grass-texture.jpg");

  const clamp = (v: number, min: number, max: number) => {
    return Math.max(min, Math.min(max, v));
  };

  const hypot2 = (dx: number, dy: number) => {
    return Math.sqrt(dx * dx + dy * dy);
  };

  const rand = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  const shuffle = <T,>(arr: T[]) => {
    const out = arr.slice();
    for (let i = out.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = out[i];
      out[i] = out[j];
      out[j] = t;
    }
    return out;
  };

  const roundRect = (x: number, y: number, w: number, h: number, r: number) => {
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
  };

  const ensureAudio = () => {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    if (!audioCtx) audioCtx = new Ctx();
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }
    audioUnlocked = true;
    return audioCtx;
  };

  const webSfx = {
    shoot: "https://actions.google.com/sounds/v1/weapons/gun_shooting_cocking_foam.ogg",
    hit: "https://actions.google.com/sounds/v1/weapons/explosion_hiss_bop_bang.ogg",
    roundEnd: "https://actions.google.com/sounds/v1/weapons/cocking_a_50cal_gun.ogg",
    crate: "https://actions.google.com/sounds/v1/weapons/gun_reload.ogg",
    bulletFade: "https://actions.google.com/sounds/v1/weapons/gun_drop_on_metal_grate.ogg",
  };

  const activeSfx: HTMLAudioElement[] = [];

  const playWebSound = (url: string, volume?: number, fromSec?: number, maxDurationSec?: number) => {
    if (!audioUnlocked) return;
    try {
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.volume = typeof volume === "number" ? volume : 0.35;
      audio.muted = false;
      audio.loop = false;
      if (typeof fromSec === "number") {
        audio.currentTime = fromSec;
      }
      activeSfx.push(audio);

      const cleanupAudio = () => {
        const idx = activeSfx.indexOf(audio);
        if (idx !== -1) activeSfx.splice(idx, 1);
      };

      let cutTimer = 0;
      const cutMs =
        typeof maxDurationSec === "number" && maxDurationSec > 0 ? Math.floor(maxDurationSec * 1000) : 0;
      if (cutMs > 0) {
        audio.addEventListener(
          "playing",
          () => {
            cutTimer = window.setTimeout(() => {
              try {
                audio.pause();
                audio.currentTime = 0;
              } catch {
                return;
              }
              cleanupAudio();
            }, cutMs);
          },
          { once: true }
        );
      }
      audio.addEventListener(
        "ended",
        () => {
          if (cutTimer) window.clearTimeout(cutTimer);
          cleanupAudio();
        },
        { once: true }
      );
      window.setTimeout(cleanupAudio, 4000);
      void audio.play().catch(() => {
        cleanupAudio();
      });
    } catch {
      return;
    }
  };

  const playTone = (freq: number, dur: number, type?: OscillatorType, vol?: number, endFreq?: number) => {
    const ac = ensureAudio();
    if (!ac) return;
    const now = ac.currentTime;
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = type || "sine";
    osc.frequency.setValueAtTime(freq, now);
    if (typeof endFreq === "number") {
      osc.frequency.exponentialRampToValueAtTime(Math.max(18, endFreq), now + dur);
    }
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, vol || 0.08), now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + dur);
    osc.connect(gain);
    gain.connect(ac.destination);
    osc.start(now);
    osc.stop(now + dur + 0.02);
  };

  const playShootSound = () => {
    playTone(360, 0.045, "square", 0.095, 220);
    window.setTimeout(() => {
      playTone(220, 0.08, "triangle", 0.075, 130);
    }, 12);
    window.setTimeout(() => {
      playTone(520, 0.045, "triangle", 0.05, 360);
    }, 92);
  };

  const playShotgunSound = () => {
    playShootSound();
  };

  const playRocketSound = () => {
    playShootSound();
  };

  const playRocketBurstSound = () => {
    playTone(130, 0.16, "sawtooth", 0.08, 65);
    window.setTimeout(() => {
      playTone(240, 0.08, "square", 0.05, 120);
    }, 24);
  };

  const playRocketLockBeep = () => {
    playTone(760, 0.045, "square", 0.045, 700);
  };

  const playMegaLaunchSound = () => {
    playShootSound();
  };

  const playMegaExplodeSound = () => {
    playTone(95, 0.22, "sawtooth", 0.09, 48);
    window.setTimeout(() => {
      playTone(160, 0.14, "square", 0.05, 80);
    }, 45);
  };

  const playTornadoCastSound = () => {
    playShootSound();
  };

  const playFireClickSound = () => {};

  const playTornadoHitSound = () => {
    playTone(180, 0.09, "sawtooth", 0.04, 110);
  };

  const playLaserSound = () => {
    playTone(840, 0.08, "sine", 0.04, 690);
  };

  const playMachinegunSound = () => {
    playTone(420, 0.04, "square", 0.026, 300);
  };

  const playCrateSpawnSound = () => {
    playWebSound(webSfx.crate, 0.55, 0.02, 0.35);
  };

  const playPickupSound = () => {
    playWebSound(webSfx.crate, 0.55, 0.02, 0.35);
  };

  const playHitSound = () => {
    playTone(210, 0.1, "square", 0.11, 120);
    window.setTimeout(() => {
      playTone(120, 0.18, "sawtooth", 0.09, 55);
    }, 24);
  };

  const playBulletFadeSound = (_kind: unknown) => {
    playTone(540, 0.055, "triangle", 0.065, 390);
  };

  const playWinSound = () => {
    playTone(480, 0.11, "triangle", 0.07, 620);
    window.setTimeout(() => {
      playTone(680, 0.14, "triangle", 0.075, 860);
    }, 90);
  };

  const sounds = {
    loadGroundTexture,
    ensureAudio,
    playWebSound,
    playTone,
    playShootSound,
    playShotgunSound,
    playRocketSound,
    playRocketBurstSound,
    playRocketLockBeep,
    playMegaLaunchSound,
    playMegaExplodeSound,
    playTornadoCastSound,
    playFireClickSound,
    playTornadoHitSound,
    playLaserSound,
    playMachinegunSound,
    playCrateSpawnSound,
    playPickupSound,
    playHitSound,
    playBulletFadeSound,
    playWinSound,
  };

  const makeGrid = () => {
    const cells: MazeCell[][] = [];
    for (let y = 0; y < ROWS; y += 1) {
      const row: MazeCell[] = [];
      for (let x = 0; x < COLS; x += 1) {
        row.push({
          x,
          y,
          v: true,
          walls: { top: true, right: true, bottom: true, left: true },
        });
      }
      cells.push(row);
    }
    return cells;
  };

  const inBounds = (x: number, y: number) => {
    return x >= 0 && y >= 0 && x < COLS && y < ROWS;
  };

  const carveMaze = (cells: MazeCell[][]) => {
    const stack: MazeCell[] = [];
    const start = cells[0][0];
    start.v = false;
    stack.push(start);

    while (stack.length) {
      const current = stack[stack.length - 1];
      const dirs = shuffle([
        { dx: 0, dy: -1, side: "top" as WallSide, other: "bottom" as WallSide },
        { dx: 1, dy: 0, side: "right" as WallSide, other: "left" as WallSide },
        { dx: 0, dy: 1, side: "bottom" as WallSide, other: "top" as WallSide },
        { dx: -1, dy: 0, side: "left" as WallSide, other: "right" as WallSide },
      ]);

      let moved = false;
      for (let i = 0; i < dirs.length; i += 1) {
        const d = dirs[i];
        const nx = current.x + d.dx;
        const ny = current.y + d.dy;
        if (!inBounds(nx, ny)) continue;
        const next = cells[ny][nx];
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

    let extra = 6;
    while (extra > 0) {
      const x = rand(0, COLS - 1);
      const y = rand(0, ROWS - 1);
      const choices: Array<{ dx: number; dy: number; side: WallSide; other: WallSide }> = [];
      if (x < COLS - 1 && cells[y][x].walls.right) {
        choices.push({ dx: 1, dy: 0, side: "right", other: "left" });
      }
      if (y < ROWS - 1 && cells[y][x].walls.bottom) {
        choices.push({ dx: 0, dy: 1, side: "bottom", other: "top" });
      }
      if (!choices.length) continue;
      const pick = choices[rand(0, choices.length - 1)];
      const n = cells[y + pick.dy][x + pick.dx];
      cells[y][x].walls[pick.side] = false;
      n.walls[pick.other] = false;
      extra -= 1;
    }
  };

  const buildWalls = (cells: MazeCell[][]) => {
    const hEdges: boolean[][] = [];
    const vEdges: boolean[][] = [];
    const rects: MazeWallRect[] = [];

    for (let hy = 0; hy <= ROWS; hy += 1) {
      hEdges[hy] = [];
      for (let hx = 0; hx < COLS; hx += 1) hEdges[hy][hx] = false;
    }
    for (let vy = 0; vy < ROWS; vy += 1) {
      vEdges[vy] = [];
      for (let vx = 0; vx <= COLS; vx += 1) vEdges[vy][vx] = false;
    }

    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        const cell = cells[y][x];
        if (cell.walls.top) hEdges[y][x] = true;
        if (cell.walls.bottom) hEdges[y + 1][x] = true;
        if (cell.walls.left) vEdges[y][x] = true;
        if (cell.walls.right) vEdges[y][x + 1] = true;
      }
    }

    for (let y2 = 0; y2 <= ROWS; y2 += 1) {
      let startX = -1;
      for (let x2 = 0; x2 <= COLS; x2 += 1) {
        const activeH = x2 < COLS && hEdges[y2][x2];
        if (activeH && startX === -1) startX = x2;
        if ((!activeH || x2 === COLS) && startX !== -1) {
          rects.push({
            x: startX * CELL,
            y: y2 * CELL - WALL / 2,
            w: (x2 - startX) * CELL,
            h: WALL,
            axis: "h",
            destroyedUntil: 0,
          });
          startX = -1;
        }
      }
    }

    for (let x3 = 0; x3 <= COLS; x3 += 1) {
      let startY = -1;
      for (let y3 = 0; y3 <= ROWS; y3 += 1) {
        const activeV = y3 < ROWS && vEdges[y3][x3];
        if (activeV && startY === -1) startY = y3;
        if ((!activeV || y3 === ROWS) && startY !== -1) {
          rects.push({
            x: x3 * CELL - WALL / 2,
            y: startY * CELL,
            w: WALL,
            h: (y3 - startY) * CELL,
            axis: "v",
            destroyedUntil: 0,
          });
          startY = -1;
        }
      }
    }

    return rects;
  };

  const buildObstacles = (spawnCells: GridCellPos[]) => {
    if (!spawnCells || !spawnCells.length) return [];
    return [];
  };

  const rebuildSolids = () => {
    state.solids = state.walls.concat(state.obstacles);
  };

  const getOpenCells = () => {
    const list: GridCellPos[] = [];
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        list.push({ x, y });
      }
    }
    return shuffle(list);
  };

  const chooseSpawnCells = (count: number) => {
    const all = getOpenCells();
    let minDist = 3;
    while (minDist >= 2) {
      const result: GridCellPos[] = [];
      for (let i = 0; i < all.length; i += 1) {
        const c = all[i];
        let ok = true;
        for (let j = 0; j < result.length; j += 1) {
          const dx = result[j].x - c.x;
          const dy = result[j].y - c.y;
          if (hypot2(dx, dy) < minDist) ok = false;
        }
        if (ok) result.push(c);
        if (result.length === count) return result;
      }
      minDist -= 1;
    }
    return all.slice(0, count);
  };

  const cellCenter = (cell: GridCellPos) => {
    return {
      x: cell.x * CELL + CELL / 2,
      y: cell.y * CELL + CELL / 2,
    };
  };

  const worldGen = {
    makeGrid,
    inBounds,
    carveMaze,
    buildWalls,
    buildObstacles,
    rebuildSolids,
    getOpenCells,
    chooseSpawnCells,
    cellCenter,
  };

  const makeTank = (def: PlayerConfig, point: { x: number; y: number }): TankEntity => {
    return {
      id: def.id,
      name: def.name,
      color: def.color,
      shell: def.shell,
      x: point.x,
      y: point.y,
      angle: Math.random() * Math.PI * 2,
      radius: 18,
      speed: 118,
      turn: 3.2,
      cooldown: 0.15,
      weapon: "normal",
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
      keys: def.keys,
    };
  };

  const normAngle = (a: number) => {
    let angle = a;
    while (angle > Math.PI) angle -= Math.PI * 2;
    while (angle < -Math.PI) angle += Math.PI * 2;
    return angle;
  };

  const getOwnedActiveBulletCount = (ownerId: number) => {
    const bullets = state.bullets as BulletEntity[];
    let count = 0;
    for (let i = 0; i < bullets.length; i += 1) {
      if (!bullets[i].dead && bullets[i].owner === ownerId) count += 1;
    }
    return count;
  };

  const findNearestEnemy = (ownerId: number, x: number, y: number) => {
    const tanks = state.tanks as TankEntity[];
    let nearest: TankEntity | null = null;
    let best = Infinity;
    for (let i = 0; i < tanks.length; i += 1) {
      const t = tanks[i];
      if (!t.alive || t.id === ownerId) continue;
      const d = hypot2(t.x - x, t.y - y);
      if (d < best) {
        best = d;
        nearest = t;
      }
    }
    return nearest;
  };

  const getTankById = (id: number) => {
    const tanks = state.tanks as TankEntity[];
    for (let i = 0; i < tanks.length; i += 1) {
      if (tanks[i].id === id) return tanks[i];
    }
    return null;
  };

  const mixHex = (colorA: string, colorB: string, t: number) => {
    const a = String(colorA || "").replace("#", "");
    const b = String(colorB || "").replace("#", "");
    if (a.length !== 6 || b.length !== 6) return colorA;
    const ar = Number.parseInt(a.slice(0, 2), 16);
    const ag = Number.parseInt(a.slice(2, 4), 16);
    const ab = Number.parseInt(a.slice(4, 6), 16);
    const br = Number.parseInt(b.slice(0, 2), 16);
    const bg = Number.parseInt(b.slice(2, 4), 16);
    const bb = Number.parseInt(b.slice(4, 6), 16);
    const r = Math.round(ar + (br - ar) * t);
    const g = Math.round(ag + (bg - ag) * t);
    const bl = Math.round(ab + (bb - ab) * t);
    const hex = (n: number) => {
      const s = Math.max(0, Math.min(255, n)).toString(16);
      return s.length === 1 ? `0${s}` : s;
    };
    return `#${hex(r)}${hex(g)}${hex(bl)}`;
  };

  const getWeaponPalette = (ownerId: number) => {
    const tank = getTankById(ownerId);
    const primary = tank ? tank.color : "#9aa0aa";
    const secondary = tank ? tank.shell : "#c7d0de";
    return {
      primary,
      secondary,
      stroke: mixHex(primary, "#111111", 0.45),
      accent: mixHex(secondary, "#ffffff", 0.35),
      flame: mixHex(secondary, "#ffd66b", 0.38),
    };
  };

  const cellFromWorld = (x: number, y: number) => {
    return {
      x: clamp(Math.floor(x / CELL), 0, COLS - 1),
      y: clamp(Math.floor(y / CELL), 0, ROWS - 1),
    };
  };

  const buildPathBetweenCells = (start: GridCellPos, goal: GridCellPos) => {
    const key = (c: GridCellPos) => `${c.x}:${c.y}`;
    const startKey = key(start);
    const goalKey = key(goal);
    if (startKey === goalKey) return [start];

    const queue: GridCellPos[] = [start];
    let head = 0;
    const visited: Record<string, boolean> = Object.create(null) as Record<string, boolean>;
    const prev: Record<string, GridCellPos> = Object.create(null) as Record<string, GridCellPos>;
    visited[startKey] = true;

    while (head < queue.length) {
      const cur = queue[head];
      head += 1;
      const cells = state.cells as MazeCell[][];
      const cell = cells[cur.y] && cells[cur.y][cur.x];
      if (!cell) continue;

      const neighbors: GridCellPos[] = [];
      if (!cell.walls.top && cur.y > 0) neighbors.push({ x: cur.x, y: cur.y - 1 });
      if (!cell.walls.right && cur.x < COLS - 1) neighbors.push({ x: cur.x + 1, y: cur.y });
      if (!cell.walls.bottom && cur.y < ROWS - 1) neighbors.push({ x: cur.x, y: cur.y + 1 });
      if (!cell.walls.left && cur.x > 0) neighbors.push({ x: cur.x - 1, y: cur.y });

      for (let i = 0; i < neighbors.length; i += 1) {
        const n = neighbors[i];
        const nk = key(n);
        if (visited[nk]) continue;
        visited[nk] = true;
        prev[nk] = cur;
        if (nk === goalKey) {
          const path: GridCellPos[] = [n];
          let walk: GridCellPos | null = cur;
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
  };

  const buildRocketRoute = (fromX: number, fromY: number, toX: number, toY: number) => {
    const start = cellFromWorld(fromX, fromY);
    const goal = cellFromWorld(toX, toY);
    return buildPathBetweenCells(start, goal);
  };

  const circleHitsWall = (_x: number, _y: number, _radius: number) => {
    return false;
  };

  const hasLineOfSight = (x1: number, y1: number, x2: number, y2: number, probeRadius: number) => {
    const dist = hypot2(x2 - x1, y2 - y1);
    const steps = Math.max(1, Math.ceil(dist / 10));
    for (let i = 1; i <= steps; i += 1) {
      const t = i / steps;
      const px = x1 + (x2 - x1) * t;
      const py = y1 + (y2 - y1) * t;
      if (circleHitsWall(px, py, probeRadius)) return false;
    }
    return true;
  };

  const steerBulletTo = (bullet: BulletEntity, tx: number, ty: number, dt: number) => {
    const currentAngle = Math.atan2(bullet.vy, bullet.vx);
    const targetAngle = Math.atan2(ty - bullet.y, tx - bullet.x);
    const diff = normAngle(targetAngle - currentAngle);
    const maxTurn = ((bullet as BulletEntity & { turnRate?: number }).turnRate || 0) * dt;
    const nextAngle = currentAngle + clamp(diff, -maxTurn, maxTurn);
    const speed = (bullet as BulletEntity & { speed?: number }).speed || 132;
    bullet.vx = Math.cos(nextAngle) * speed;
    bullet.vy = Math.sin(nextAngle) * speed;
  };

  const combat = {
    makeTank,
    normAngle,
    getOwnedActiveBulletCount,
    findNearestEnemy,
    getTankById,
    mixHex,
    getWeaponPalette,
    cellFromWorld,
    buildPathBetweenCells,
    buildRocketRoute,
    hasLineOfSight,
    steerBulletTo,
  };

  const initialCells = makeGrid();
  carveMaze(initialCells);
  const spawnCells = chooseSpawnCells(players.length);
  state.cells = initialCells;
  state.walls = buildWalls(initialCells);
  state.obstacles = buildObstacles(spawnCells);
  rebuildSolids();

  const onRestart = () => {
    nextBulletId = 1;
    setStatus("Новый матч");
  };

  const onRound = () => {
    state.round += 1;
    state.message = `Раунд ${state.round}`;
    setStatus(state.message);
  };

  restartBtn?.addEventListener("click", onRestart);
  roundBtn?.addEventListener("click", onRound);
  setStatus(state.message);

  const runtime: MazeRuntime = {
    runId,
    destroy: () => {
      if (destroyed) return;
      destroyed = true;
      if (animId) cancelAnimationFrame(animId);
      restartBtn?.removeEventListener("click", onRestart);
      roundBtn?.removeEventListener("click", onRound);
      window.onerror = previousOnError;
    },
    setStatus,
    statusEl,
    canvas,
    ctx,
    restartBtn,
    roundBtn,
    view: { width: VIEW_W, height: VIEW_H },
    world: {
      cell: CELL,
      cols: COLS,
      rows: ROWS,
      wall: WALL,
      width: WORLD_W,
      height: WORLD_H,
      offsetX: OFFSET_X,
      offsetY: OFFSET_Y,
    },
    players,
    state,
    keysDown,
    animId,
    destroyed,
    audioCtx,
    audioUnlocked,
    maxBulletsPerTank: MAX_BULLETS_PER_TANK,
    nextBulletId,
    usedKeys,
    groundTextures,
    utils: {
      clamp,
      hypot2,
      rand,
      shuffle,
      roundRect,
    },
    sounds,
    activeSfx,
    worldGen,
    combat,
  };

  window.__mazeTanksApp = runtime;
  return runtime;
}
