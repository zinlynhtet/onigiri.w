// ─── Learn Module: Blockchain Visualization & Interactive Demos ───

import './style.css';

import './style.css';

// ──────────── Translations ────────────
const translations: Record<string, Record<'en' | 'mm', string>> = {
  title: {
    en: 'Onigiri.Z <span class="tag">Learn</span>',
    mm: 'Onigiri.Z <span class="tag">လေ့လာရန်</span>'
  },
  back_btn: {
    en: '← Back to Dashboard',
    mm: '← ပင်မစာမျက်နှာသို့'
  },
  sec1_title: {
    en: 'Cryptographic Hashing',
    mm: 'Cryptographic Hashing (ကုတ်ပြောင်းခြင်း)'
  },
  sec1_desc: {
    en: 'A hash function takes any input and produces a fixed-length fingerprint. Even a tiny change in the input produces a completely different hash.',
    mm: 'Hash function ဆိုသည်မှာ မည်သည့်ဒေတာကိုမဆို ထည့်သွင်းပါက သတ်မှတ်ထားသောအရှည်ရှိသည့် ကုတ်စာသား (hash) အဖြစ် ပြောင်းလဲပေးခြင်းဖြစ်ပါသည်။ အနည်းငယ်မျှ ပြင်လိုက်လျှင်ပင် hash တစ်ခုလုံး ပြောင်းလဲသွားမည်ဖြစ်သည်။'
  },
  sec1_demo_title: {
    en: '🔐 Try It: SHA-256 Hashing',
    mm: '🔐 စမ်းကြည့်ရန်: SHA-256 Hashing'
  },
  sec1_input_label: {
    en: 'Enter any text:',
    mm: 'စာသားတစ်ခုခု ထည့်ပါ:'
  },
  sec1_hint: {
    en: 'Try changing a single character and watch the entire hash change!',
    mm: 'စာလုံးတစ်လုံးကို ပြောင်းကြည့်ပြီး hash တစ်ခုလုံး ပြောင်းလဲသွားပုံကို ကြည့်ပါ!'
  },
  sec2_title: {
    en: 'Block Structure',
    mm: 'Block Structure (ဘလောက်များ၏ ဖွဲ့စည်းပုံ)'
  },
  sec2_desc: {
    en: 'Each block contains: a list of transactions, a timestamp, the hash of the previous block, and its own hash. This forms an unbreakable chain.',
    mm: 'ဘလောက်တစ်ခုစီတိုင်းတွင် ငွေလွှဲမှတ်တမ်းများ၊ အချိန်မှတ်တမ်း၊ ယခင်ဘလောက်၏ hash နှင့် ၎င်း၏ကိုယ်ပိုင် hash တို့ပါဝင်ပါသည်။ ၎င်းက ခိုင်မာသော ကွင်းဆက်တစ်ခုကို ဖြစ်ပေါ်စေသည်။'
  },
  sec2_demo_title: {
    en: 'Interactive Block',
    mm: 'လက်တွေ့စမ်းသပ်ဘလောက်'
  },
  sec2_hint: {
    en: "Each block's hash depends on the previous block. This is what makes the chain immutable.",
    mm: 'ဘလောက်တိုင်း၏ hash သည် ယခင်ဘလောက်ပေါ်တွင် မူတည်သည်။ ၎င်းက ကွင်းဆက်ကို ပြင်ဆင်၍မရနိုင်အောင် လုပ်ဆောင်ပေးသည်။'
  },
  sec3_title: {
    en: 'Proof of Work Mining',
    mm: 'Proof of Work (တူးဖော်ခြင်း)'
  },
  sec3_desc: {
    en: "Miners must find a special number (nonce) that makes the block's hash start with a certain number of zeros. This takes computational effort, securing the network.",
    mm: 'ဘလောက်အသစ်တစ်ခုကို ကွင်းဆက်တွင်ထည့်ရန်၊ Miner များသည် ဘလောက်၏ hash တွင် သုညအရေအတွက် တစ်ခုအထိ ရရှိရန် Nonce ဟုခေါ်သော ဂဏန်းတစ်ခုကို ရှာဖွေရမည်ဖြစ်သည်။ ၎င်းသည် ကွန်ပျူတာစွမ်းအားကိုယူပြီး ကွန်ရက်ကိုလုံခြုံစေသည်။'
  },
  sec3_demo_title: {
    en: 'Mine a Block',
    mm: 'ဘလောက်ကို တူးဖော်ပါ'
  },
  sec3_data_label: {
    en: 'Block data:',
    mm: 'ဘလောက်ဒေတာ:'
  },
  sec3_diff_label: {
    en: 'Difficulty (leading zeros):',
    mm: 'အခက်အခဲ (အစပိုင်းရှိ သုညများ):'
  },
  sec3_mine_btn: {
    en: 'Start Mining',
    mm: 'တူးဖော်ခြင်းစတင်ရန်'
  },
  sec3_nonce: {
    en: 'Nonce Found',
    mm: 'တွေ့ရှိသော Nonce'
  },
  sec3_attempts: {
    en: 'Attempts',
    mm: 'ကြိုးစားမှု အရေအတွက်'
  },
  sec3_time: {
    en: 'Time',
    mm: 'ကြာချိန်'
  },
  sec3_hash_label: {
    en: 'Winning Hash (starts with zeros):',
    mm: 'အနိုင်ရသော Hash (သုညများဖြင့်စတင်သည်):'
  },
  sec3_hint: {
    en: 'Higher difficulty = more zeros required = exponentially more attempts!',
    mm: 'အခက်အခဲများလေ = သုညများများလိုလေ = ကြိုးစားရမှု ပိုများလေ ဖြစ်သည်။'
  },
  sec4_title: {
    en: 'Tamper Detection',
    mm: 'Tamper Detection (ခိုးယူပြင်ဆင်မှုကို ရှာဖွေခြင်း)'
  },
  sec4_desc: {
    en: 'If anyone tries to alter the data in a block, its hash changes, which breaks the link to the next block — making fraud immediately detectable.',
    mm: 'တစ်စုံတစ်ယောက်က ဘလောက်ရှိဒေတာကို ပြင်ဆင်ရန် ကြိုးစားပါက၊ ၎င်း၏ hash သည် ပြောင်းလဲသွားပြီး နောက်ဘလောက်သို့ ဆက်သွယ်မှုကို ပျက်စီးစေသည်။ ယင်းက လိမ်လည်မှုကို ချက်ချင်းသိသာစေသည်။'
  },
  sec4_demo_title: {
    en: 'Try Tampering',
    mm: 'ပြင်ဆင်ကြည့်ရန်'
  },
  sec4_tamper_btn: {
    en: 'Tamper with Block #1',
    mm: 'ဘလောက် #1 ကို ပြင်ဆင်ရန်'
  },
  sec4_reset_btn: {
    en: 'Reset Chain',
    mm: 'ကွင်းဆက်ကို မူလအတိုင်းထားရန်'
  },
  sec4_hint: {
    en: 'Click "Tamper" to modify Block #1\'s data and see what happens to the chain.',
    mm: 'ယခင်ဘလောက်ဒေတာအား ပြင်ဆင်လိုက်ပါက ကွင်းဆက် မည်သို့ဖြစ်သွားမည်ကို ကြည့်ရှုရန် "ပြင်ဆင်ရန်" ခလုတ်ကို နှိပ်ပါ။'
  },
  footer: {
    en: '&copy; 2026 Onigiri.Z Enterprise · Educational Visualization',
    mm: '&copy; 2026 Onigiri.Z Enterprise · ပညာပေးပုံကြမ်း'
  }
};

let currentLang: 'en' | 'mm' = 'en';
const $langToggle = document.getElementById('lang-toggle') as HTMLButtonElement;

function updateTranslations() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && translations[key]) {
      el.innerHTML = translations[key][currentLang];
    }
  });
}

if ($langToggle) {
  $langToggle.addEventListener('click', () => {
    currentLang = currentLang === 'en' ? 'mm' : 'en';
    $langToggle.textContent = currentLang === 'en' ? 'MM' : 'EN';
    updateTranslations();
  });
}

// ──────────── SHA-256 Utility ────────────
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ──────────── Section 1: Live Hashing ────────────
const $hashInput = document.getElementById('hash-input') as HTMLInputElement;
const $hashResult = document.getElementById('hash-result') as HTMLElement;

async function updateHash() {
  const hash = await sha256($hashInput.value);
  $hashResult.textContent = hash;
}
$hashInput.addEventListener('input', updateHash);
updateHash();

// ──────────── Section 2: Block Chain Visualization ────────────
interface DemoBlock {
  index: number;
  data: string;
  prevHash: string;
  hash: string;
  nonce: number;
}

async function hashBlock(index: number, data: string, prevHash: string, nonce: number): Promise<string> {
  return sha256(`${index}${data}${prevHash}${nonce}`);
}

async function buildDemoChain(): Promise<DemoBlock[]> {
  const chain: DemoBlock[] = [];
  const blocks = [
    { data: 'Genesis Block' },
    { data: 'Alice → Bob: 10 OGZ' },
    { data: 'Bob → Charlie: 5 OGZ' },
  ];

  for (let i = 0; i < blocks.length; i++) {
    const prevHash = i === 0 ? '0'.repeat(64) : chain[i - 1].hash;
    const hash = await hashBlock(i, blocks[i].data, prevHash, 0);
    chain.push({ index: i, data: blocks[i].data, prevHash, hash, nonce: 0 });
  }
  return chain;
}

function renderDemoChain(chain: DemoBlock[], container: HTMLElement) {
  container.innerHTML = '';
  chain.forEach((block, i) => {
    const el = document.createElement('div');
    el.className = 'demo-block';
    const isValid = i === 0 || block.prevHash === chain[i - 1].hash;
    if (!isValid) el.classList.add('broken');

    el.innerHTML = `
      <div class="demo-block-header">
        <span class="block-num">BLOCK #${block.index}</span>
        ${!isValid ? '<span class="broken-badge">⚠️ BROKEN</span>' : '<span class="valid-badge">✅ VALID</span>'}
      </div>
      <div class="demo-field"><span class="demo-label">Data:</span> ${block.data}</div>
      <div class="demo-field"><span class="demo-label">Nonce:</span> ${block.nonce}</div>
      <div class="demo-field"><span class="demo-label">Prev Hash:</span> <code>${block.prevHash.substring(0, 20)}…</code></div>
      <div class="demo-field"><span class="demo-label">Hash:</span> <code>${block.hash.substring(0, 20)}…</code></div>
    `;
    container.appendChild(el);

    if (i < chain.length - 1) {
      const arrow = document.createElement('div');
      arrow.className = 'chain-arrow';
      arrow.textContent = '→';
      container.appendChild(arrow);
    }
  });
}

const $demoChain = document.getElementById('demo-chain') as HTMLDivElement;
buildDemoChain().then((chain) => renderDemoChain(chain, $demoChain));

// ──────────── Section 3: Proof of Work Mining ────────────
const $powData = document.getElementById('pow-data') as HTMLInputElement;
const $powDifficulty = document.getElementById('pow-difficulty') as HTMLInputElement;
const $powDiffDisplay = document.getElementById('pow-diff-display') as HTMLSpanElement;
const $powMineBtn = document.getElementById('pow-mine-btn') as HTMLButtonElement;
const $powResult = document.getElementById('pow-result') as HTMLDivElement;
const $powNonce = document.getElementById('pow-nonce') as HTMLElement;
const $powAttempts = document.getElementById('pow-attempts') as HTMLElement;
const $powTime = document.getElementById('pow-time') as HTMLElement;
const $powHash = document.getElementById('pow-hash') as HTMLElement;
const $powLog = document.getElementById('pow-log') as HTMLDivElement;

$powDifficulty.addEventListener('input', () => {
  $powDiffDisplay.textContent = $powDifficulty.value;
});

$powMineBtn.addEventListener('click', async () => {
  $powMineBtn.disabled = true;
  $powMineBtn.textContent = 'Mining…';
  $powResult.classList.add('hidden');
  $powLog.innerHTML = '';

  const data = $powData.value;
  const diff = parseInt($powDifficulty.value);
  const target = '0'.repeat(diff);
  let nonce = 0;
  const start = performance.now();
  let hash = '';

  // Mine with visual feedback
  const mineStep = async (): Promise<void> => {
    const batchSize = 500;
    for (let i = 0; i < batchSize; i++) {
      hash = await sha256(`${data}${nonce}`);
      if (nonce < 5 || nonce % 1000 === 0) {
        const entry = document.createElement('div');
        entry.className = 'log-entry';
        entry.innerHTML = `<span class="log-nonce">Nonce ${nonce}:</span> <code>${hash.substring(0, 24)}…</code>${hash.startsWith(target) ? ' ✅' : ''}`;
        $powLog.appendChild(entry);
        if ($powLog.children.length > 12) $powLog.removeChild($powLog.children[0]);
      }
      if (hash.startsWith(target)) {
        const elapsed = ((performance.now() - start) / 1000).toFixed(3);
        $powNonce.textContent = String(nonce);
        $powAttempts.textContent = (nonce + 1).toLocaleString();
        $powTime.textContent = `${elapsed}s`;
        $powHash.textContent = hash;
        $powResult.classList.remove('hidden');
        $powMineBtn.disabled = false;
        $powMineBtn.textContent = '⛏️ Start Mining';
        return;
      }
      nonce++;
    }
    requestAnimationFrame(() => mineStep());
  };

  await mineStep();
});

// ──────────── Section 4: Tamper Detection ────────────
const $tamperChain = document.getElementById('tamper-chain') as HTMLDivElement;
const $tamperBtn = document.getElementById('tamper-btn') as HTMLButtonElement;
const $resetBtn = document.getElementById('reset-btn') as HTMLButtonElement;
const $tamperHint = document.getElementById('tamper-hint') as HTMLElement;

let tamperChain: DemoBlock[] = [];

async function initTamperChain() {
  tamperChain = await buildDemoChain();
  renderDemoChain(tamperChain, $tamperChain);
  $tamperBtn.classList.remove('hidden');
  $resetBtn.classList.add('hidden');
  $tamperHint.textContent = '💡 Click "Tamper" to modify Block #1\'s data and see what happens to the chain.';
}

initTamperChain();

$tamperBtn.addEventListener('click', async () => {
  // Tamper with block 1's data
  tamperChain[1].data = '💀 HACKED: Alice → Eve: 999 OGZ';
  tamperChain[1].hash = await hashBlock(1, tamperChain[1].data, tamperChain[1].prevHash, tamperChain[1].nonce);
  // Block 2 still points to the OLD hash of block 1, so it's now broken
  renderDemoChain(tamperChain, $tamperChain);
  $tamperBtn.classList.add('hidden');
  $resetBtn.classList.remove('hidden');
  $tamperHint.innerHTML = '🚨 <strong>Block #2 is BROKEN!</strong> Its "Previous Hash" no longer matches Block #1\'s new hash. The fraud is immediately detectable.';
  $tamperHint.style.color = '#ff4d4d';
});

$resetBtn.addEventListener('click', () => {
  $tamperHint.style.color = '';
  initTamperChain();
});
