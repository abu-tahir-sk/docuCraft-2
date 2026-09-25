
import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const SavedDocuments = () => {
  const [documents, setDocuments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get('/documents/my-documents');
        setDocuments(response.data);
      } catch (error) {
        toast.error("Failed to load documents");
      }
    };
    fetchDocuments();
  }, []);

  // Document Delete korar function
  // ১. মূল ডিলিট ফাংশন (যেটি API কল করবে)
  const confirmDelete = async (id, toastId) => {
    // প্রথমে কনফার্মেশন টোস্টটি বন্ধ করে দিবে
    toast.dismiss(toastId);

    // ডিলিট হওয়ার সময় লোডিং দেখাবে
    const loadingToast = toast.loading("Deleting document...");

    try {
      await api.delete(`/documents/delete/${id}`);

      // স্টেট থেকে ডকুমেন্টটি রিমুভ করা
      setDocuments(prevDocs => prevDocs.filter(doc => doc._id !== id));

      // লোডিং টোস্টটিকে সাকসেস টোস্টে পরিবর্তন করা
      toast.success("Deleted successfully!", { id: loadingToast });
    } catch (error) {

      const errorMessage = error.response?.data?.message || "Unauthorized: Please login again.";

      // লোডিং টোস্টটিকে এরর টোস্টে পরিবর্তন করা
      toast.error(errorMessage, { id: loadingToast });
    }
  };

  // ২. কাস্টম কনফার্মেশন অ্যালার্ট ফাংশন (UI)
  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className={`${t.visible ? 'animate-enter' : 'animate-leave'} max-w-md w-full bg-white shadow-xl rounded-xl pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}>
        <div className="flex-1 p-4">
          <div className="flex items-start">
            <div className="ml-3 flex-1">
              <p className="text-sm font-extrabold text-gray-900">
                Delete Document?
              </p>
              <p className="mt-1 text-xs text-gray-500 font-medium">
                Are you sure you want to delete this document? This action cannot be undone.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col border-l border-gray-200 bg-gray-50">
          <button
            onClick={() => confirmDelete(id, t.id)}
            className="w-full flex-1 border-b border-gray-200 px-6 py-3 flex items-center justify-center text-xs font-bold text-red-600 hover:bg-red-100 transition-colors"
          >
            Yes, Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="w-full flex-1 px-6 py-3 flex items-center justify-center text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity, // যতক্ষণ না ইউজার কোনো বাটনে ক্লিক করছে, এটি স্ক্রিনে থাকবে
    });
  };
  const handleViewPdf = (doc) => {

    navigate(`/dashboard/view-pdf/${doc._id}`,)
    toast.success("Viewing PDF successfully!")
  };



  return (
    <div className="p-8 bg-gray-100 min-h-screen font-sans w-full">

      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">

        {/* Header Section */}
        <div className="p-6 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-black text-gray-800 tracking-wide">Saved Documents</h2>
            <p className="text-sm text-gray-500 mt-1">Manage all your generated Invoices, Quotations, and Agreements.</p>
          </div>
          <div className="text-sm font-bold text-gray-500">
            Total Saved: {documents.length}
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-gray-400 text-xs uppercase tracking-widest border-b border-gray-200">
              <tr>
                <th className="p-5 font-bold">Doc Number</th>
                <th className="p-5 font-bold">Client Name</th>
                <th className="p-5 font-bold">Document Type</th>
                <th className="p-5 font-bold">Created Date</th>
                <th className="p-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">

              {/* Jodi kono data na thake */}
              {documents.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-gray-500 font-medium">
                    No documents saved yet. Go generate a new PDF!
                  </td>
                </tr>
              ) : (

                /* Saved Data gulor list loop kora hocche */
                documents.map((doc) => (
                  <tr key={doc._id} className="border-b border-gray-100 hover:bg-blue-50 transition-colors">

                    <td className="p-5 font-bold text-gray-800">{doc.docNumber}</td>

                    <td className="p-5 font-bold text-gray-700">{doc.clientName}</td>

                    <td className="p-5">
                      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.docType === 'invoice' ? 'bg-blue-100 text-blue-700' :
                        doc.docType === 'quotation' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                        {doc.docType}
                      </span>
                    </td>

                    <td className="p-5 text-gray-600 font-medium">{doc.date}</td>

                    <td className="p-5 text-right space-x-4">
                      {/* View button (Future e PDF open korar jonno kaj korbe) */}
                      <button
                        onClick={() => handleViewPdf(doc)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                      >
                        View PDF
                      </button>
                      <button
                        onClick={() => navigate(`/dashboard/edit/${doc._id}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold text-sm"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(doc._id)} // _id ব্যবহার করবেন
                        className="text-red-500 hover:text-red-700 font-bold text-sm"
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default SavedDocuments;