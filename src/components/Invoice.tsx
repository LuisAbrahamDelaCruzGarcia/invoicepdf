// src/Invoice.tsx
import React from 'react';
import './Invoice.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface OrderItem {
  id: number;
  description: string;
  quantity: number;
  price: number;
}

interface InvoiceProps {
  items: OrderItem[];
}

const Invoice: React.FC<InvoiceProps> = ({ items }) => {
  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById('invoice');
    if (invoiceElement) {
      const canvas = await html2canvas(invoiceElement);
      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save('invoice.pdf');
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <button onClick={handleGeneratePDF}>Imprimir Factura</button>
      <div className='invoice-app-container'>

      <div id="invoice" className="invoice-container">
        <h1>Factura</h1>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Descripción</th>
              <th>Cantidad</th>
              <th>Precio</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.description}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toFixed(2)}</td>
                <td>{(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <h2>Total: ${calculateTotal().toFixed(2)}</h2>
      </div>

      </div>
    </div>
  );
};

export default Invoice;
