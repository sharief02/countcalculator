const DEFAULT_MAX_WEIGHTS = 40;
let countModified = false;

// DOM Elements
const tankNameInput    = document.getElementById('tank-name');
const countInput       = document.getElementById('count');
const warning          = document.getElementById('warning');
const weightsContainer = document.getElementById('weights-container');
const addRowButton     = document.getElementById('add-row');
const printBtn         = document.getElementById('print-btn');
const whatsappBtn      = document.getElementById('whatsapp-btn');
const copyBtn          = document.getElementById('copy-btn');
const pasteBtn         = document.getElementById('paste-btn');
const totalWeightEl    = document.getElementById('total-weight');
const netWeightEl      = document.getElementById('net-weight');
const finalWeightEl    = document.getElementById('final-weight');
const numberResultEl   = document.getElementById('number-result');

// Print modal elements
const printOptionsModal = document.getElementById('print-options-modal');
const closePrintModal   = document.getElementById('close-print-modal');
const printBWBtn        = document.getElementById('print-bw');
const printColorBtn     = document.getElementById('print-color');

function initializeWeights() {
  for (let i = 0; i < DEFAULT_MAX_WEIGHTS; i++) addWeightRow();
}

function addWeightRow() {
  const row = document.createElement('div');
  row.className = 'weight-row';
  row.setAttribute('data-filled', 'false');
  row.innerHTML = `
    <span>${weightsContainer.children.length + 1}</span>
    <input type="number" class="weight-input" value="0" min="0" step="0.1">
    <select class="tray-type">
      <option value="2">Double Tray</option>
      <option value="1">Single Tray</option>
    </select>
    <button class="delete-btn">×</button>
  `;
  weightsContainer.appendChild(row);

  const weightInput = row.querySelector('.weight-input');
  const traySelect  = row.querySelector('.tray-type');
  const deleteBtn   = row.querySelector('.delete-btn');

  weightInput.addEventListener('input', () => {
    updateCalculations();
    updateRowDataFilled(row);
  });
  traySelect.addEventListener('change', updateCalculations);
  deleteBtn.addEventListener('click', () => {
    row.remove();
    updateRowNumbers();
    updateCalculations();
  });
}

function updateRowNumbers() {
  Array.from(weightsContainer.children).forEach((row, idx) => {
    row.querySelector('span').textContent = idx + 1;
  });
}

function updateRowDataFilled(row) {
  const w = parseFloat(row.querySelector('.weight-input').value);
  row.setAttribute('data-filled', w > 0 ? 'true' : 'false');
}

function updateCalculations() {
  const count = parseInt(countInput.value, 10);
  let totalW = 0, totalTrays = 0;

  Array.from(weightsContainer.children).forEach(row => {
    const w = parseFloat(row.querySelector('.weight-input').value) || 0;
    const f = parseFloat(row.querySelector('.tray-type').value);
    updateRowDataFilled(row);
    if (w > 0) {
      totalW += w;
      totalTrays += f;
      row.querySelector('.weight-input').classList.remove('invalid');
    } else {
      row.querySelector('.weight-input').classList.add('invalid');
    }
  });

  const netW    = totalTrays * 1.8;
  const finalW  = totalW - netW;
  const totalN  = (count > 0) ? finalW * count : 0;

  totalWeightEl.value = totalW.toFixed(2);
  netWeightEl.value   = netW.toFixed(2);
  finalWeightEl.value = finalW.toFixed(2);
  numberResultEl.value= totalN.toFixed(2);

  warning.style.display = (count <= 0 && !countModified) ? 'block' : 'none';
}

// Build the share/copy string
function generateReportString() {
  const name   = tankNameInput.value || 'N/A';
  const cnt    = countInput.value  || '0';
  const tW     = totalWeightEl.value;
  const nW     = netWeightEl.value;
  const fW     = finalWeightEl.value;
  const tN     = numberResultEl.value;

  let rpt = "🦐 *Aquaculture Harvest Report* 🦐\n";
  rpt += `🏷️ Tank Name: ${name}\n`;
  rpt += `🔢 Harvest Count: ${cnt}\n`;
  rpt += `⚖️ Total Weight: ${tW} kg\n`;
  rpt += `📏 Net Weight: ${nW} kg\n`;
  rpt += `📊 Final Weight: ${fW} kg\n`;
  rpt += `🔢 Total Number: ${tN}\n\n`;
  rpt += "📋 *Batch Details:*\n";

  Array.from(weightsContainer.children).forEach((row, idx) => {
    const w = parseFloat(row.querySelector('.weight-input').value);
    if (w > 0) {
      const text = row.querySelector('.tray-type')
                      .selectedOptions[0].text;
      rpt += `${idx+1}. ${w} kg (${text})\n`;
    }
  });

  return rpt;
}

// Action handlers
addRowButton.addEventListener('click', () => {
  addWeightRow();
  updateCalculations();
});

countInput.addEventListener('input', () => {
  countModified = true;
  updateCalculations();
});

// Print flows
printBtn.addEventListener('click', () => { printOptionsModal.style.display = 'flex'; });
closePrintModal.addEventListener('click', () => { printOptionsModal.style.display = 'none'; });
printBWBtn.addEventListener('click', () => {
  printOptionsModal.style.display = 'none';
  generatePrintContent(false);
  setTimeout(() => window.print(), 300);
});
printColorBtn.addEventListener('click', () => {
  printOptionsModal.style.display = 'none';
  const orig = document.title;
  document.title = `${tankNameInput.value || 'Untitled'} - Aquaculture Harvest Report`;
  generatePrintContent(true);
  setTimeout(() => {
    window.print();
    document.title = orig;
  }, 300);
});

// Whatsapp share
whatsappBtn.addEventListener('click', () => {
  const txt = encodeURIComponent(generateReportString());
  window.open(`https://wa.me/?text=${txt}`, '_blank');
});

// Copy
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(generateReportString())
    .then(() => alert('Report copied to clipboard!'))
    .catch(() => alert('Copy failed.'));
});

// Paste & parse
pasteBtn.addEventListener('click', () => {
  const input = prompt('Paste your report text here:');
  if (input) parseAndPopulate(input);
});

function parseAndPopulate(text) {
  // Tank Name
  const tM = text.match(/🏷️\s*Tank Name:\s*(.+)/);
  if (tM) tankNameInput.value = tM[1].trim();

  // Harvest Count
  const cM = text.match(/🔢\s*Harvest Count:\s*(\d+)/);
  if (cM) { countInput.value = cM[1]; countModified = true; }

  // Totals
  const tot = text.match(/⚖️\s*Total Weight:\s*([\d.]+)/);
  const net = text.match(/📏\s*Net Weight:\s*([\d.]+)/);
  const fin = text.match(/📊\s*Final Weight:\s*([\d.]+)/);
  const num = text.match(/🔢\s*Total Number:\s*([\d.]+)/);
  if (tot) totalWeightEl.value = parseFloat(tot[1]).toFixed(2);
  if (net) netWeightEl.value   = parseFloat(net[1]).toFixed(2);
  if (fin) finalWeightEl.value = parseFloat(fin[1]).toFixed(2);
  if (num) numberResultEl.value= parseFloat(num[1]).toFixed(2);

  // Batch details
  const lines = text.split('\n');
  const start = lines.findIndex(l => l.includes('Batch Details'));
  const detailLines = lines.slice(start+1).filter(l => /^\d+\./.test(l));

  // Wipe old rows
  weightsContainer.innerHTML = '';
  detailLines.forEach(line => {
    const m = line.match(/^\d+\.\s*([\d.]+)\s*kg\s*\(([^)]+)\)/);
    if (m) {
      addWeightRow();
      const last = weightsContainer.lastElementChild;
      last.querySelector('.weight-input').value = parseFloat(m[1]);
      const trayTxt = m[2].trim();
      const sel = last.querySelector('.tray-type');
      Array.from(sel.options).forEach(o => { if (o.text === trayTxt) sel.value = o.value; });
    }
  });

  updateRowNumbers();
  updateCalculations();
}

// stub: include your original generatePrintContent(colorful) here unchanged
function generatePrintContent(colorful = false) {
  /* ... existing print logic ... */
}

initializeWeights();
updateCalculations();
