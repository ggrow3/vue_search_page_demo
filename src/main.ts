import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import App from './App.vue'
import router from './router'

// Styles
import './assets/main.css'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'

// PrimeVue components
import AutoComplete from 'primevue/autocomplete'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import ConfirmDialog from 'primevue/confirmdialog'
import Dialog from 'primevue/dialog'
import Dropdown from 'primevue/dropdown'
import MultiSelect from 'primevue/multiselect'
import Textarea from 'primevue/textarea'
import Checkbox from 'primevue/checkbox'
import Toast from 'primevue/toast'
import Tooltip from 'primevue/tooltip'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)
app.use(PrimeVue)
app.use(ConfirmationService)
app.use(ToastService)

// Register components globally
app.component('AutoComplete', AutoComplete)
app.component('DataTable', DataTable)
app.component('Column', Column)
app.component('InputText', InputText)
app.component('Button', Button)
app.component('Calendar', Calendar)
app.component('ConfirmDialog', ConfirmDialog)
app.component('Dialog', Dialog)
app.component('Dropdown', Dropdown)
app.component('MultiSelect', MultiSelect)
app.component('Textarea', Textarea)
app.component('Checkbox', Checkbox)
app.component('Toast', Toast)

// Register directives
app.directive('tooltip', Tooltip)

app.mount('#app')
