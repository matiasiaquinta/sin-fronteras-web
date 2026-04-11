import { forwardRef } from "react";

export const Input = forwardRef((props, ref) => (
    <input
        {...props}
        ref={ref}
        className="inputFocus w-full bg-gray-50 text-sm text-black border border-gray-200 px-3 py-2 rounded-lg mt-1"
    />
));
