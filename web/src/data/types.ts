export interface Nap {
  name: string
  street: string
  city: string
  region: string
  postal: string
  country: string
  phone: string
  phoneDigits: string
  email: string
  mapQuery: string
  mapUrl: string
  geo: { latitude: number; longitude: number }
}

export interface HourBlock {
  label: string
  lines: string[]
}

export interface FaqItem {
  question: string
  /** HTML allowed for links; stripped to text for FAQPage JSON-LD. */
  answer: string
}

export interface Cta {
  label: string
  url: string
  style?: 'primary' | 'outline' | 'secondary' | 'secondaryOutline'
  newTab?: boolean
}

export interface SeoMeta {
  title: string
  description: string
}
