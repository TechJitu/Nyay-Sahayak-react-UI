import React, { useState } from 'react';
import { X, FileText, Download, Loader2 } from 'lucide-react';

const DocGenModal = ({ onGenerate, onClose }) => {
  const [formData, setFormData] = useState({
    landlord: '',
    tenant: '',
    rent: '',
    address: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async () => {
    if(!formData.landlord || !formData.tenant) {
      alert("Please fill in required details");
      return;
    }
    setLoading(true);
    try {
      const blob = await onGenerate(formData);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Rent_Agreement_${formData.tenant}.docx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      onClose();
    } catch (e) {
      alert("Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-fade-in">
      <div className="glass-panel w-[500px] p-8 rounded-3xl transform scale-100 border-t-4 border-accent-gold">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
          <h2 className="text-xl font-bold font-legal text-white tracking-widest flex items-center gap-3">
            <FileText className="text-accent-cyan w-6 h-6" /> RENT AGREEMENT
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="space-y-4">
          <input id="landlord" value={formData.landlord} onChange={handleChange} placeholder="Landlord Name" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent-gold transition" />
          <input id="tenant" value={formData.tenant} onChange={handleChange} placeholder="Tenant Name" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent-gold transition" />
          <input id="rent" type="number" value={formData.rent} onChange={handleChange} placeholder="Monthly Rent (₹)" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent-gold transition" />
          <input id="address" value={formData.address} onChange={handleChange} placeholder="Property Address" className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent-gold transition" />
          <input id="date" type="date" value={formData.date} onChange={handleChange} className="w-full bg-slate-900 border border-white/10 rounded-xl p-3 text-slate-400 outline-none focus:border-accent-gold transition" />
        </div>

        <button onClick={handleSubmit} disabled={loading} className="w-full py-3 action-btn rounded-xl mt-6 text-xs tracking-widest shadow-lg flex items-center justify-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="animate-spin w-4 h-4" /> : <Download className="w-4 h-4" />}
          {loading ? "GENERATING..." : "GENERATE & DOWNLOAD"}
        </button>
      </div>
    </div>
  );
};

export default DocGenModal;