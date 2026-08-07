import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

/**
 * Searchable dropdown inspired by Signal v2 TopBar client picker:
 * button trigger → panel with search input → filtered list.
 */
export default function SearchableSelect({
    options = [],
    value = '',
    onChange,
    placeholder = 'Select…',
    searchPlaceholder = 'Search…',
    emptyLabel = 'No matches',
    required = false,
    disabled = false,
    className = '',
    icon = null,
}) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [menuStyle, setMenuStyle] = useState({});
    const rootRef = useRef(null);
    const buttonRef = useRef(null);
    const searchRef = useRef(null);

    const selected = options.find(o => String(o.value) === String(value));

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return options;
        return options.filter(o => {
            const label = String(o.label || '').toLowerCase();
            const haystack = String(o.searchText || label).toLowerCase();
            return haystack.includes(q);
        });
    }, [options, query]);

    const updateMenuPosition = () => {
        if (!buttonRef.current) return;
        const rect = buttonRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const openUp = spaceBelow < 220 && rect.top > spaceBelow;
        setMenuStyle({
            position: 'fixed',
            left: rect.left,
            width: rect.width,
            zIndex: 80,
            ...(openUp
                ? { bottom: window.innerHeight - rect.top + 4 }
                : { top: rect.bottom + 4 }),
        });
    };

    useLayoutEffect(() => {
        if (!open) return;
        updateMenuPosition();
    }, [open]);

    useEffect(() => {
        if (!open) {
            setQuery('');
            return undefined;
        }
        const onDocumentClick = (event) => {
            if (!rootRef.current?.contains(event.target)) setOpen(false);
        };
        const onKey = (event) => {
            if (event.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDocumentClick);
        window.addEventListener('keydown', onKey);
        window.addEventListener('resize', updateMenuPosition);
        window.addEventListener('scroll', updateMenuPosition, true);
        const raf = window.requestAnimationFrame(() => searchRef.current?.focus());
        return () => {
            window.cancelAnimationFrame(raf);
            document.removeEventListener('mousedown', onDocumentClick);
            window.removeEventListener('keydown', onKey);
            window.removeEventListener('resize', updateMenuPosition);
            window.removeEventListener('scroll', updateMenuPosition, true);
        };
    }, [open]);

    const selectOption = (optionValue) => {
        onChange?.(String(optionValue));
        setOpen(false);
    };

    return (
        <div className={`relative w-full ${className}`} ref={rootRef}>
            {required && (
                <input
                    tabIndex={-1}
                    className="absolute opacity-0 w-px h-px overflow-hidden"
                    value={value || ''}
                    onChange={() => {}}
                    required
                    disabled={disabled}
                />
            )}

            <button
                ref={buttonRef}
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => !disabled && setOpen(o => !o)}
                className={`w-full flex items-center gap-2 border rounded p-2 text-sm text-left bg-white
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : 'hover:border-indigo-300'}
                    ${open ? 'border-indigo-400 ring-2 ring-indigo-100' : 'border-gray-300'}`}
            >
                {icon}
                <span className={`flex-1 truncate ${selected ? 'text-slate-800' : 'text-slate-400'}`}>
                    {selected?.label || placeholder}
                </span>
                <span className="text-slate-400 text-xs shrink-0">{open ? '▴' : '▾'}</span>
            </button>

            {open && (
                <div
                    style={menuStyle}
                    className="bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden"
                >
                    <div className="p-2 border-b border-slate-100">
                        <input
                            ref={searchRef}
                            type="search"
                            className="w-full border border-slate-200 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-300"
                            placeholder={searchPlaceholder}
                            value={query}
                            aria-label={searchPlaceholder}
                            onChange={(e) => setQuery(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => e.stopPropagation()}
                        />
                    </div>
                    <div className="max-h-48 overflow-y-auto" role="listbox">
                        {filtered.map((option) => {
                            const isSelected = String(option.value) === String(value);
                            return (
                                <div
                                    key={option.value}
                                    role="option"
                                    aria-selected={isSelected}
                                    className={`px-3 py-2 text-sm cursor-pointer flex justify-between gap-2
                                        ${isSelected ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-slate-700 hover:bg-slate-50'}`}
                                    onClick={() => selectOption(option.value)}
                                >
                                    <span className="truncate">{option.label}</span>
                                    {option.meta ? (
                                        <span className="text-xs text-slate-400 shrink-0">{option.meta}</span>
                                    ) : null}
                                </div>
                            );
                        })}
                        {filtered.length === 0 ? (
                            <div className="px-3 py-3 text-sm text-slate-400 text-center">{emptyLabel}</div>
                        ) : null}
                    </div>
                </div>
            )}
        </div>
    );
}
