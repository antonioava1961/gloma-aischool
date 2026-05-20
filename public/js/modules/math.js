/* math.js - Módulo de Matemáticas Inteligentes con soporte de KaTeX */

let activeMathProblem = null;

function initMathModule() {
  const btnGenerate = document.getElementById('btn-math-generate');
  const btnVerify = document.getElementById('btn-math-verify');
  const btnRevealSol = document.getElementById('btn-math-reveal-sol');
  const inputAnswer = document.getElementById('math-input-answer');

  if (btnGenerate) {
    btnGenerate.addEventListener('click', generateMathProblem);
  }

  if (btnVerify) {
    btnVerify.addEventListener('click', verifyMathAnswer);
  }

  if (btnRevealSol) {
    btnRevealSol.addEventListener('click', toggleMathSolution);
  }

  if (inputAnswer) {
    inputAnswer.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') verifyMathAnswer();
    });
  }
}

async function generateMathProblem() {
  const welcomePanel = document.getElementById('math-welcome-panel');
  const loaderPanel = document.getElementById('math-loader-panel');
  const activePanel = document.getElementById('math-active-panel');
  const solutionPanel = document.getElementById('math-solution-panel');
  const feedbackAlert = document.getElementById('math-feedback-alert');
  const inputAnswer = document.getElementById('math-input-answer');
  const btnReveal = document.getElementById('btn-math-reveal-sol');

  // Obtener año escolar del localStorage
  const grade = localStorage.getItem('gloma_student_grade') || '1.°';

  // Mostrar loader
  if (welcomePanel) welcomePanel.classList.add('hidden');
  if (activePanel) activePanel.classList.add('hidden');
  if (loaderPanel) loaderPanel.classList.remove('hidden');
  if (solutionPanel) solutionPanel.classList.add('hidden');
  if (feedbackAlert) feedbackAlert.classList.add('hidden');
  if (inputAnswer) inputAnswer.value = '';
  if (btnReveal) btnReveal.innerText = 'Mostrar Explicación Detallada';

  try {
    const response = await fetch('/api/math/generate', {
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
    activeMathProblem = data;

    // Actualizar interfaz
    document.getElementById('math-difficulty-tag').innerText = `Dificultad: ${data.difficulty || 'Media'}`;
    document.getElementById('math-grade-tag').innerText = `${grade} de Secundaria`;
    
    const problemTextContainer = document.getElementById('math-problem-text');
    problemTextContainer.innerHTML = data.problem;

    // Renderizar ecuaciones con KaTeX de forma segura
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

    // Ocultar loader y mostrar panel activo
    loaderPanel.classList.add('hidden');
    activePanel.classList.remove('hidden');

  } catch (error) {
    console.error('Error en Math Module:', error);
    loaderPanel.classList.add('hidden');
    if (welcomePanel) welcomePanel.classList.remove('hidden');
    alert('⚠️ Ocurrió un error al generar el problema. Verifica que el servidor Express esté corriendo y que tu API Key de Gemini sea válida.');
  }
}

function verifyMathAnswer() {
  if (!activeMathProblem) return;

  const inputAnswer = document.getElementById('math-input-answer');
  const feedbackAlert = document.getElementById('math-feedback-alert');

  if (!inputAnswer || !feedbackAlert) return;

  const userAnswer = inputAnswer.value.trim().toLowerCase();
  const correctAnswer = activeMathProblem.correct_answer.trim().toLowerCase();

  feedbackAlert.classList.remove('hidden');

  // Limpieza simple de espacios y caracteres para una mejor comparación
  const cleanStr = (str) => str.replace(/[\s\(\)\=\[\]]/g, '');
  const isCorrect = cleanStr(userAnswer) === cleanStr(correctAnswer) || 
                    userAnswer === correctAnswer ||
                    (parseFloat(userAnswer) === parseFloat(correctAnswer) && !isNaN(parseFloat(userAnswer)));

  if (isCorrect) {
    feedbackAlert.className = 'feedback-alert-correct';
    feedbackAlert.style.background = 'var(--accent-glow)';
    feedbackAlert.style.border = '1px solid var(--accent)';
    feedbackAlert.style.color = 'var(--accent)';
    feedbackAlert.innerHTML = '🎉 <strong>¡Excelente trabajo!</strong> Tu respuesta es correcta. Has ganado +1 ejercicio completado.';
    
    // Incrementar en localStorage
    if (window.incrementExercisesCompleted) {
      window.incrementExercisesCompleted();
    }
  } else {
    feedbackAlert.className = 'feedback-alert-incorrect';
    feedbackAlert.style.background = 'var(--danger-glow)';
    feedbackAlert.style.border = '1px solid var(--danger)';
    feedbackAlert.style.color = 'var(--danger)';
    feedbackAlert.innerHTML = `❌ <strong>¡Casi lo logras!</strong> Revisa tus cálculos. La respuesta sugerida es: <code>${activeMathProblem.correct_answer}</code>. Puedes revisar el paso a paso abajo.`;
  }
}

function toggleMathSolution() {
  const solutionPanel = document.getElementById('math-solution-panel');
  const btnReveal = document.getElementById('btn-math-reveal-sol');

  if (!solutionPanel || !btnReveal || !activeMathProblem) return;

  if (solutionPanel.classList.contains('hidden')) {
    solutionPanel.innerHTML = activeMathProblem.explanation;
    
    // Renderizar KaTeX
    if (window.renderMathInElement) {
      window.renderMathInElement(solutionPanel, {
        delimiters: [
          { left: '$$', right: '$$', display: true },
          { left: '$', right: '$', display: false },
          { left: '\\(', right: '\\)', display: false },
          { left: '\\[', right: '\\]', display: true }
        ],
        throwOnError: false
      });
    }

    solutionPanel.classList.remove('hidden');
    btnReveal.innerText = 'Ocultar Explicación Detallada';
  } else {
    solutionPanel.classList.add('hidden');
    btnReveal.innerText = 'Mostrar Explicación Detallada';
  }
}

// Exponer globalmente
window.initMathModule = initMathModule;
