
import React from 'react';

const ClientForm = ({ client, setClient }) => {
  return (
    <div className="space-y-4 animate-fadeIn">
      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Client / Business Name</label>
        <input type="text" value={client.name} onChange={(e) => setClient({ ...client, name: e.target.value })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" placeholder="e.g. Acme Corp." />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Contact Person</label>
          <input type="text" value={client.contactPerson} onChange={(e) => setClient({ ...client, contactPerson: e.target.value })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" placeholder="John Doe" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold">GSTIN / Tax ID</label>
          <input type="text" value={client.gst} onChange={(e) => setClient({ ...client, gst: e.target.value })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" placeholder="27BBBBB0000B1Z5" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Email</label>
          <input type="email" value={client.email} onChange={(e) => setClient({ ...client, email: e.target.value })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" placeholder="contact@acme.com" />
        </div>
        <div>
          <label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Phone</label>
          <input type="text" value={client.phone} onChange={(e) => setClient({ ...client, phone: e.target.value })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm outline-none focus:border-blue-500" placeholder="+91 98765 00000" />
        </div>
      </div>

      <div>
        <label className="text-xs text-gray-500 dark:text-gray-400 font-bold">Billing Address</label>
        <textarea value={client.billingAddress} onChange={(e) => setClient({ ...client, billingAddress: e.target.value })} className="w-full p-2 mt-1 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded text-sm h-16 outline-none focus:border-blue-500" placeholder="Full billing address..." />
      </div>
    </div>
  );
};

export default ClientForm;