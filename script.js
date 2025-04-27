const DEFAULT_MAX_WEIGHTS = 40;
let countModified = false;

// DOM refs
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

// Print modal refs
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

  const inp = row.querySelector('.weight-input');
  const sel = row.querySelector('.tray-type');
  const del = row.querySelector('.delete-btn');

  // auto-select on focus
  inp.addEventListener('focus', () => inp.select());

  inp.addEventListener('input', () => {
    updateRowFilled(row);
    updateCalculations();
  });
  sel.addEventListener('change', updateCalculations);
  del.addEventListener('click', () => {
    row.remove();
    renumberRows();
    updateCalculations();
  });
}

function renumberRows() {
  Array.from(weightsContainer.children).forEach((r, i) => {
    r.querySelector('span').textContent = i + 1;
  });
}

function updateRowFilled(row) {
  const w = parseFloat(row.querySelector('.weight-input').value);
  row.setAttribute('data-filled', (!isNaN(w) && w > 0) ? 'true' : 'false');
}

function updateCalculations() {
  const count = parseInt(countInput.value, 10);
  let totalW = 0, totalTrays = 0;

  Array.from(weightsContainer.children).forEach(row => {
    const w = parseFloat(row.querySelector('.weight-input').value) || 0;
    const f = parseFloat(row.querySelector('.tray-type').value);
    updateRowFilled(row);
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
  const totalN  = (isNaN(count) || count <= 0) ? 0 : finalW * count;

  totalWeightEl.value  = totalW.toFixed(2);
  netWeightEl.value    = netW.toFixed(2);
  finalWeightEl.value  = finalW.toFixed(2);
  numberResultEl.value = totalN.toFixed(2);

  warning.style.display = (count <= 0 && !countModified) ? 'block' : 'none';
}

// auto-select count on focus
countInput.addEventListener('focus', () => countInput.select());

function generateReportString() {
  const name = tankNameInput.value || 'N/A';
  const cnt  = countInput.value  || '0';
  const tW   = totalWeightEl.value;
  const nW   = netWeightEl.value;
  const fW   = finalWeightEl.value;
  const tN   = numberResultEl.value;

  let rpt = "🦐 *Aquaculture Harvest Report* 🦐\n";
      rpt += `🏷️ Tank Name: ${name}\n`;
      rpt += `🔢 Harvest Count: ${cnt}\n`;
      rpt += `⚖️ Total Weight: ${tW} kg\n`;
      rpt += `📏 Net Weight: ${nW} kg\n`;
      rpt += `📊 Final Weight: ${fW} kg\n`;
      rpt += `🔢 Total Number: ${tN}\n\n`;
      rpt += "📋 *Batch Details:*\n";

  Array.from(weightsContainer.children).forEach((row, i) => {
    const w = parseFloat(row.querySelector('.weight-input').value) || 0;
    if (w > 0) {
      const txt = row.querySelector('.tray-type').selectedOptions[0].text;
      rpt += `${i+1}. ${w} kg (${txt})\n`;
    }
  });

  return rpt;
}

// — Event listeners —
addRowButton.addEventListener('click', () => {
  addWeightRow();
  updateCalculations();
});
countInput.addEventListener('input', () => {
  countModified = true;
  updateCalculations();
});

// Print flow
printBtn.addEventListener('click', () => {
  printOptionsModal.style.display = 'flex';
});
closePrintModal.addEventListener('click', () => {
  printOptionsModal.style.display = 'none';
});
printBWBtn.addEventListener('click', () => {
  printOptionsModal.style.display = 'none';
  generatePrintContent(false);
  setTimeout(() => window.print(), 300);
});
printColorBtn.addEventListener('click', () => {
  printOptionsModal.style.display = 'none';
  const originalTitle = document.title;
  document.title = `${tankNameInput.value || 'Untitled'} - Aquaculture Harvest Report`;
  generatePrintContent(true);
  setTimeout(() => {
    window.print();
    document.title = originalTitle;
  }, 300);
});

// WhatsApp share
whatsappBtn.addEventListener('click', () => {
  const txt = encodeURIComponent(generateReportString());
  window.open(`https://wa.me/?text=${txt}`, '_blank');
});

// Copy to clipboard
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(generateReportString())
    .then(() => alert('Report copied to clipboard!'))
    .catch(() => alert('Copy failed.'));
});

// Paste & parse
pasteBtn.addEventListener('click', async () => {
  let data = '';
  try {
    data = await navigator.clipboard.readText();
  } catch {
    data = prompt('Paste your report text here:');
  }
  if (!data) return;
  parseAndPopulate(data);
});

function parseAndPopulate(text) {
  // Tank Name
  const m1 = text.match(/🏷️\s*Tank Name:\s*(.+)/);
  if (m1) tankNameInput.value = m1[1].trim();
  // Harvest Count
  const m2 = text.match(/🔢\s*Harvest Count:\s*(\d+)/);
  if (m2) { countInput.value = m2[1]; countModified = true; }
  // Totals
  const tot  = /⚖️\s*Total Weight:\s*([\d.]+)/.exec(text);
  const net  = /📏\s*Net Weight:\s*([\d.]+)/.exec(text);
  const fin  = /📊\s*Final Weight:\s*([\d.]+)/.exec(text);
  const num  = /🔢\s*Total Number:\s*([\d.]+)/.exec(text);
  if (tot) totalWeightEl.value  = parseFloat(tot[1]).toFixed(2);
  if (net) netWeightEl.value    = parseFloat(net[1]).toFixed(2);
  if (fin) finalWeightEl.value  = parseFloat(fin[1]).toFixed(2);
  if (num) numberResultEl.value = parseFloat(num[1]).toFixed(2);

  // Batch Details
  const lines   = text.split('\n');
  const start   = lines.findIndex(l => l.includes('Batch Details'));
  const details = lines.slice(start+1).filter(l => /^\d+\./.test(l));

  weightsContainer.innerHTML = '';
  details.forEach(line => {
    const m = /^\d+\.\s*([\d.]+)\s*kg\s*\(([^)]+)\)/.exec(line);
    if (m) {
      addWeightRow();
      const last = weightsContainer.lastElementChild;
      last.querySelector('.weight-input').value = parseFloat(m[1]);
      const sel = last.querySelector('.tray-type');
      Array.from(sel.options).forEach(o => {
        if (o.text === m[2].trim()) sel.value = o.value;
      });
    }
  });

  renumberRows();
  updateCalculations();
}

// Generate hidden print pages
function generatePrintContent(colorful = false) {
  const printArea = document.getElementById('print-area');
  printArea.innerHTML = '';
  const entries = [];
  weightsContainer.querySelectorAll('.weight-row').forEach((r, i) => {
    const w = parseFloat(r.querySelector('.weight-input').value);
    if (!isNaN(w) && w > 0) {
      const tray = r.querySelector('.tray-type').selectedOptions[0].text;
      entries.push({ index: i+1, weight: w, trayType: tray });
    }
  });

  const title = "Ksheera Rama Aqua Harvest Report";
  const tank  = tankNameInput.value || "N/A";
  const cnt   = countInput.value     || "0";
  const totals = {
    totalWeight: totalWeightEl.value,
    netWeight:   netWeightEl.value,
    finalWeight: finalWeightEl.value,
    totalNumber: numberResultEl.value
  };

  if (entries.length === 0) {
    const page = document.createElement('div');
    page.className = colorful ? 'print-page colorful' : 'print-page';
    page.innerHTML = `
      <div class="print-header">
        <h1>${title}</h1>
        <div class="sub-info">Tank Name: <strong>${tank}</strong> | Harvest Count: ${cnt}</div>
      </div>
      <div class="totals-box">
        <div>Total Weight: ${totals.totalWeight} kg</div>
        <div>Net Weight: ${totals.netWeight} kg</div>
        <div>Final Weight: ${totals.finalWeight} kg</div>
        <div>Total Number: ${totals.totalNumber}</div>
      </div>
    `;
    printArea.appendChild(page);
    return;
  }

  const perPage = 80;
  const pages   = Math.ceil(entries.length / perPage);
  for (let p = 0; p < pages; p++) {
    const chunk = entries.slice(p * perPage, (p+1) * perPage);
    const page  = document.createElement('div');
    page.className = colorful ? 'print-page colorful' : 'print-page';

    const hdr = document.createElement('div');
    hdr.className = 'print-header';
    hdr.innerHTML = `
      <h1>${title}</h1>
      <div class="sub-info">Tank Name: <strong>${tank}</strong> | Harvest Count: ${cnt}</div>
    `;
    page.appendChild(hdr);

    const grid = document.createElement('div');
    grid.className = 'weights-grid';
    const perCol = 15;
    const cols   = Math.ceil(chunk.length / perCol);
    for (let c = 0; c < cols; c++) {
      const colDiv = document.createElement('div');
      colDiv.className = 'weights-column';
      for (let r = 0; r < perCol; r++) {
        const idx = c * perCol + r;
        if (idx >= chunk.length) break;
        const e = chunk[idx];
        const cell = document.createElement('div');
        cell.className = 'cell';
        cell.textContent = `${e.index}. ${e.weight} kg (${e.trayType})`;
        colDiv.appendChild(cell);
      }
      grid.appendChild(colDiv);
    }
    page.appendChild(grid);

    if (p === pages - 1) {
      const div = document.createElement('div');
      div.className = 'divider';
      page.appendChild(div);
      const tb = document.createElement('div');
      tb.className = 'totals-box';
      tb.innerHTML = `
        <div>Total Weight: ${totals.totalWeight} kg</div>
        <div>Net Weight: ${totals.netWeight} kg</div>
        <div>Final Weight: ${totals.finalWeight} kg</div>
        <div>Total Number: ${totals.totalNumber}</div>
      `;
      page.appendChild(tb);
    }

    printArea.appendChild(page);
  }
}

// Kick things off
initializeWeights();
updateCalculations();
