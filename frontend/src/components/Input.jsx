import React, { useId } from 'react';

const Input = React.forwardRef(function Input({
    label,
    type = "text",
    className = "",
    ...props
}, ref) {
    const id = useId();
    return (
        <div className="w-full">
            {label && <label 
                className='inline-block mb-1 pl-1 text-zinc-300' 
                htmlFor={id}>
                    {label}
            </label>}
            <input
                type={type}
                className={`w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent ${className}`}
                ref={ref}
                id={id}
                {...props}
            />
        </div>
    );
});

export default Input;