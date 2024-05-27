// src/App.tsx
import React from 'react';
import Invoice from './components/Invoice';
import InvoiceOrder from './components/InvoiceOrder';

const items = [
  { id: 1, description: 'Item 1', quantity: 2, price: 10.0 },
  { id: 2, description: 'Item 2', quantity: 1, price: 20.0 },
  { id: 3, description: 'Item 3', quantity: 3, price: 15.0 }
];

const App: React.FC = () => {
  return (
    <div className="App">
    {/**   <Invoice items={items} /> **/}

      <InvoiceOrder />
    </div>
  );
};

export default App;
