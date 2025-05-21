import { loginUser } from "../services/AuthService";


class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .auth-form {
                    width: 100%;
                    max-width: 400px;
                    margin: 40px auto;
                    padding: 25px;
                    border: 1px solid #ddd;
                    border-radius: 10px;
                    background-color: #fafafa;
                    font-family: sans-serif;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }

                .auth-form h2 {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 20px;
                    color: #222;
                    text-align: center;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .form-group label {
                    display: block;
                    font-size: 14px;
                    margin-bottom: 6px;
                    color: #333;
                }

                .form-group input {
                    width: 100%;
                    padding: 10px 12px;
                    font-size: 14px;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    background-color: #fff;
                    box-sizing: border-box;
                }

                .form-group input:focus {
                    outline: none;
                    border-color: #4a90e2;
                    box-shadow: 0 0 0 2px rgba(74, 144, 226, 0.2);
                }

                .error-message {
                    color: #e74c3c;
                    font-size: 14px;
                    margin-top: 4px;
                    display: none;
                }

                .form-actions {
                    margin-top: 24px;
                }

                .form-actions button {
                    background-color: #4a90e2;
                    color: white;
                    padding: 10px 16px;
                    font-size: 16px;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                    width: 100%;
                }

                .form-actions button:hover {
                    background-color: #3b78c2;
                }

                .form-footer {
                    margin-top: 20px;
                    text-align: center;
                    font-size: 14px;
                    color: #555;
                }

                .form-footer a {
                    color: #4a90e2;
                    text-decoration: none;
                    cursor: pointer;
                }

                .form-footer a:hover {
                    text-decoration: underline;
                }
            </style>

            <div class="auth-form">
                <h2>Iniciar Sesión</h2>
                <form id="loginForm">
                    <div class="form-group">
                        <label for="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" required placeholder="usuario@ejemplo.com">
                        <div class="error-message" id="emailError"></div>
                    </div>

                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" required>
                        <div class="error-message" id="passwordError"></div>
                    </div>

                    <div class="error-message" id="loginError"></div>

                    <div class="form-actions">
                        <button type="submit">Iniciar Sesión</button>
                    </div>

                    <div class="form-footer">
                        ¿No tienes una cuenta? <a id="switchToRegister">Regístrate aquí</a>
                    </div>
                </form>
            </div>
        `;

        // Manejar envío del formulario
        const loginForm = this.shadowRoot.querySelector("#loginForm") as HTMLFormElement;
        const loginError = this.shadowRoot.querySelector("#loginError") as HTMLDivElement;

        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            loginError.style.display = "none";

            const formData = new FormData(loginForm);
            const email = formData.get("email")?.toString() || "";
            const password = formData.get("password")?.toString() || "";

            // Validación básica
            if (!email || !password) {
                loginError.textContent = "Por favor complete todos los campos";
                loginError.style.display = "block";
                return;
            }

            try {
                const success = await loginUser(email, password);
                
                if (success) {
                    // Redirigir a la página principal o recargar para mostrar la app
                    window.dispatchEvent(new CustomEvent("auth-changed", { detail: { isLoggedIn: true } }));
                } else {
                    loginError.textContent = "Credenciales incorrectas";
                    loginError.style.display = "block";
                }
            } catch (error: any) {
                loginError.textContent = error.message || "Error al iniciar sesión";
                loginError.style.display = "block";
            }
        });

        // Cambiar a formulario de registro
        const switchToRegister = this.shadowRoot.querySelector("#switchToRegister");
        switchToRegister?.addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("switch-auth-form", { detail: { form: "register" } }));
        });
    }
}

export default LoginForm;