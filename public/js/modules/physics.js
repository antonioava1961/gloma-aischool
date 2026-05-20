/* physics.js - Módulo de Física Desglosada (Datos -> Fórmula -> Sustitución -> Resultado) */

let activePhysicsProblem = null;

function initPhysicsModule() {
  const btnGenerate = document.getElementById('btn-physics-generate');
  
  if (btnGenerate) {
    btnGenerate.addEventListener('click', generatePhysicsProblem);
  }

  // Registrar listeners de clic para revelar las tarjetas de los 4 pasos
  setupStepCard('card-phys-datos', 'content-phys-datos', 'placeholder-phys-datos', 'datos');
  setupStepCard('card-phys-formula', 'content-phys-formula', 'placeholder-phys-formula', 'formula');
  setupStepCard('card-phys-sustitucion', 'content-phys-sustitucion', 'placeholder-phys-sustitucion', 'sustitucion');
  setupStepCard('card-phys-resultado', 'content-phys-resultado', 'placeholder-phys-resultado', 'resultado');
}

function setupStepCard(cardId, contentId, placeholderId, dataKey) {
  const card = document.getElementById(cardId);
  if (!card) return;

  card.addEventListener('click', () => {
    if (!activePhysicsProblem) return;

    const contentEl = document.getElementById(contentId);
    const placeholderEl = document.getElementById(placeholderId);

    if (contentEl && placeholderEl) {
      if (contentEl.classList.contains('hidden')) {
        contentEl.innerHTML = activePhysicsProblem[dataKey].replace(/\n/g, '<br>');
        
        // Renderizar KaTeX
        if (window.renderMathInElement) {
          window.renderMathInElement(contentEl, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$', right: '$', display: false },
              { left: '\\(', right: '\\)', display: false },
              { left: '\\[', right: '\\]', display: true }
            ],
            throwOnError: false
          });
        }

        contentEl.classList.remove('hidden');
        placeholderEl.classList.add('hidden');
        card.style.transform = 'scale(1.02)';
        card.style.background = 'rgba(99, 102, 241, 0.05)';

        // Si es el resultado, incrementar el puntaje escolar (solo si no se había revelado antes)
        if (dataKey === 'resultado' && !card.dataset.revealed) {
          card.dataset.revealed = 'true';
          if (window.incrementExercisesCompleted) {
            window.incrementExercisesCompleted();
          }
        }
      }
    }
  });
}

async function generatePhysicsProblem() {
  const welcomePanel = document.getElementById('physics-welcome-panel');
  const loaderPanel = document.getElementById('physics-loader-panel');
  const activePanel = document.getElementById('physics-active-panel');

  const grade = localStorage.getItem('gloma_student_grade') || '1.°';

  if (welcomePanel) welcomePanel.classList.add('hidden');
  if (activePanel) activePanel.classList.add('hidden');
  if (loaderPanel) loaderPanel.classList.remove('hidden');

  // Resetear estados de las tarjetas
  const steps = ['datos', 'formula', 'sustitucion', 'resultado'];
  steps.forEach(step => {
    const content = document.getElementById(`content-phys-${step}`);
    const placeholder = document.getElementById(`placeholder-phys-${step}`);
    const card = document.getElementById(`card-phys-${step}`);
    
    if (content) {
      content.classList.add('hidden');
      content.innerHTML = '';
    }
    if (placeholder) {
      placeholder.classList.remove('hidden');
    }
    if (card) {
      card.style.transform = 'none';
      card.style.background = '';
      delete card.dataset.revealed;
    }
  });

  try {
    const response = await fetch('/api/physics/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grade: `${grade} de secundaria` }),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con la API de IA');
    }

    const data = await response.json();
    activePhysicsProblem = data;

    // Colocar enunciado
    const problemTextContainer = document.getElementById('physics-problem-text');
    problemTextContainer.innerHTML = data.problem;

    if (window.renderMathInElement) {
      window.renderMathInElement(problemTextContainer, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }

    // Colocar explicación conceptual
    document.getElementById('physics-explanation').innerText = data.explanation || 'Problema práctico estructurado para análisis elemental.';

    // Ocultar loader y mostrar panel
    loaderPanel.classList.add('hidden');
    activePanel.classList.remove('hidden');

  } catch (error) {
    console.error('Error en Physics Module:', error);
    loaderPanel.classList.add('hidden');
    if (welcomePanel) welcomePanel.classList.remove('hidden');
    alert('⚠️ Ocurrió un error al generar el problema. Verifica que el servidor Express esté corriendo y que tu API Key de Gemini sea válida.');
  }
}

// Exponer globalmente
window.initPhysicsModule = initPhysicsModule;
