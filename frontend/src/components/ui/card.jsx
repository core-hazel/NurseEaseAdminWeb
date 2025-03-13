import React from 'react';

export const Card = ({ children, className = "", ...props }) => {
    return (
        <div className={`bg-white shadow-md rounded-2xl p-4 ${className}`} {...props}>
            {children}
        </div>
    );
};

