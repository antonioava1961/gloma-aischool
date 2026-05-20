/* dashboard.js - Lógica Principal del Panel de Control Estudiantil (Local-First) */

// Variables globales de estado local
let studentName = '';
let studentGrade = '';
let totalMinutesStudied = 0;
let totalExercisesCompleted = 0;
let sessionSeconds = 0;

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar datos de LocalStorage
  initLocalStorageData();

  // 2. Verificar perfil del estudiante (Onboarding)
  checkStudentProfile();

  // 3. Configurar navegación SPA (Single Page Application)
  setupSPANavigation();

  // 4. Iniciar temporizador de tiempo de estudio activo
  startStudyTimer();

  // 5. Configurar toggle de menú móvil
  setupMobileMenu();

  // 6. Inicializar módulos académicos de la Fase 3
  if (window.initMathModule) window.initMathModule();
  if (window.initPhysicsModule) window.initPhysicsModule();
  if (window.initChemistryModule) window.initChemistryModule();
  if (window.initEnglishModule) window.initEnglishModule();
  if (window.initSocialModule) window.initSocialModule();
});

/**
 * Inicializa los valores por defecto en LocalStorage si no existen
 */
function initLocalStorageData() {
  if (localStorage.getItem('gloma_study_minutes') === null) {
    localStorage.setItem('gloma_study_minutes', '0');
  }
  if (localStorage.getItem('gloma_exercises_completed') === null) {
    localStorage.setItem('gloma_exercises_completed', '0');
  }
  
  totalMinutesStudied = parseInt(localStorage.getItem('gloma_study_minutes'), 10);
  totalExercisesCompleted = parseInt(localStorage.getItem('gloma_exercises_completed'), 10);

  // Render inicial de estadísticas
  updateStatsDisplay();
}

/**
 * Verifica si el estudiante ya completó su registro de perfil local
 */
function checkStudentProfile() {
  studentName = localStorage.getItem('gloma_student_name');
  studentGrade = localStorage.getItem('gloma_student_grade');

  const modal = document.getElementById('onboarding-modal');

  if (!studentName || !studentGrade) {
    // Mostrar modal flotante de onboarding
    if (modal) {
      modal.classList.remove('hidden');
    }
  } else {
    // Perfil existe, ocultar modal y aplicar datos a la interfaz
    if (modal) {
      modal.classList.add('hidden');
    }
    applyStudentProfile();
  }
}

/**
 * Guarda los datos del formulario de bienvenida en LocalStorage
 */
function saveStudentProfile(event) {
  if (event) event.preventDefault();

  const nameInput = document.getElementById('input-student-name');
  const gradeSelect = document.getElementById('select-student-grade');

  if (!nameInput || !gradeSelect) return;

  const name = nameInput.value.trim();
  const grade = gradeSelect.value;

  if (name.length < 2) {
    alert('Por favor, introduce un nombre válido de al menos 2 letras.');
    return;
  }

  // Guardar en el navegador
  localStorage.setItem('gloma_student_name', name);
  localStorage.setItem('gloma_student_grade', grade);

  studentName = name;
  studentGrade = grade;

  // Ocultar modal con transición
  const modal = document.getElementById('onboarding-modal');
  if (modal) {
    modal.classList.add('hidden');
  }

  // Aplicar datos a la interfaz
  applyStudentProfile();
}

/**
 * Carga los datos del perfil local en las etiquetas de la UI
 */
function applyStudentProfile() {
  // 1. Saludo dinámico según la hora del día
  const greetingEl = document.getElementById('greeting-user');
  if (greetingEl) {
    const hours = new Date().getHours();
    let timeGreeting = '¡Hola';
    if (hours >= 6 && hours < 12) timeGreeting = '¡Buenos días';
    else if (hours >= 12 && hours < 18) timeGreeting = '¡Buenas tardes';
    else timeGreeting = '¡Buenas noches';

    greetingEl.innerText = `${timeGreeting}, ${studentName}!`;
  }

  // 2. Avatar lateral (inicial del nombre)
  const avatarEl = document.getElementById('sidebar-avatar');
  if (avatarEl && studentName) {
    avatarEl.innerText = studentName.charAt(0).toUpperCase();
  }

  // 3. Nombre en la barra lateral
  const nameEl = document.getElementById('sidebar-student-name');
  if (nameEl) {
    nameEl.innerText = studentName;
  }

  // 4. Grado escolar en la barra lateral
  const gradeEl = document.getElementById('sidebar-student-grade');
  if (gradeEl) {
    gradeEl.innerText = `${studentGrade} de Secundaria`;
  }
  
  // 5. Grado en el banner del dashboard
  const bannerGradeEl = document.getElementById('banner-student-grade');
  if (bannerGradeEl) {
    bannerGradeEl.innerText = `${studentGrade} de Secundaria`;
  }
}

/**
 * Maneja la navegación SPA entre las pestañas del menú lateral
 */
function setupSPANavigation() {
  const menuButtons = document.querySelectorAll('.menu-item');
  const sections = document.querySelectorAll('.workspace-section');

  menuButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetTab = button.getAttribute('data-tab');

      // 1. Remover clase activa de todos los botones
      menuButtons.forEach(btn => btn.classList.remove('active'));
      
      // 2. Añadir clase activa al botón actual
      button.classList.add('active');

      // 3. Ocultar todas las secciones e inyectar transición suave
      sections.forEach(sec => sec.classList.add('hidden'));

      // 4. Mostrar la sección seleccionada
      const targetSection = document.getElementById(`section-${targetTab}`);
      if (targetSection) {
        targetSection.classList.remove('hidden');
      }

      // Cerrar sidebar en dispositivos móviles automáticamente tras clic
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.remove('open');
      }
    });
  });
}

/**
 * Temporizador en segundo plano que acumula minutos de estudio activo
 */
function startStudyTimer() {
  setInterval(() => {
    // Solo contar el tiempo si el usuario está visualizando activamente la pestaña/plataforma
    if (!document.hidden) {
      sessionSeconds++;

      if (sessionSeconds >= 60) {
        sessionSeconds = 0;
        totalMinutesStudied++;
        
        // Persistir en LocalStorage
        localStorage.setItem('gloma_study_minutes', totalMinutesStudied.toString());
        
        // Actualizar visualizador
        updateStatsDisplay();
      }
    }
  }, 1000);
}

/**
 * Incrementa el contador de ejercicios resueltos y actualiza la base local
 */
function incrementExercisesCompleted() {
  totalExercisesCompleted++;
  localStorage.setItem('gloma_exercises_completed', totalExercisesCompleted.toString());
  updateStatsDisplay();
}

/**
 * Actualiza el DOM con las estadísticas locales actualizadas
 */
function updateStatsDisplay() {
  const minutesValEl = document.getElementById('stat-minutes-val');
  const exercisesValEl = document.getElementById('stat-exercises-val');

  if (minutesValEl) {
    minutesValEl.innerText = `${totalMinutesStudied}m`;
  }
  if (exercisesValEl) {
    exercisesValEl.innerText = totalExercisesCompleted.toString();
  }
}

/**
 * Controlador de Menú Móvil (Sidebar colapsable)
 */
function setupMobileMenu() {
  const openBtn = document.getElementById('mobile-menu-open');
  const closeBtn = document.getElementById('mobile-menu-close');
  const sidebar = document.querySelector('.sidebar');

  if (openBtn && sidebar) {
    openBtn.addEventListener('click', () => {
      sidebar.classList.add('open');
    });
  }

  if (closeBtn && sidebar) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('open');
    });
  }
}

// Exportar funciones útiles globales si es necesario (utilizado en index o módulos)
window.saveStudentProfile = saveStudentProfile;
window.incrementExercisesCompleted = incrementExercisesCompleted;
