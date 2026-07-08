import React from 'react';
import { Trash2, PlusCircle } from 'lucide-react';

const ClauseManager = ({ clauses, setClauses }) => {
  const handleAddClause = () => setClauses([...clauses, { id: Date.now(), title: '', text: '' }]);
  const handleDeleteClause = (id) => setClauses(clauses.filter(clause => clause.id !== id));

  const updateClause = (index, field, value) => {
    const newClauses = [...clauses];
    newClauses[index][field] = value;
    setClauses(newClauses);
  };

  return (
    <div className="space-y-4 animate-fadeIn">
      {clauses.map((clause, idx) => (
        <div key={clause.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 relative shadow-sm transition-all hover:shadow-md">
          
          <button onClick={() => handleDeleteClause(clause.id)} className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white w-7 h-7 flex items-center justify-center rounded-full shadow-md transition-colors">
            <Trash2 size={14} />
          </button>
          
          <div className="flex items-center gap-3 mb-2">
            <span className="font-black text-gray-400 dark:text-gray-500 text-lg w-6 text-center">{idx + 1}.</span>
            <input 
              type="text" 
              placeholder="Clause Title (e.g. Terms of Payment)" 
              value={clause.title} 
              onChange={(e) => updateClause(idx, 'title', e.target.value)} 
              className="w-full p-2 border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white rounded text-sm font-bold outline-none focus:border-purple-500" 
            />
          </div>
          
          <textarea 
            placeholder="Detailed description of the clause..." 
            value={clause.text} 
            onChange={(e) => updateClause(idx, 'text', e.target.value)} 
            className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-transparent dark:text-white rounded text-sm h-24 outline-none focus:border-purple-500 ml-9" 
            style={{ width: 'calc(100% - 36px)' }}
          />
        </div>
      ))}
      
      <button onClick={handleAddClause} className="w-full flex items-center justify-center gap-2 py-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 text-purple-600 dark:text-purple-400 font-bold rounded-xl text-sm border-dashed hover:bg-purple-100 dark:hover:bg-purple-900/40 transition-colors">
        <PlusCircle size={16} /> Add New Clause
      </button>
    </div>
  );
};

export default ClauseManager;