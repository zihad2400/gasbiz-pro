export const instant = false; // Allow blocking route for Next.js 16

import { connection } from 'next/server';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { ObjectId } from 'mongodb';
import { notFound } from 'next/navigation';
import PrintButton from './PrintButton';

export default async function InvoicePage({ params }) {
  // Next.js 16-কে বাধ্য করো রিকোয়েস্ট টাইমে রেন্ডার করতে
  await connection();

  const { id } = await params;
  if (!id || id.length !== 24) notFound();

  const db = await getDb();
  const sale = await db.collection(COLLECTIONS.SALES).findOne({ _id: new ObjectId(id) });
  
  if (!sale) notFound();

  return (
    <div className="min-h-screen bg-white text-black p-8 flex flex-col items-center">
      <div className="max-w-3xl w-full bg-white border border-gray-200 p-8 rounded-lg shadow-sm print:shadow-none print:border-none print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b border-gray-200 pb-6 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">GasBiz Pro</h1>
            <p className="text-sm text-gray-500 mt-1">LPG Cylinder & Gas Supplier</p>
            <p className="text-sm text-gray-500">Dhaka, Bangladesh</p>
            <p className="text-sm text-gray-500">Phone: +880 1XXX-XXXXXX</p>
          </div>
          <div className="text-right">
            <h2 className="text-2xl font-bold text-gray-800">INVOICE</h2>
            <p className="text-sm font-medium text-gray-600 mt-1">#{sale.invoiceNo}</p>
            <p className="text-sm text-gray-500">Date: {new Date(sale.createdAt).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Billed To</h3>
          <p className="text-lg font-semibold text-gray-800">{sale.customerName}</p>
          <p className="text-sm text-gray-600">{sale.customerPhone || 'N/A'}</p>
          {sale.address && <p className="text-sm text-gray-600">{sale.address}</p>}
        </div>

        {/* Table */}
        <table className="w-full mb-8">
          <thead>
            <tr className="border-b-2 border-gray-200 text-left text-sm font-bold text-gray-600">
              <th className="py-2">Item</th>
              <th className="py-2 text-center">Qty</th>
              <th className="py-2 text-right">Price</th>
              <th className="py-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {sale.items.map((item, idx) => (
              <tr key={idx} className="border-b border-gray-100 text-sm text-gray-700">
                <td className="py-3 font-medium">{item.name}</td>
                <td className="py-3 text-center">{item.quantity}</td>
                <td className="py-3 text-right">৳{item.price}</td>
                <td className="py-3 text-right font-medium">৳{item.total}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end border-t border-gray-200 pt-4">
          <div className="w-1/2">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Payment Method:</span>
              <span className="font-medium">{sale.paymentMethod}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 border-t border-gray-200 pt-2">
              <span>Total Amount:</span>
              <span>৳{sale.totalAmount}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>Thank you for your business!</p>
          <p className="mt-1">For any queries, contact us at support@gasbizpro.com</p>
        </div>
      </div>

      <PrintButton />
    </div>
  );
}
