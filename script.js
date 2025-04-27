/* Base & glassmorphism theme */
* {
  margin: 0; padding: 0; box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}
body {
  min-height: 100vh;
  background: linear-gradient(135deg, #1a4b8e, #1a4b8e);
  display: flex; align-items: center; justify-content: center;
  padding: 1rem;
  -webkit-print-color-adjust: exact;
  print-color-adjust: exact;
}
.container {
  background: rgba(255,255,255,0.1);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 2rem;
  max-width: 900px; width: 100%;
  box-shadow: 0 8px 32px rgba(0,0,0,0.1);
  border: 1px solid rgba(255,255,255,0.1);
}
.header { text-align: center; margin-bottom: 2rem; }
.header h1 {
  color: #fff; font-size: 2rem; margin-bottom: .5rem;
  display: flex; align-items: center; justify-content: center;
  gap:1rem; flex-wrap: wrap;
}
.header p { color: rgba(255,255,255,0.9); font-weight:300; font-size:.9rem; }

.input-group-row {
  display: grid; grid-template-columns: 1fr 1fr; gap:1.5rem;
  margin-bottom:2rem;
}
.input-group label {
  display:block; color: rgba(255,255,255,0.9);
  margin-bottom:.5rem; font-size:.9rem;
}
input[type="text"], input[type="number"], select {
  width:100%; padding:.8rem; border:none; border-radius:10px;
  background: rgba(255,255,255,0.1); color:#fff; font-size:1rem;
  transition:.3s;
}
input:focus, select:focus {
  outline:none; background: rgba(255,255,255,0.2);
  box-shadow: 0 0 0 2px #2a9d8f;
}
.warning {
  display:none; margin-top:1rem; font-size:.9rem;
  color:#ff6b6b; background:rgba(255,107,107,0.1);
  padding:.8rem; border-radius:10px;
}

.weights-table {
  background: rgba(255,255,255,0.05);
  border-radius:15px; padding:1rem;
  margin-bottom:1.5rem; overflow-x:auto;
}
.table-header, .weight-row {
  display: grid; grid-template-columns: 60px minmax(120px,1fr) 130px 50px;
  gap:1rem; padding:.8rem; min-width:500px;
}
.table-header { color: rgba(255,255,255,0.8); margin-bottom:.5rem; }
.weight-row {
  background: rgba(255,255,255,0.05); border-radius:10px;
  margin-bottom:.5rem; transition:.3s;
}
.weight-row input, .weight-row select {
  background: transparent; border:none; color:#fff;
}
.delete-btn {
  background:none; border:none; color:#ff6b6b; font-size:1.2rem;
  cursor:pointer; display:flex; align-items:center; justify-content:center;
}
#add-row {
  width:100%; padding:.5rem; background:#2a9d8f; color:#fff;
  border:none; border-radius:10px; font-size:1rem;
  cursor:pointer; margin-top:1rem;
}
#add-row:hover { background:#238f6a; }

.results-section {
  background: rgba(255,255,255,0.05);
  border:2px solid rgba(255,255,255,0.4);
  border-radius:15px; padding:1.5rem; margin-top:2rem;
}
.result-item {
  display:flex; justify-content:space-between; align-items:center;
  background:rgba(255,255,255,0.05); border-radius:10px;
  padding:.8rem; margin-bottom:.5rem; flex-wrap:wrap; gap:.5rem;
}
.result-item input {
  background:none; border:none; color:#fff; font-size:1rem;
  text-align:right; flex:1; width:100%;
}

.action-buttons {
  display:flex; flex-wrap:wrap; gap:1rem; justify-content:center;
  margin-top:2rem;
}
.action-buttons button {
  flex:1; min-width:200px; background:#2a9d8f; color:#fff;
  border:none; border-radius:10px; padding:.8rem 1.2rem;
  font-size:.9rem; cursor:pointer; display:flex; align-items:center;
  gap:.5rem; transition:.3s;
}
.action-buttons button:hover { background:#238f6a; }

.modal-overlay {
  position: fixed; top:0; left:0; width:100%; height:100%;
  background: rgba(0,0,0,0.6); display:none;
  align-items:center; justify-content:center; z-index:1000;
}
.modal {
  background: rgba(255,255,255,0.1); backdrop-filter: blur(15px);
  border-radius:20px; padding:1.5rem; width:90%; max-width:500px;
  box-shadow:0 8px 32px rgba(0,0,0,0.2); color:#fff;
}
.modal-header {
  display:flex; justify-content:space-between; align-items:center;
  margin-bottom:1rem;
}
.close-modal {
  background:none; border:none; color:#fff; font-size:1.5rem;
  cursor:pointer;
}
.modal-content { margin-bottom:1rem; }
.modal-actions { text-align:right; }
.modal-actions button {
  background:#2a9d8f; color:#fff; border:none;
  padding:.8rem 1.2rem; border-radius:10px; cursor:pointer;
  transition:.3s; display:inline-flex; align-items:center; gap:.5rem;
}
.modal-actions button:hover { background:#238f6a; }

/* Print Styles */
@media print {
  /* hide interactive bits */
  .action-buttons,
  #add-row,
  .delete-btn,
  .modal-overlay {
    display: none !important;
  }

  /* show print-area pages */
  #print-area { display: block; }
  #main-container, .modal-overlay { display: none; }

  /* per-page styles */
  .print-page {
    width: 210mm; min-height: 297mm; margin: 10mm auto;
    padding: 20mm; box-sizing: border-box;
    page-break-after: always; background: white;
  }
  .print-page:last-child { page-break-after: auto; }

  .print-header { text-align: center; margin-bottom: 20px; }
  .print-header h1 { font-size: 24px; margin-bottom: 5px; }
  .print-header .sub-info { font-size: 16px; }
  .print-header .sub-info strong { font-weight: bold; color: #2a9d8f; }

  .weights-grid { display: flex; gap: 10px; margin-bottom: 20px; }
  .weights-column {
    flex: 1; display: flex; flex-direction: column; gap: 4px;
  }
  .weights-column .cell {
    border: 1px solid #ccc; padding: 4px; font-size: 12px;
    min-height: 18px;
  }
  .divider { border-top: 1px dashed #000; margin: 10px 0; }
  .totals-box {
    border: 2px solid #000; padding: 10px;
    font-size: 14px; text-align: center; margin-top: 10px;
  }
  .colorful .print-header h1 { color: #e76f51; }
  .colorful .print-header .sub-info strong { color: #2a9d8f; }
  .colorful .weights-column .cell {
    border-color: #e9c46a; background: #f4a261; color: #fff;
  }
  .colorful .totals-box {
    border-color: #e9c46a; background: #f4a261; color: #fff;
  }
}
