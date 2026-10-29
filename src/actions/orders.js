'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/db/mongo';
import { COLLECTIONS } from '@/lib/db/collections';
import { getCurrentUser } from '@/lib/auth/session';
import { createNotification } from './notifications';
import { ObjectId } from 'mongodb';

export async function placeOrder(prevState, formData) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Please log in to place an order.' };

  const productId = formData.get('productId')?.toString();
  const quantity = Number(formData.get('quantity'));
  const address = formData.get('address')?.toString().trim();
  const phone = formData.get('phone')?.toString().trim();

  if (!productId || !quantity || quantity <= 0 || !address || !phone) {
    return { error: 'Please fill all fields correctly.' };
  }

  const db = await getDb();
  const product = await db.collection(COLLECTIONS.PRODUCTS).findOne({ _id: new ObjectId(productId) });
  
  if (!product) return { error: 'Product not found.' };
  if (product.stock < quantity) return { error: `Insufficient stock. Only ${product.stock} available.` };

  const totalAmount = product.sellingPrice * quantity;

  await db.collection(COLLECTIONS.ORDERS).insertOne({
    customerId: user._id,
    customerName: user.name,
    customerPhone: phone,
    address,
    productId: product._id,
    productName: product.name,
    quantity,
    price: product.sellingPrice,
    totalAmount,
    status: 'pending',
    createdAt: new Date(),
  });

  // 🔥 অ্যাডমিনের জন্য নোটিফিকেশন তৈরি
  await createNotification(
    'admin',
    'New Order Received',
    `${user.name} ordered ${quantity}x ${product.name}.`,
    '/dashboard/orders'
  );

  revalidatePath('/dashboard/shop');
  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard/my-orders');
  
  return { success: 'Order placed successfully! Admin will review it shortly.' };
}

export async function getAllOrders() {
  const user = await getCurrentUser();
  if (!user || !['owner', 'manager'].includes(user.role)) {
    return [];
  }

  const db = await getDb();
  const orders = await db.collection(COLLECTIONS.ORDERS).find({}).sort({ createdAt: -1 }).toArray();
  
  return orders.map(o => ({
    ...o,
    _id: o._id.toString(),
    productId: o.productId.toString(),
    customerId: o.customerId.toString(),
    createdAt: o.createdAt.toISOString(),
  }));
}

export async function updateOrderStatus(orderId, newStatus) {
  const user = await getCurrentUser();
  if (!user || !['owner', 'manager'].includes(user.role)) {
    return { error: 'Unauthorized' };
  }

  const db = await getDb();
  const order = await db.collection(COLLECTIONS.ORDERS).findOne({ _id: new ObjectId(orderId) });
  if (!order) return { error: 'Order not found.' };

  if (newStatus === 'delivered' && order.status !== 'delivered') {
    await db.collection(COLLECTIONS.PRODUCTS).updateOne(
      { _id: order.productId },
      { $inc: { stock: -order.quantity } }
    );

    const invoiceNo = 'INV-' + Date.now().toString().slice(-6);
    await db.collection(COLLECTIONS.SALES).insertOne({
      invoiceNo,
      customerId: order.customerId,
      customerName: order.customerName,
      customerPhone: order.customerPhone,
      address: order.address,
      items: [{
        productId: order.productId,
        name: order.productName,
        price: order.price,
        quantity: order.quantity,
        total: order.totalAmount
      }],
      totalAmount: order.totalAmount,
      paymentMethod: 'Cash',
      status: 'completed',
      orderId: order._id,
      createdBy: user._id,
      createdAt: new Date(),
    });
  }

  await db.collection(COLLECTIONS.ORDERS).updateOne(
    { _id: new ObjectId(orderId) },
    { $set: { status: newStatus, updatedAt: new Date() } }
  );

  // 🔥 কাস্টমারের জন্য নোটিফিকেশন তৈরি
  await createNotification(
    'customer',
    `Order ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}`,
    `Your order for ${order.quantity}x ${order.productName} has been ${newStatus}.`,
    '/dashboard/my-orders'
  );

  revalidatePath('/dashboard/orders');
  revalidatePath('/dashboard/shop');
  revalidatePath('/dashboard/sales');
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/my-orders');

  return { success: `Order marked as ${newStatus}!` };
}
