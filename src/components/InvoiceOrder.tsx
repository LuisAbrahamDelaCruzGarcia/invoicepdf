import React, { useState, useEffect, useRef } from 'react';
import './Invoice2.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { orders, Order } from './data';

const InvoiceOrder: React.FC = () => {
  const order = orders[0]; // Usamos la primera orden como ejemplo

  const [customText, setCustomText] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [textCoordinates, setTextCoordinates] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (textRef.current && !textRef.current.contains(event.target as Node)) {
        // Verificar si hay texto personalizado para guardar
        if (customText.trim() !== '') {
          setIsEditing(false);
        } else {
          // Si no hay texto personalizado, mantener la edición
          textRef.current?.focus();
        }
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isEditing, customText]);

  const handleContainerClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const container = event.currentTarget;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    setIsEditing(true);
    setTextCoordinates({ x, y });
  };

  const handleContainerHover = () => {
    setIsHovered(true);
  };

  const handleContainerLeave = () => {
    setIsHovered(false);
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomText(event.target.value);
  };

  const handleBlur = (event: React.FocusEvent<HTMLDivElement>) => {
    // No hagas nada cuando se dispare el evento onBlur
    // Esto evitará que el texto personalizado se oculte cuando se pierda el foco
  };

  const handleGeneratePDF = async () => {
    const invoiceElement = document.getElementById('invoice');
    if (invoiceElement) {
      // Esperar a que todas las imágenes se carguen
      const loadImages = (element: HTMLElement) => {
        const images = element.getElementsByTagName('img');
        const promises = Array.from(images).map((img) => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve(true);
            } else {
              img.onload = () => resolve(true);
              img.onerror = () => resolve(false);
            }
          });
        });
        return Promise.all(promises);
      };

      await loadImages(invoiceElement);

      // Configurar html2canvas con opciones adicionales
      const canvas = await html2canvas(invoiceElement, {
        useCORS: true,
        scale: 2,
        logging: true,
        allowTaint: false,
      });

      const imgData = canvas.toDataURL('image/png');

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      // Agregar el texto personalizado al PDF
      pdf.text(customText, textCoordinates.x, textCoordinates.y);

      pdf.save('invoice.pdf');
    }
  };

  const calculateTotal = () => {
    return order.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <div>
      <button onClick={handleGeneratePDF}>Imprimir Factura</button>
      <div 
        id="invoice" 
        className="invoice-container" 
        onClick={handleContainerClick}
        onMouseEnter={handleContainerHover}
        onMouseLeave={handleContainerLeave}
        onMouseDown={(e) => {
          // Evitar que se active el evento handleClickOutside cuando se hace clic dentro del contenedor de la factura
          e.stopPropagation();
        }}
        style={{ position: 'relative' }}
      >
        {isEditing && (
          <div
            ref={textRef}
            style={{ 
              position: 'absolute', 
              top: textCoordinates.y, 
              left: textCoordinates.x, 
              border: `1px ${isHovered ? 'dashed' : 'none'} #000`, // Cambiar el estilo del borde según si el cursor está sobre el contenedor
              padding: '2px', 
              whiteSpace: 'pre-wrap',
              fontFamily: 'sans-serif'
            }}
            contentEditable
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault(); // Evitar el comportamiento predeterminado (salto de línea en el contenido editable)
                const selection = window.getSelection();
                if (selection && selection.rangeCount > 0) {
                  const range = selection.getRangeAt(0);
                  const br = document.createElement('br');
                  range.deleteContents();
                  range.insertNode(br);
                  range.setStartAfter(br);
                  range.setEndAfter(br);
                  range.collapse(false);
                  selection.removeAllRanges();
                  selection.addRange(range);
                }
              }
            }}
            onBlur={handleBlur} 
          >
            {customText}
          </div>
        )}

        <header className="invoice-header">
          <div className="company-info">
            <img src="https://cdn.shopify.com/oxygen-v2/29651/20627/42665/559282/build/_assets/logo_weldinghelmetsonline-C2VEEW2E.webp" 
            alt="Company Logo" className="company-logo" />
            <div className="company-details">
              <h1 style={{textAlign: 'end', color: '#d91023', fontSize: '2.3rem'}}>TAX INVOICE</h1>
              <p className="pdf-info-text title"><strong>Welding Helmets Online</strong></p>
              <p className="pdf-info-text">12-18 Tryon Road, Suite 18. Lindfield, New South Wales.</p>
              <p className="pdf-info-text">Australia</p>
              <p className="pdf-info-text"><a href="mailto:andrew@weldinghelmetsonline.com.au">andrew@weldinghelmetsonline.com.au</a> | <a href="tel:1800435638">1800 435 638</a></p>
              <p className="pdf-info-text">ABN: 75 621 822 080</p>
              <p className="pdf-info-text"><a href="weldinghelmetsonline.com.au">weldinghelmetsonline.com.au</a></p>
            </div>
          </div>
        </header>
        <section className="customer-info">
         <div className="shipping-info">
          <h3>SHIPPING ADDRESS</h3>
          <p>{order.customerName}</p>
          <p>{order.customerCompany}</p>
          <p>{order.customerPhone}</p>
          <p>{order.customerEmail}</p>
          <p>{order.customerAddress}</p>

         </div>

         <div className="client-order-info">
          <p>Amount: <strong>{order.customerAmount}</strong></p>
          <p>Invoice Number: <strong>{order.customerInvoiceNumber}</strong></p>
          <p>Order Date: <strong>{order.customerOrderDate}</strong></p>
         </div>

        </section>
        <section className="order-details">
          <table>
            <thead>
              <tr className="item_column_invoice_orders">
                <th></th> {/* Nueva columna para la imagen */}
                <th className="column_items_t">Items</th>
                <th>Qty</th>
                <th className="column_items_p">Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Tax Amount</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map(item => (
                <tr key={item.id} className="item_details_order_invoice">
                  <td className="details_item_invoice">
                      <img src={item.imageUrl} alt={item.title} style={{ width: '70px', height: '70px' }} />
                  </td>
                  <td className="details_item_info">
                    <div className="img_item_title_info">
                      <span className='item_title_invoice'>{item.title}</span>
                      <span className='item_sku_invoice'>SKU: {item.sku}</span>
                    </div>
                  </td>
                  <td>{item.quantity}</td>
                  <td>AU${item.price}</td>
                  <td>AU${item.discount}</td>
                  <td>GST: {item.tax}</td>
                  <td>AU${item.taxAmount}</td>
                  <td>AU${item.subTotal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
        <footer className="invoice-footer">
            <div className="container_note_invoice">
                    <div className="invoice_note_custom">
                      <h3>Note:</h3>
                    </div>
              </div>
              <div className="container_grand_total">
                    <div className="invoice_footer --subtotal">
                      <span className='f_subtitle'>Subtotal</span>
                      <span>AU${order.customerSubtotal}</span>
                    </div>
                    <div className="invoice_footer --discount">
                      <span className='f_subtitle'>Discount</span>
                      <span>AU${order.customerDiscount}</span>
                    </div>
                    <div className="invoice_footer --shipping">
                      <span className='f_subtitle'>Shipping</span>
                      <span>AU${order.customerShipping}</span>
                    </div>
                    <div className="invoice_footer --tax">
                    <span className='f_subtitle'>Tax <span className="invoice_include">(Include)</span></span>
                    <span>GST: {order.customerTax}</span>
                    <span>AU${order.customerTaxAmount}</span>
                    </div>
                    <div className="invoice_footer --grand_total">
                      <span className='f_subtitle'>Grand total</span>
                      <span className='f_grand_total'>AU${order.customerGrandTotal}</span>
                    </div>
                    <div className="invoice_footer --paid_by_customer">
                    <span className='f_subtitle'>Paid by customer</span>
                    <span>AU${order.customerPaidByCustomer}</span>
                    </div>
              </div>
        </footer>
        <section className="information_aditional_container_details">
                <div className="information_xt payment_information">
                  <h3>PAYMENT INFORMATION</h3>
                  <span>{order.customerName}</span>
                  <span>{order.customerCompany}</span>
                  <span>{order.customerAddress}</span>
                  <span>#Manual #authorize_net #Cash On Delivery (COD)</span>
                  <span>Visa: •••• •••• •••• 4242</span>
                </div>
                <div className="information_xt thank_you">
                  <span>Thank you for your purchase!</span>
                </div>
        </section>
      </div>
    </div>
  );
};

export default InvoiceOrder;
