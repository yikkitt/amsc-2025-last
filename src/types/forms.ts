export interface FormData {
  [key: string]: string | number | boolean | null | undefined | FormItem[] | Record<string, any>;
  companyName?: string;
  company?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
  formId?: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  items?: FormItem[];
  subtotal?: number;
  late_charge?: number;
  surcharge?: number;
  total?: number;
  grand_total?: number;
  company_data?: {
    company_name?: string;
    booth_number?: string;
    contact_person?: string;
    email?: string;
    tel?: string;
    telephone?: string;
    fax?: string;
    address?: string;
  };
  auth_details?: {
    name?: string;
    designation?: string;
    date?: string;
  };
}

export interface FormItem {
  id: string;
  description: string;
  quantity: number;
  unitCost?: number;
  unitPrice?: number;
  total?: number;
  image?: string;
  section?: string;
  unit?: string;
  dimension?: string;
  printableSize?: string;
} 