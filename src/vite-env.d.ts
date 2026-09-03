/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Optional endpoint that receives the completed submission as JSON. */
  readonly VITE_LEAD_ENDPOINT?: string
  /** Where the "Book a Free 15-min Session" button points. */
  readonly VITE_BOOKING_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
