/* social.js - Módulo de Ciencias Sociales (Generador Gráfico de Líneas de Tiempo Históricas) */

function initSocialModule() {
  const btnGenerate = document.getElementById('btn-social-generate');
  if (btnGenerate) {
    btnGenerate.addEventListener('click', generateSocialTimeline);
  }

  const inputTopic = document.getElementById('social-topic-input');
  if (inputTopic) {
    inputTopic.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') generateSocialTimeline();
    });
  }
}

async function generateSocialTimeline() {
  const input = document.getElementById('social-topic-input');
  if (!input) return;

  const topic = input.value.trim();
  if (topic.length < 3) {
    alert('Por favor, ingresa un tema, época o personaje histórico válido (ej. Revolución Francesa).');
    return;
  }

  const loaderPanel = document.getElementById('social-loader-panel');
  const activePanel = document.getElementById('social-active-panel');
  const btn = document.getElementById('btn-social-generate');

  if (loaderPanel) loaderPanel.classList.remove('hidden');
  if (activePanel) activePanel.classList.add('hidden');
  if (btn) btn.disabled = true;

  const grade = localStorage.getItem('gloma_student_grade') || '1.°';

  try {
    const response = await fetch('/api/social/summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: topic, grade: `${grade} de secundaria` }),
    });

    if (!response.ok) {
      throw new Error('Error al conectar con la API de IA');
    }

    const data = await response.json();

    // Llenar títulos y resúmenes
    document.getElementById('social-active-title').innerText = `Cronología: ${data.topic || topic}`;
    document.getElementById('social-active-summary').innerHTML = `<strong>Contexto Histórico:</strong> ${data.summary}`;

    // Llenar acontecimientos en la línea de tiempo vertical
    const timelineContainer = document.getElementById('social-timeline-container');
    
    // Conservar solo la línea vertical del fondo
    timelineContainer.innerHTML = '<div style="position: absolute; left: 7px; top: 0; bottom: 0; width: 2px; background: var(--border-color);"></div>';

    data.timeline.forEach((event, idx) => {
      const node = document.createElement('div');
      node.style.position = 'relative';
      node.style.marginBottom = '2rem';
      node.style.paddingLeft = '2.25rem';
      node.style.opacity = '0';
      node.style.transform = 'translateY(15px)';
      node.style.transition = 'all 0.5s ease';

      node.innerHTML = `
        <!-- Punto brillante de la línea -->
        <div style="position: absolute; left: 3px; top: 8px; width: 10px; height: 10px; border-radius: 50%; background: var(--primary); box-shadow: 0 0 8px var(--primary-glow); z-index: 5;"></div>
        
        <!-- Tarjeta de evento -->
        <div class="glass-panel" style="padding: 1.25rem; background: var(--bg-secondary); border: 1px solid var(--border-color); border-radius: var(--radius-md); transition: transform var(--transition-fast);">
          <span style="font-weight: 800; font-size: 0.85rem; color: var(--accent); background: var(--accent-glow); padding: 0.2rem 0.6rem; border-radius: var(--radius-full); display: inline-block; margin-bottom: 0.5rem; text-transform: uppercase;">
            ${event.date}
          </span>
          <h4 style="font-size: 1.05rem; margin-bottom: 0.5rem; color: var(--text-title); font-family: var(--font-title);">${event.title}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.5; margin: 0;">${event.description}</p>
        </div>
      `;

      timelineContainer.appendChild(node);

      // Efecto hover sobre la tarjeta
      const card = node.querySelector('.glass-panel');
      card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateX(5px)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'none';
      });

      // Animación de aparición escalonada
      setTimeout(() => {
        node.style.opacity = '1';
        node.style.transform = 'none';
      }, idx * 150);
    });

    // Ocultar loader y mostrar resultados
    if (loaderPanel) loaderPanel.classList.add('hidden');
    if (activePanel) activePanel.classList.remove('hidden');

    // Incrementar en localStorage
    if (window.incrementExercisesCompleted) {
      window.incrementExercisesCompleted();
    }

  } catch (error) {
    console.error('Error en Social Module:', error);
    if (loaderPanel) loaderPanel.classList.add('hidden');
    alert('⚠️ Ocurrió un error al generar la línea de tiempo. Revisa que tu backend esté corriendo y que tu API Key sea válida.');
  } finally {
    if (btn) btn.disabled = false;
  }
}

// Exponer globalmente
window.initSocialModule = initSocialModule;
