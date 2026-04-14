import OrderTable from '@/components/orders/OrderTable';
import React from 'react';

const page = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-black text-primary uppercase tracking-tight mb-6 underline decoration-secondary decoration-4 underline-offset-8">
                Order Management
            </h1>
            <OrderTable />
        </div>
    );
};

export default page;