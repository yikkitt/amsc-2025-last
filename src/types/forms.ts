export interface FormData {
  company_name: string
  contact_person: string
  booth_number: string
  telephone: string
  email: string
  items?: Array<{
    description: string
    quantity: number
    unit_price: number
    total: number
  }>
  subtotal?: number
  late_charge?: number
  grand_total?: number
  [key: string]: any // Allow for form-specific fields
} 