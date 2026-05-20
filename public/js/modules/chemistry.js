/* chemistry.js - Módulo de Química (Tabla Periódica CSS Grid & Balanceador por Tanteo) */

// Base de datos estática de los elementos clave de la tabla periódica
const chemicalElements = [
  { num: 1, sym: "H", name: "Hidrógeno", mass: "1.008", row: 1, col: 1, cat: "No metal", state: "Gas", config: "1s¹", color: "#3b82f6", desc: "El elemento más abundante en el universo. Es altamente inflamable y forma agua al combinarse con oxígeno." },
  { num: 2, sym: "He", name: "Helio", mass: "4.0026", row: 1, col: 18, cat: "Gas Noble", state: "Gas", config: "1s²", color: "#ec4899", desc: "Gas inerte, incoloro e inodoro. Se utiliza en globos aerostáticos, criogenia y para enfriar imanes superconductores." },
  { num: 3, sym: "Li", name: "Litio", mass: "6.94", row: 2, col: 1, cat: "Metal Alcalino", state: "Sólido", config: "[He] 2s¹", color: "#ef4444", desc: "El metal más ligero. Reacciona vigorosamente con el agua y es el componente principal de las baterías recargables modernas." },
  { num: 4, sym: "Be", name: "Berilio", mass: "9.0122", row: 2, col: 2, cat: "Alcalinotérreo", state: "Sólido", config: "[He] 2s²", color: "#f97316", desc: "Metal raro y fuerte de color gris. Se emplea en aleaciones aeroespaciales debido a su alta resistencia y ligereza." },
  { num: 5, sym: "B", name: "Boro", mass: "10.81", row: 2, col: 13, cat: "Metaloide", state: "Sólido", config: "[He] 2s² 2p¹", color: "#eab308", desc: "Metaloide semiconductor. Es un ingrediente fundamental en la fabricación de vidrios de borosilicato (Pyrex) y cerámicas." },
  { num: 6, sym: "C", name: "Carbono", mass: "12.011", row: 2, col: 14, cat: "No metal", state: "Sólido", config: "[He] 2s² 2p²", color: "#3b82f6", desc: "La base de la química orgánica y de toda la vida conocida. Puede existir en forma de grafito suave o diamante ultraduro." },
  { num: 7, sym: "N", name: "Nitrógeno", mass: "14.007", row: 2, col: 15, cat: "No metal", state: "Gas", config: "[He] 2s² 2p³", color: "#3b82f6", desc: "Constituye aproximadamente el 78% del aire de la atmósfera terrestre. Crucial para fertilizantes y refrigerantes líquidos." },
  { num: 8, sym: "O", name: "Oxígeno", mass: "15.999", row: 2, col: 16, cat: "No metal", state: "Gas", config: "[He] 2s² 2p⁴", color: "#3b82f6", desc: "Gas altamente reactivo indispensable para la respiración celular de los seres vivos y soporte de los procesos de combustión." },
  { num: 9, sym: "F", name: "Flúor", mass: "18.998", row: 2, col: 17, cat: "Halógeno", state: "Gas", config: "[He] 2s² 2p⁵", color: "#a855f7", desc: "El elemento más reactivo y electronegativo de todos. Se utiliza en pastas dentales para prevenir las caries dentales." },
  { num: 10, sym: "Ne", name: "Neón", mass: "20.180", row: 2, col: 18, cat: "Gas Noble", state: "Gas", config: "[He] 2s² 2p⁶", color: "#ec4899", desc: "Famoso por su uso en letreros luminosos publicitarios de color rojo-anaranjado brillante gracias a las descargas eléctricas." },
  { num: 11, sym: "Na", name: "Sodio", mass: "22.990", row: 3, col: 1, cat: "Metal Alcalino", state: "Sólido", config: "[Ne] 3s¹", color: "#ef4444", desc: "Metal blando y sumamente reactivo. Al reaccionar con el flúor o cloro, da origen a la sal común que usamos a diario." },
  { num: 12, sym: "Mg", name: "Magnesio", mass: "24.305", row: 3, col: 2, cat: "Alcalinotérreo", state: "Sólido", config: "[Ne] 3s²", color: "#f97316", desc: "Metal ligero imprescindible en aleaciones de ingeniería y esencial para la fotosíntesis en las plantas (clorofila)." },
  { num: 13, sym: "Al", name: "Aluminio", mass: "26.982", row: 3, col: 13, cat: "Metal Pobre", state: "Sólido", config: "[Ne] 3s² 3p¹", color: "#84cc16", desc: "El metal más abundante de la corteza terrestre. Excelente conductor, muy liviano y resistente a la corrosión." },
  { num: 14, sym: "Si", name: "Silicio", mass: "28.085", row: 3, col: 14, cat: "Metaloide", state: "Sólido", config: "[Ne] 3s² 3p²", color: "#eab308", desc: "El corazón de los microprocesadores y la electrónica moderna en Silicon Valley. Segundo elemento más abundante de la Tierra." },
  { num: 15, sym: "P", name: "Fósforo", mass: "30.974", row: 3, col: 15, cat: "No metal", state: "Sólido", config: "[Ne] 3s² 3p³", color: "#3b82f6", desc: "Altamente reactivo, nunca se encuentra libre en la naturaleza. Forma parte de la molécula de la vida, el ADN y ATP." },
  { num: 16, sym: "S", name: "Azufre", mass: "32.06", row: 3, col: 16, cat: "No metal", state: "Sólido", config: "[Ne] 3s² 3p⁴", color: "#3b82f6", desc: "Sólido amarillo con un olor penetrante característico (a huevos podridos al combinarse con hidrógeno). Usado en pólvora." },
  { num: 17, sym: "Cl", name: "Cloro", mass: "35.45", row: 3, col: 17, cat: "Halógeno", state: "Gas", config: "[Ne] 3s² 3p⁵", color: "#a855f7", desc: "Gas amarillo-verdoso tóxico usado principalmente como agente desinfectante en piscinas y purificadoras de agua de grifo." },
  { num: 18, sym: "Ar", name: "Argón", mass: "39.948", row: 3, col: 18, cat: "Gas Noble", state: "Gas", config: "[Ne] 3s² 3p⁶", color: "#ec4899", desc: "El tercer gas más común en la atmósfera de la Tierra. Muy útil para atmósferas protectoras en soldaduras industriales." },
  { num: 19, sym: "K", name: "Potasio", mass: "39.098", row: 4, col: 1, cat: "Metal Alcalino", state: "Sólido", config: "[Ar] 4s¹", color: "#ef4444", desc: "Metal alcalino esencial para el correcto funcionamiento del sistema nervioso. Los plátanos son ricos en potasio." },
  { num: 20, sym: "Ca", name: "Calcio", mass: "40.078", row: 4, col: 2, cat: "Alcalinotérreo", state: "Sólido", config: "[Ar] 4s²", color: "#f97316", desc: "El mineral más abundante en el cuerpo humano, fundamental para la rigidez estructural de los huesos y dientes." },
  { num: 26, sym: "Fe", name: "Hierro", mass: "55.845", row: 4, col: 8, cat: "Metal de Transición", state: "Sólido", config: "[Ar] 3d⁶ 4s²", color: "#06b6d4", desc: "El metal industrial por excelencia empleado para construir estructuras de acero. Transporta el oxígeno en nuestra sangre." },
  { num: 29, sym: "Cu", name: "Cobre", mass: "63.546", row: 4, col: 11, cat: "Metal de Transición", state: "Sólido", config: "[Ar] 3d¹⁰ 4s¹", color: "#06b6d4", desc: "Metal rojizo dúctil y maleable de altísima conductividad eléctrica, ideal para cables eléctricos y tuberías de agua." },
  { num: 30, sym: "Zn", name: "Zinc", mass: "65.38", row: 4, col: 12, cat: "Metal de Transición", state: "Sólido", config: "[Ar] 3d¹⁰ 4s²", color: "#06b6d4", desc: "Metal azulado resistente a la corrosión. Muy usado en el proceso de galvanización del hierro para evitar la oxidación." },
  { num: 47, sym: "Ag", name: "Plata", mass: "107.87", row: 5, col: 11, cat: "Metal de Transición", state: "Sólido", config: "[Kr] 4d¹⁰ 5s¹", color: "#06b6d4", desc: "Posee la mayor conductividad eléctrica y térmica de todos los metales. Altamente valorado en joyería y espejos." },
  { num: 79, sym: "Au", name: "Oro", mass: "196.97", row: 6, col: 11, cat: "Metal de Transición", state: "Sólido", config: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", color: "#06b6d4", desc: "El metal precioso más codiciado por su belleza, color amarillo brillante, resistencia a la oxidación e inalterabilidad química." }
];

function initChemistryModule() {
  // 1. Renderizar la Tabla Periódica en CSS Grid
  renderPeriodicTable();

  // 2. Escuchar evento de clic en el balanceador
  const btnBalance = document.getElementById('btn-chem-balance');
  if (btnBalance) {
    btnBalance.addEventListener('click', balanceEquation);
  }

  const inputEq = document.getElementById('chem-equation-input');
  if (inputEq) {
    inputEq.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') balanceEquation();
    });
  }
}

function renderPeriodicTable() {
  const gridContainer = document.getElementById('periodic-table-grid');
  if (!gridContainer) return;

  gridContainer.innerHTML = '';

  chemicalElements.forEach(elem => {
    const elemDiv = document.createElement('div');
    elemDiv.className = 'periodic-element-btn';
    elemDiv.style.gridRow = elem.row;
    elemDiv.style.gridColumn = elem.col;
    elemDiv.style.background = elem.color;
    elemDiv.style.border = '1px solid var(--border-color)';
    elemDiv.style.borderRadius = '4px';
    elemDiv.style.padding = '4px';
    elemDiv.style.color = '#fff';
    elemDiv.style.display = 'flex';
    elemDiv.style.flexDirection = 'column';
    elemDiv.style.justifyContent = 'space-between';
    elemDiv.style.aspectRatio = '1';
    elemDiv.style.cursor = 'pointer';
    elemDiv.style.fontSize = '0.75rem';
    elemDiv.style.fontWeight = 'bold';
    elemDiv.style.transition = 'all var(--transition-fast)';

    elemDiv.innerHTML = `
      <span style="font-size: 0.55rem; line-height: 1; opacity: 0.85;">${elem.num}</span>
      <span style="font-size: 0.95rem; text-align: center; font-weight: 800; line-height: 1; margin: 1px 0;">${elem.sym}</span>
      <span style="font-size: 0.5rem; text-align: center; text-transform: uppercase; font-weight: normal; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; opacity: 0.95;">${elem.name}</span>
    `;

    elemDiv.addEventListener('mouseenter', () => {
      elemDiv.style.transform = 'scale(1.1)';
      elemDiv.style.zIndex = '10';
      elemDiv.style.boxShadow = `0 4px 12px ${elem.color}50`;
    });

    elemDiv.addEventListener('mouseleave', () => {
      elemDiv.style.transform = 'none';
      elemDiv.style.zIndex = '1';
      elemDiv.style.boxShadow = 'none';
    });

    elemDiv.addEventListener('click', () => {
      showElementDetails(elem);
    });

    gridContainer.appendChild(elemDiv);
  });
}

function showElementDetails(elem) {
  const emptyCard = document.getElementById('chem-card-empty');
  const fullCard = document.getElementById('chem-card-full');

  if (!emptyCard || !fullCard) return;

  emptyCard.classList.add('hidden');
  fullCard.classList.remove('hidden');

  // Rellenar visualizador
  const visual = document.getElementById('chem-card-visual');
  visual.style.background = elem.color;
  visual.style.boxShadow = `0 8px 24px ${elem.color}40`;
  
  document.getElementById('chem-card-number').innerText = elem.num;
  document.getElementById('chem-card-symbol').innerText = elem.sym;
  document.getElementById('chem-card-mass').innerText = elem.mass;

  // Datos de texto
  document.getElementById('chem-card-name').innerText = elem.name;
  document.getElementById('chem-card-category').innerText = elem.cat;
  document.getElementById('chem-card-group').innerText = elem.col;
  document.getElementById('chem-card-period').innerText = elem.row;
  document.getElementById('chem-card-state').innerText = elem.state;
  document.getElementById('chem-card-config').innerText = elem.config;
  document.getElementById('chem-card-desc').innerText = elem.desc;
}

async function balanceEquation() {
  const input = document.getElementById('chem-equation-input');
  if (!input) return;

  const equation = input.value.trim();
  if (equation.length < 3) {
    alert('Por favor, ingresa una ecuación química válida (ej. H2 + O2 = H2O).');
    return;
  }

  const loader = document.getElementById('chem-balance-loader');
  const results = document.getElementById('chem-balance-results');
  const btn = document.getElementById('btn-chem-balance');

  if (loader) loader.classList.remove('hidden');
  if (results) results.classList.add('hidden');
  if (btn) btn.disabled = true;

  try {
    const response = await fetch('/api/chemistry/balance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ equation: equation }),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con la API de IA');
    }

    const data = await response.json();

    // Rellenar respuesta balanceada en KaTeX
    const balancedText = document.getElementById('chem-balanced-text');
    balancedText.innerHTML = `\\( ${data.balanced_equation} \\)`;

    // Rellenar pasos
    const stepsContainer = document.getElementById('chem-balance-steps');
    stepsContainer.innerHTML = '';

    data.steps.forEach(step => {
      const stepDiv = document.createElement('div');
      stepDiv.className = 'glass-panel';
      stepDiv.style.padding = '0.9rem 1.2rem';
      stepDiv.style.background = 'var(--bg-primary)';
      stepDiv.style.border = '1px solid var(--border-color)';
      stepDiv.style.borderRadius = 'var(--radius-md)';
      stepDiv.style.fontSize = '0.85rem';
      stepDiv.style.lineHeight = '1.6';

      stepDiv.innerHTML = `
        <span style="font-weight: 700; color: var(--primary); display: block; margin-bottom: 0.25rem;">Paso ${step.step_number}</span>
        <span>${step.description}</span>
      `;
      stepsContainer.appendChild(stepDiv);
    });

    // Ley de conservación
    document.getElementById('chem-balance-law').innerHTML = `<strong>Fundamento Teórico:</strong> ${data.explanation}`;

    // Renderizar KaTeX en los resultados
    if (window.renderMathInElement) {
      window.renderMathInElement(results, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }

    // Mostrar resultados
    loader.classList.add('hidden');
    results.classList.remove('hidden');
    
    // Incrementar en localStorage
    if (window.incrementExercisesCompleted) {
      window.incrementExercisesCompleted();
    }

  } catch (error) {
    console.error('Error en Chemistry Module:', error);
    if (loader) loader.classList.add('hidden');
    alert('⚠️ Ocurrió un error al balancear la ecuación. Asegúrate de ingresar una sintaxis reconocible (ej: Fe + O2 = Fe2O3) y que tu API Key sea válida.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Exponer globalmente
window.initChemistryModule = initChemistryModule;
