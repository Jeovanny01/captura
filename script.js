// Cerrar el menú en pantallas pequeñas
if (window.innerWidth <= 768) {
    document.getElementById('menu').classList.remove('active');
}

function toggleMenu() {
    const menu = document.getElementById('menu');
    menu.classList.toggle('active');
    
    // Cerrar el menú si ya está abierto y se hace clic en cualquier ítem
    if (menu.classList.contains('active')) {
        const menuItems = menu.querySelectorAll('li a');
        menuItems.forEach(item => {
            item.addEventListener('click', () => {
                menu.classList.remove('active');
            });
        });
    }
}

function logout() {
    localStorage.removeItem("session"); 
    window.location.href = "index.html";
}
