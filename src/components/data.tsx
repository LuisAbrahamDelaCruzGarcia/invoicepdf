export interface OrderItem {
  id: number;
  title: string;
  sku: string;
  quantity: number;
  price: number;
  imageUrl: string;
  tax: string;
  taxAmount: string;
  discount: number;
  subTotal: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerCompany: string;
  customerPhone: string;
  customerEmail: string;
  customerAddress: string;
  customerAmount: number;
  customerInvoiceNumber: string;  
  customerOrderDate: string;
  customerSubtotal: number;
  customerDiscount: number;
  customerShipping: string;
  customerTax: string;
  customerGrandTotal: number;
  customerPaidByCustomer: number;  
  customerTaxAmount: number; 
  items: OrderItem[];
}

export const orders: Order[] = [
  {
    id: '#WHO233',
    customerName: 'John Doe',
    customerCompany: 'Company Name',
    customerPhone: '333 2312 2332',
    customerEmail: 'customer.use@company.com',
    customerAddress: '123 Main St, City, Country',
    customerAmount: 77070.0,
    customerInvoiceNumber: '#WHO233',  
    customerOrderDate: '2024-05-24',
    customerSubtotal: 232333,
    customerDiscount: 1278,
    customerShipping: '00.00',
    customerTax: '10%',
    customerGrandTotal: 1113.44,
    customerPaidByCustomer: 1113.44,  
    customerTaxAmount: 33.33,
    items: [
      {
        id: 1,
        title: '3M Speedglas Flip-Up Welding Helmet 9100XXi FX Air with Heavy Duty Adflo PAPR 547726HD',
        sku: '547726HD',
        quantity: 1,
        price: 2199.0,
        imageUrl: 'https://cdn.shopify.com/s/files/1/3009/5686/files/547726HD.png',
        tax: '10%',
        taxAmount: '350',
        discount: 0,
        subTotal: 3333,
      },
      {
        id: 2,
        title: '3M Speedglas Flip-Up Welding Helmet 9100XXi FX Air with Heavy Duty Adflo PAPR 547726HD',
        sku: '547726HD',
        quantity: 1,
        price: 2199.0,
        imageUrl: 'https://cdn.shopify.com/s/files/1/3009/5686/files/547726HD.png',
        tax: '10%',
        taxAmount: '350',
        discount: 0,
        subTotal: 3333,
      },
      {
        id: 3,
        title: '3M Speedglas Flip-Up Welding Helmet 9100XXi FX Air with Heavy Duty Adflo PAPR 547726HD',
        sku: '547726HD',
        quantity: 1,
        price: 2199.0,
        imageUrl: 'https://cdn.shopify.com/s/files/1/3009/5686/files/547726HD.png',
        tax: '10%',
        taxAmount: '350',
        discount: 0,
        subTotal: 3333,
      },
      {
        id: 3,
        title: '3M Speedglas Flip-Up Welding Helmet 9100XXi FX Air with Heavy Duty Adflo PAPR 547726HD',
        sku: '547726HD',
        quantity: 1,
        price: 2199.0,
        imageUrl: 'https://cdn.shopify.com/s/files/1/3009/5686/files/547726HD.png',
        tax: '10%',
        taxAmount: '350',
        discount: 0,
        subTotal: 3333,
      },
    ],
  },
];
