'use client';

import { Printer } from 'lucide-react';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="mt-6 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors print:hidden"
    >
      <Printer className="w-5 h-5" /> Print / Save as PDF
    </button>
  );
}
