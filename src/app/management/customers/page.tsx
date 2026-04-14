import CustomerTable from '@/components/customers/CustomerTable';
import React from 'react';

const page = () => {
    return (
        <div className="p-6">
            <h1 className="text-2xl font-black text-primary uppercase tracking-tight mb-6 underline decoration-secondary decoration-4 underline-offset-8">
                Customer Management
            </h1>
            <CustomerTable />
        </div>
    );
};

export default page;