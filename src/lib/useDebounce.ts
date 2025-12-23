"use client"

import { useEffect, useState } from "react";

// T 어떤 타입이든
export function useDebounce<T>(value: T, delay = 300): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };

    }, [value, delay]);

    return debouncedValue;
}
