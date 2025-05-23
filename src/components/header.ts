import { isLoggedIn } from "../services/AuthService";

class Header extends HTMLElement {
    private isAuthenticated: boolean = false;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.isAuthenticated = isLoggedIn();
    }

    connectedCallback() {
        this.render();
        
        
        window.addEventListener("auth-changed", this.handleAuthChanged.bind(this)); //Escuchar autenticación
    }
    
    disconnectedCallback() {
        window.removeEventListener("auth-changed", this.handleAuthChanged.bind(this));
    }
    
    handleAuthChanged(event: Event) {
        const detail = (event as CustomEvent).detail;
        if (detail && typeof detail.isLoggedIn === 'boolean') {
            this.isAuthenticated = detail.isLoggedIn;
            this.render(); // Re-renderizar header según estado de auth
        }
    }

    render() {
        if (!this.shadowRoot) return;

        this.shadowRoot.innerHTML = `
            <style>
                .main-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 16px 24px;
                    background-color: #4a90e2;
                    color: white;
                    font-family: sans-serif;
                    border-bottom: 1px solid #ddd;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }

                .main-header h1 {
                    font-size: 20px;
                    margin: 0;
                    cursor: pointer;
                }

                .main-header h1:hover {
                    opacity: 0.8;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .logout-btn, .auth-btn {
                    background-color: #fff;
                    color: #4a90e2;
                    border: none;
                    padding: 8px 14px;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    text-decoration: none;
                    display: inline-block;
                }

                .logout-btn:hover, .auth-btn:hover {
                    background-color: #f0f0f0;
                    transform: translateY(-1px);
                }

                .auth-btn.secondary {
                    background-color: transparent;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                }

                .auth-btn.secondary:hover {
                    background-color: rgba(255, 255, 255, 0.1);
                    border-color: rgba(255, 255, 255, 0.5);
                }

            </style>

            <header class="main-header">
                <h1>Mi Agenda Virtual</h1>
                
                <div class="header-actions">
                    ${this.isAuthenticated ? `
                        <button class="logout-btn">Cerrar sesión</button>
                    ` : `
                    `}
                </div>
            </header>
        `;

        // Configurar eventos después del render
        this.setupEvents();
    }
    
    setupEvents() {
        if (!this.shadowRoot) return;
        
        const logoutBtn = this.shadowRoot.querySelector('.logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => {
                window.dispatchEvent(new CustomEvent("auth-changed", { 
                    detail: { isLoggedIn: false } 
                }));
            });
        }
        
        // Configurar botones de auth si no está autenticado
        if (!this.isAuthenticated) {
            const loginBtn = this.shadowRoot.querySelector('.auth-btn.secondary');
            const registerBtn = this.shadowRoot.querySelector('.auth-btn:not(.secondary)');
            
            if (loginBtn) {
                loginBtn.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent("switch-auth-form", { 
                        detail: { form: "login" } 
                    }));
                });
            }
            
            if (registerBtn) {
                registerBtn.addEventListener('click', () => {
                    window.dispatchEvent(new CustomEvent("switch-auth-form", { 
                        detail: { form: "register" } 
                    }));
                });
            }
        }
    }
}

export default Header;