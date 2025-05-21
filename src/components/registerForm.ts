import { registerUser } from "../services/AuthService";


class RegisterForm extends HTMLElement {
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
                <h2>Crear Cuenta</h2>
                <form id="registerForm">
                    <div class="form-group">
                        <label for="username">Nombre de Usuario</label>
                        <input type="text" id="username" name="username" required placeholder="Tu nombre de usuario">
                        <div class="error-message" id="usernameError"></div>
                    </div>

                    <div class="form-group">
                        <label for="email">Correo Electrónico</label>
                        <input type="email" id="email" name="email" required placeholder="usuario@ejemplo.com">
                        <div class="error-message" id="emailError"></div>
                    </div>

                    <div class="form-group">
                        <label for="password">Contraseña</label>
                        <input type="password" id="password" name="password" required placeholder="Mínimo 6 caracteres">
                        <div class="error-message" id="passwordError"></div>
                    </div>

                    <div class="form-group">
                        <label for="confirmPassword">Confirmar Contraseña</label>
                        <input type="password" id="confirmPassword" name="confirmPassword" required>
                        <div class="error-message" id="confirmPasswordError"></div>
                    </div>

                    <div class="error-message" id="registerError"></div>

                    <div class="form-actions">
                        <button type="submit">Registrarse</button>
                    </div>

                    <div class="form-footer">
                        ¿Ya tienes una cuenta? <a id="switchToLogin">Inicia sesión aquí</a>
                    </div>
                </form>
            </div>
        `;

        // Manejar envío del formulario
        const registerForm = this.shadowRoot.querySelector("#registerForm") as HTMLFormElement;
        const registerError = this.shadowRoot.querySelector("#registerError") as HTMLDivElement;
        const passwordError = this.shadowRoot.querySelector("#passwordError") as HTMLDivElement;
        const confirmPasswordError = this.shadowRoot.querySelector("#confirmPasswordError") as HTMLDivElement;

        registerForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            
            // Resetear mensajes de error
            registerError.style.display = "none";
            passwordError.style.display = "none";
            confirmPasswordError.style.display = "none";

            const formData = new FormData(registerForm);
            const username = formData.get("username")?.toString() || "";
            const email = formData.get("email")?.toString() || "";
            const password = formData.get("password")?.toString() || "";
            const confirmPassword = formData.get("confirmPassword")?.toString() || "";

            // Validaciones
            if (!username || !email || !password || !confirmPassword) {
                registerError.textContent = "Por favor complete todos los campos";
                registerError.style.display = "block";
                return;
            }

            if (password.length < 6) {
                passwordError.textContent = "La contraseña debe tener al menos 6 caracteres";
                passwordError.style.display = "block";
                return;
            }

            if (password !== confirmPassword) {
                confirmPasswordError.textContent = "Las contraseñas no coinciden";
                confirmPasswordError.style.display = "block";
                return;
            }

            try {
                const user = await registerUser(email, password, username);
                
                if (user) {
                    // Registro exitoso, disparar evento para actualizar UI
                    window.dispatchEvent(new CustomEvent("auth-changed", { detail: { isLoggedIn: true } }));
                } else {
                    registerError.textContent = "Error al crear la cuenta";
                    registerError.style.display = "block";
                }
            } catch (error: any) {
                registerError.textContent = error.message || "Error al registrar usuario";
                registerError.style.display = "block";
            }
        });

        // Cambiar a formulario de login
        const switchToLogin = this.shadowRoot.querySelector("#switchToLogin");
        switchToLogin?.addEventListener("click", () => {
            window.dispatchEvent(new CustomEvent("switch-auth-form", { detail: { form: "login" } }));
        });
    }
}

export default RegisterForm;