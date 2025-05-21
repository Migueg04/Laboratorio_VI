class Header extends HTMLElement{
    constructor(){
        super()
        this.attachShadow({mode: 'open'})
    }

    connectedCallback(){
        this.render()
    }

    render() {
    if (this.shadowRoot)
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
                }

                .main-header h1 {
                    font-size: 20px;
                    margin: 0;
                }

                .logout-btn {
                    background-color: #fff;
                    color: #4a90e2;
                    border: none;
                    padding: 8px 14px;
                    border-radius: 6px;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.2s;
                }

                .logout-btn:hover {
                    background-color: #f0f0f0;
                }

            </style>

            <header class="main-header">
                <h1>Mi Agenda Virtual</h1>
                <button class="logout-btn">Cerrar sesión</button>
            </header>

        `;
    }

}
export default Header