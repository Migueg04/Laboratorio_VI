
import CompletedSection from "./components/completedSection"
import FirebaseComponent from "./components/firebaseComponent"
import Form from "./components/form"
import Header from "./components/header"
import Root from "./components/Root"
import TaskCard from "./components/taskCard"
import TaskSection from "./components/taskSection"

customElements.define('root-element', Root)
customElements.define ('form-component', Form)
customElements.define ('firebase-component', FirebaseComponent)
customElements.define ('card-component', TaskCard)
customElements.define('task-section', TaskSection)
customElements.define('header-component', Header)
customElements.define('completed-section', CompletedSection)