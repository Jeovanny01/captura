  // Cerrar el menú en pantallas pequeñas
  if (window.innerWidth <= 768) {
    document.getElementById('menu').classList.remove('active');
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
}

function logout() {
    localStorage.removeItem("session"); 
    window.location.href = "index.html";
}