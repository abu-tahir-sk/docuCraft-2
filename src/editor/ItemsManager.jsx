import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';

const ItemsManager = ({ items, setItems, financials, setFinancials }) => {
  const handleAddItem = () => setItems([...items, { id: Date.now(), name: '', description: '', hsn: '', unit: 'Pcs', qty: 1, price: 0, taxRate: 0 }]);
  const handleDeleteItem = (id) => setItems(items.filter(item => item.id !== id));

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {items.map((item, idx) => (
        <div key={item.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 relative shadow-sm transition-all hover:shadow-md">
          
          <button onClick={() => handleDeleteItem(item.id)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md transition-colors">
            <Trash2 size={14} />
          </button>

          <input type="text" placeholder="Item / Service Name" value={item.name} onChange={(e) => updateItem(idx, 'name', e.target.value)} className="w-full p-2 mb-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white text-sm font-bold focus:border-blue-500 outline-none" />
          
          <div className="flex flex-col sm:flex-row gap-2 mb-3">
            <input type="text" placeholder="Description (Optional)" value={item.description} onChange={(e) => updateItem(idx, 'description', e.target.value)} className="w-full sm:w-2/3 p-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white text-sm focus:border-blue-500 outline-none" />
            <input type="text" placeholder="HSN/SAC" value={item.hsn} onChange={(e) => updateItem(idx, 'hsn', e.target.value)} className="w-full sm:w-1/3 p-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white text-sm focus:border-blue-500 outline-none" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Qty</label>
              <input type="number" value={item.qty} onChange={(e) => updateItem(idx, 'qty', Number(e.target.value))} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Unit</label>
              <input type="text" placeholder="Pcs, Kg" value={item.unit} onChange={(e) => updateItem(idx, 'unit', e.target.value)} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Price</label>
              <input type="number" value={item.price} onChange={(e) => updateItem(idx, 'price', Number(e.target.value))} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white text-sm outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Tax %</label>
              <input type="number" value={item.taxRate} onChange={(e) => updateItem(idx, 'taxRate', Number(e.target.value))} className="w-full p-2 border border-gray-200 dark:border-gray-700 rounded bg-transparent dark:text-white text-sm outline-none focus:border-blue-500" />
            </div>
          </div>
        </div>
      ))}
      
      <button onClick={handleAddItem} className="w-full flex items-center justify-center gap-2 py-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 font-bold rounded-xl text-sm border-dashed hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors">
        <PlusCircle size={16} /> Add New Item
      </button>
      
      {/* Global Adjustments (Discount & Shipping) */}
      <div className="mt-6 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800/50">
          <h3 className="text-xs font-bold text-gray-800 dark:text-gray-300 uppercase mb-3">Adjustments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Discount Amount</label>
              <input type="number" value={financials.discount} onChange={(e) => setFinancials({ ...financials, discount: parseFloat(e.target.value) || 0 })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded text-sm dark:text-white outline-none focus:border-blue-500" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Shipping Charge</label>
              <input type="number" value={financials.shipping} onChange={(e) => setFinancials({ ...financials, shipping: parseFloat(e.target.value) || 0 })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded text-sm dark:text-white outline-none focus:border-blue-500" />
            </div>
          </div>
      </div>
    </div>
  );
};

export default ItemsManager;