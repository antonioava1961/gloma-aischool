/* english.js - Módulo de Inglés con Quizzes Dinámicos y Pronunciación con Síntesis de Voz Nocional */

let englishQuizData = null;
let currentQuestionIndex = 0;
let correctAnswersCount = 0;
let hasAnsweredCurrentQuestion = false;

function initEnglishModule() {
  const btnStart = document.getElementById('btn-english-start');
  const btnNext = document.getElementById('btn-english-next');
  const btnSpeak = document.getElementById('btn-english-speak');

  if (btnStart) {
    btnStart.addEventListener('click', startEnglishQuiz);
  }

  if (btnNext) {
    btnNext.addEventListener('click', navigateNextQuestion);
  }

  if (btnSpeak) {
    btnSpeak.addEventListener('click', speakCurrentSentence);
  }
}

async function startEnglishQuiz() {
  const welcomePanel = document.getElementById('english-welcome-panel');
  const loaderPanel = document.getElementById('english-loader-panel');
  const activePanel = document.getElementById('english-active-panel');
  const resultsPanel = document.getElementById('english-results-panel');

  const grade = localStorage.getItem('gloma_student_grade') || '1.°';
  const difficulty = document.getElementById('english-difficulty-select').value;

  if (welcomePanel) welcomePanel.classList.add('hidden');
  if (activePanel) activePanel.classList.add('hidden');
  if (resultsPanel) resultsPanel.classList.add('hidden');
  if (loaderPanel) loaderPanel.classList.remove('hidden');

  // Resetear estados del quiz
  currentQuestionIndex = 0;
  correctAnswersCount = 0;
  englishQuizData = null;

  try {
    const response = await fetch('/api/english/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ grade: `${grade} de secundaria`, difficulty: difficulty }),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con la API de IA');
    }

    const data = await response.json();
    englishQuizData = data.questions;

    // Ocultar loader y renderizar la primera pregunta
    loaderPanel.classList.add('hidden');
    activePanel.classList.remove('hidden');
    
    // Setear etiqueta de dificultad
    document.getElementById('english-difficulty-tag').innerText = `Nivel: ${data.difficulty || difficulty}`;

    renderQuestion();

  } catch (error) {
    console.error('Error en English Module:', error);
    if (loaderPanel) loaderPanel.classList.add('hidden');
    if (welcomePanel) welcomePanel.classList.remove('hidden');
    alert('⚠️ Ocurrió un error al generar el cuestionario de inglés. Revisa que el servidor Express y tu API Key de Gemini sean válidos.');
  }
}

function renderQuestion() {
  if (!englishQuizData || englishQuizData.length === 0) return;

  hasAnsweredCurrentQuestion = false;

  const currentQuestion = englishQuizData[currentQuestionIndex];
  
  // Ocultar panel de retroalimentación
  const feedbackPanel = document.getElementById('english-feedback-panel');
  if (feedbackPanel) feedbackPanel.classList.add('hidden');

  // Poner el texto e indicador
  document.getElementById('english-score-tag').innerText = `Pregunta ${currentQuestionIndex + 1} de 5`;
  document.getElementById('english-question-text').innerText = currentQuestion.question;
  document.getElementById('english-question-translation').innerText = `Traducción: "${currentQuestion.translation}"`;

  // Renderizar las opciones
  const optionsContainer = document.getElementById('english-options-container');
  optionsContainer.innerHTML = '';

  currentQuestion.options.forEach((option, idx) => {
    const optBtn = document.createElement('button');
    optBtn.className = 'btn';
    optBtn.style.textAlign = 'left';
    optBtn.style.padding = '0.9rem 1.2rem';
    optBtn.style.background = 'var(--bg-secondary)';
    optBtn.style.border = '1px solid var(--border-color)';
    optBtn.style.color = 'var(--text-primary) !important';
    optBtn.style.fontSize = '0.95rem';
    optBtn.style.fontWeight = '600';
    optBtn.style.transition = 'all var(--transition-fast)';
    
    optBtn.innerText = `${String.fromCharCode(65 + idx)}) ${option}`;

    optBtn.addEventListener('click', () => {
      selectEnglishOption(idx, optBtn);
    });

    optionsContainer.appendChild(optBtn);
  });

  // Ocultar o deshabilitar botón de siguiente hasta que se responda
  const btnNext = document.getElementById('btn-english-next');
  if (btnNext) {
    btnNext.innerText = currentQuestionIndex === 4 ? 'Ver Resultados 🏁' : 'Siguiente Pregunta ➡️';
    btnNext.style.opacity = '0.5';
    btnNext.style.pointerEvents = 'none';
  }
}

function selectEnglishOption(selectedIdx, clickedButton) {
  if (hasAnsweredCurrentQuestion) return;
  hasAnsweredCurrentQuestion = true;

  const currentQuestion = englishQuizData[currentQuestionIndex];
  const optionsContainer = document.getElementById('english-options-container');
  const buttons = optionsContainer.getElementsByTagName('button');

  const correctIdx = currentQuestion.correct_index;

  // Pintar la correcta de verde y la seleccionada de rojo si falló
  if (selectedIdx === correctIdx) {
    clickedButton.style.background = 'var(--accent-glow)';
    clickedButton.style.border = '1px solid var(--accent)';
    clickedButton.style.color = 'var(--accent) !important';
    correctAnswersCount++;
  } else {
    clickedButton.style.background = 'var(--danger-glow)';
    clickedButton.style.border = '1px solid var(--danger)';
    clickedButton.style.color = 'var(--danger) !important';

    // Pintar la que era correcta de verde suave
    const correctBtn = buttons[correctIdx];
    if (correctBtn) {
      correctBtn.style.background = 'rgba(16, 185, 129, 0.08)';
      correctBtn.style.border = '1px solid var(--accent)';
      correctBtn.style.color = 'var(--accent) !important';
    }
  }

  // Desactivar hovers de todos los botones
  for (let btn of buttons) {
    btn.style.cursor = 'default';
  }

  // Mostrar retroalimentación didáctica
  const feedbackPanel = document.getElementById('english-feedback-panel');
  const feedbackTitle = document.getElementById('english-feedback-title');
  const feedbackDesc = document.getElementById('english-feedback-desc');

  if (feedbackPanel && feedbackTitle && feedbackDesc) {
    feedbackPanel.classList.remove('hidden');

    if (selectedIdx === correctIdx) {
      feedbackPanel.style.borderLeft = '4px solid var(--accent)';
      feedbackTitle.innerHTML = '🎉 ¡Correcto! Well Done!';
      feedbackTitle.style.color = 'var(--accent)';
    } else {
      feedbackPanel.style.borderLeft = '4px solid var(--danger)';
      feedbackTitle.innerHTML = '❌ Incorrecto - ¡A seguir aprendiendo!';
      feedbackTitle.style.color = 'var(--danger)';
    }

    feedbackDesc.innerText = currentQuestion.explanation;
  }

  // Habilitar botón de siguiente
  const btnNext = document.getElementById('btn-english-next');
  if (btnNext) {
    btnNext.style.opacity = '1';
    btnNext.style.pointerEvents = 'auto';
  }
}

function navigateNextQuestion() {
  if (!hasAnsweredCurrentQuestion) return;

  if (currentQuestionIndex < 4) {
    currentQuestionIndex++;
    renderQuestion();
  } else {
    showEnglishQuizResults();
  }
}

function showEnglishQuizResults() {
  const activePanel = document.getElementById('english-active-panel');
  const resultsPanel = document.getElementById('english-results-panel');

  if (activePanel) activePanel.classList.add('hidden');
  if (resultsPanel) resultsPanel.classList.remove('hidden');

  const resultsIcon = document.getElementById('english-results-icon');
  const resultsTitle = document.getElementById('english-results-title');
  const resultsDesc = document.getElementById('english-results-desc');

  resultsTitle.innerText = `Obtuviste ${correctAnswersCount} de 5 aciertos`;

  if (correctAnswersCount === 5) {
    resultsIcon.innerText = '🏆';
    resultsDesc.innerHTML = '<strong>¡Perfecto! Excellent!</strong> Tu nivel de comprensión y gramática en este nivel es impecable. Sigue así y desafíate con un nivel superior.';
  } else if (correctAnswersCount >= 3) {
    resultsIcon.innerText = '🎉';
    resultsDesc.innerHTML = '<strong>¡Muy buen intento! Great Job!</strong> Tienes bases muy sólidas de inglés. Lee las explicaciones gramaticales de los errores que tuviste para llegar al 100%.';
  } else {
    resultsIcon.innerText = '📚';
    resultsDesc.innerHTML = '<strong>¡Buen esfuerzo! Keep practicing!</strong> El inglés es de práctica constante. Estudia las justificaciones didácticas de cada pregunta y vuelve a intentarlo.';
  }

  // Sumar 5 ejercicios completados en localStorage
  if (window.incrementExercisesCompleted) {
    for (let i = 0; i < correctAnswersCount; i++) {
      window.incrementExercisesCompleted();
    }
  }
}

function speakCurrentSentence() {
  if (!englishQuizData) return;

  const currentQuestion = englishQuizData[currentQuestionIndex];
  if (!currentQuestion) return;

  const textToSpeak = currentQuestion.question.replace(/_____+/g, 'blank');

  if ('speechSynthesis' in window) {
    // Detener cualquier reproducción en curso
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = 'en-US';
    
    // Intentar buscar una voz en inglés del sistema
    const voices = window.speechSynthesis.getVoices();
    const englishVoice = voices.find(v => v.lang.startsWith('en'));
    if (englishVoice) {
      utterance.voice = englishVoice;
    }

    utterance.rate = 0.9; // Hablar un poco más lento para fines pedagógicos
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Tu navegador no soporta la síntesis de voz nativa.');
  }
}

// Exponer globalmente
window.initEnglishModule = initEnglishModule;
