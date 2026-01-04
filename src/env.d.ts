/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare module 'primevue/config'
declare module 'primevue/datatable'
declare module 'primevue/column'
declare module 'primevue/inputtext'
declare module 'primevue/button'
declare module 'primevue/calendar'
declare module 'primevue/tooltip'
declare module 'primevue/confirmdialog'
declare module 'primevue/confirmationservice'
declare module 'primevue/dialog'
declare module 'primevue/dropdown'
declare module 'primevue/textarea'
declare module 'primevue/checkbox'
declare module 'primevue/toast'
declare module 'primevue/toastservice'
declare module 'primevue/usetoast' {
  export function useToast(): {
    add: (options: {
      severity?: 'success' | 'info' | 'warn' | 'error'
      summary?: string
      detail?: string
      life?: number
    }) => void
  }
}
declare module 'primevue/useconfirm' {
  export function useConfirm(): {
    require: (options: {
      message: string
      header?: string
      icon?: string
      accept?: () => void
      reject?: () => void
      acceptClass?: string
      rejectClass?: string
    }) => void
  }
}
