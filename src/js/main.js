// Esperar a que el DOM esté completamente cargado
document.addEventListener("DOMContentLoaded", function () {
    // Objeto que contiene referencias a todas las vistas
    const views = {
        splash: document.getElementById("splash"),
        loginForm: document.getElementById("login-form"),
        registerForm: document.getElementById("register-form"),
        mainView: document.getElementById("main-view"),
        main2View: document.getElementById("main2-view"),
        perfilView: document.getElementById("perfil-view"),
        restaurantesView: document.getElementById("restaurantes-view"),
        restaurantes2View: document.getElementById("restaurantes2-view"),
        misrutasView: document.getElementById("misrutas-view"),
    };

    // Orden de las vistas principales
    const viewOrder = ["mainView", "main2View"];
    let currentViewIndex = 0;

    // Función para mostrar una vista específica y ocultar las demás
    function showView(viewToShow) {
        Object.values(views).forEach((view) => {
            if (view) {
                view.style.display = "none";
            }
        });
        if (views[viewToShow]) {
            views[viewToShow].style.display = "block";
        }
    }

    // Función para actualizar la vista principal
    function updateMainView() {
        showView(viewOrder[currentViewIndex]);
    }

    // Manejo de rutas del usuario
    let userRoute = JSON.parse(localStorage.getItem("userRoute")) || [];

    // Función para añadir un lugar a la ruta del usuario
    function addToRoute(lugar) {
        if (!userRoute.includes(lugar)) {
            userRoute.push(lugar);
            localStorage.setItem("userRoute", JSON.stringify(userRoute));
            alert(`${lugar} ha sido añadido a tu ruta.`);
            updateRouteView();
        } else {
            alert(`${lugar} ya está en tu ruta.`);
        }
    }

    // Función para actualizar la vista de la ruta del usuario
    function updateRouteView() {
        const rutaContainer = document.getElementById("rutas-container");
        if (rutaContainer) {
            rutaContainer.innerHTML = ""; // Limpiar el contenedor

            userRoute.forEach((lugar, index) => {
                const lugarElement = document.createElement("div");
                lugarElement.classList.add("lugar-ruta");

                const nombreLugar = document.createElement("p");
                nombreLugar.textContent = lugar;

                lugarElement.appendChild(nombreLugar);
                rutaContainer.appendChild(lugarElement);

                // Agregar línea de tiempo si no es el último elemento
                if (index < userRoute.length - 1) {
                    const line = document.createElement("div");
                    line.classList.add("linea-tiempo");
                    const marker = document.createElement("div");
                    marker.classList.add("marcador");
                    line.appendChild(marker);
                    rutaContainer.appendChild(line);
                }
            });
        }
    }

    // Event listeners

    // Botón "Agregar" en Pueblito Paisa
    const agregarBtnPueblito = document.getElementById("agregar-btn-pueblito");
    if (agregarBtnPueblito) {
        agregarBtnPueblito.addEventListener("click", function () {
            addToRoute("Pueblito Paisa");
        });
    }

    // Navegación a la vista de Mis Rutas
    const misrutasBtn = document.querySelector('nav ul li a[href="#misrutas"]');
    if (misrutasBtn) {
        misrutasBtn.addEventListener("click", function (event) {
            event.preventDefault();
            showView("misrutasView");
            updateRouteView();
        });
    }

    // Navegación entre vistas principales
    document.querySelectorAll(".arrow-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            if (this.id === "prev-arrow" && currentViewIndex > 0) {
                currentViewIndex--;
            } else if (this.id === "next-arrow" && currentViewIndex < viewOrder.length - 1) {
                currentViewIndex++;
            }
            updateMainView();
        });
    });

    // Mostrar pantalla splash y luego el formulario de inicio de sesión
    setTimeout(() => {
        showView("loginForm");
    }, 2000);

    // Cambiar a formulario de registro
    document.getElementById("create-account").addEventListener("click", function (event) {
        event.preventDefault();
        showView("registerForm");
    });

    // Volver al formulario de inicio de sesión desde el registro
    document.getElementById("login-link").addEventListener("click", function (event) {
        event.preventDefault();
        showView("loginForm");
    });

    // Manejar el inicio de sesión
    document.getElementById("loginForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const storedEmail = localStorage.getItem("email");
        const storedPassword = localStorage.getItem("password");

        if (email === storedEmail && password === storedPassword) {
            alert("Inicio de sesión exitoso");
            showView("mainView");
        } else {
            alert("Correo o contraseña incorrectos");
        }
    });

    // Manejar el registro
    document.getElementById("registerForm").addEventListener("submit", function (event) {
        event.preventDefault();
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("register-email").value;
        const password = document.getElementById("register-password").value;
        const confirmPassword = document.getElementById("confirm-password").value;

        if (password !== confirmPassword) {
            alert("Las contraseñas no coinciden");
            return;
        }

        localStorage.setItem("nombre", nombre);
        localStorage.setItem("apellido", apellido);
        localStorage.setItem("email", email);
        localStorage.setItem("password", password);

        alert("Registro exitoso");
        showView("loginForm");
    });

    // Navegación general mediante la barra de navegación
    const navLinks = document.querySelectorAll("nav ul li a");
    navLinks.forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const targetId = this.getAttribute("href").substring(1);
            showView(targetId + "View");
        });
    });

    // Navegación a la vista de Restaurantes desde Pueblito Paisa
    const restaurantesButton = document.getElementById("restaurantes-btn");
    if (restaurantesButton) {
        restaurantesButton.addEventListener("click", function () {
            showView("restaurantesView");
        });
    }

    // Navegación a la vista de Restaurantes2 desde Comuna 13
    const restaurantes2Button = document.getElementById("restaurantes2-btn");
    if (restaurantes2Button) {
        restaurantes2Button.addEventListener("click", function () {
            showView("restaurantes2View");
        });
    }

    // Navegación a la vista de Perfil y mostrar datos del perfil
    const perfilBtn = document.querySelector('nav ul li a[href="#perfil"]');
    if (perfilBtn) {
        perfilBtn.addEventListener("click", function (event) {
            event.preventDefault();
            showView("perfilView");
            // Mostrar datos del perfil
            document.getElementById("profile-name").textContent =
                localStorage.getItem("nombre") + " " + localStorage.getItem("apellido");
            document.getElementById("profile-email").textContent = "Correo: " + localStorage.getItem("email");
        });
    }

    // Cerrar sesión
    const logoutButton = document.querySelector(".logout-button");
    if (logoutButton) {
        logoutButton.addEventListener("click", function () {
            showView("loginForm");
        });
    }
});