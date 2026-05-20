/* theme.js - Manejo del Modo Claro / Modo Oscuro */

(function () {
  // Obtener el tema guardado o verificar la preferencia del sistema operativo
  const savedTheme = localStorage.getItem('gloma_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // Si no hay tema guardado, usamos oscuro por defecto
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'dark'); 
  
  // Aplicar el tema al elemento raíz de la página
  if (initialTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }
})();

// Función global para alternar el tema
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const targetTheme = currentTheme === 'light' ? 'dark' : 'light';
  
  if (targetTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem('gloma_theme', 'light');
    updateThemeButtonText('light');
  } else {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('gloma_theme', 'dark');
    updateThemeButtonText('dark');
  }
}

// Actualizar el contenido del botón visual según el tema
function updateThemeButtonText(theme) {
  const toggleBtn = document.getElementById('theme-toggle');
  if (!toggleBtn) return;
  
  if (theme === 'light') {
    toggleBtn.innerHTML = '🌙 Modo Oscuro';
  } else {
    toggleBtn.innerHTML = '☀️ Modo Claro';
  }
}

// Esperar a que el DOM esté listo para sincronizar el estado visual del botón
document.addEventListener('DOMContentLoaded', () => {
  const activeTheme = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  updateThemeButtonText(activeTheme);
});
