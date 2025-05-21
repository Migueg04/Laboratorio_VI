
import AuthContainer from "./components/authContainer"
import CompletedSection from "./components/completedSection"
import Form from "./components/form"
import Header from "./components/header"
import LoginForm from "./components/loginForm"
import RegisterForm from "./components/registerForm"
import Root from "./components/Root"
import TaskCard from "./components/taskCard"
import TaskSection from "./components/taskSection"

// Registrar componentes
customElements.define('root-element', Root)
customElements.define('form-component', Form)
customElements.define('card-component', TaskCard)
customElements.define('task-section', TaskSection)
customElements.define('header-component', Header)
customElements.define('completed-section', CompletedSection)
customElements.define('auth-container', AuthContainer)
customElements.define('login-form', LoginForm)
customElements.define('register-form', RegisterForm)