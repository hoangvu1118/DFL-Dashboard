import React from 'react';
import './QueryInput.css';

interface QueryInputProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  disabled?: boolean;
}

export const QueryInput: React.FC<QueryInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = 'Ask nodes a clinical question...',
  disabled = false,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      onSubmit();
    }
  };

  return (
    <div className={`fedmed-query-input ${disabled ? 'fedmed-query-input--disabled' : ''}`}>
      <div className="fedmed-query-input__search-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          width="16"
          height="16"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </div>
      <input
        type="text"
        className="fedmed-query-input__field"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
      />
      <button
        type="button"
        className="fedmed-query-input__submit"
        onClick={onSubmit}
        disabled={disabled || !value.trim()}
        aria-label="Submit clinical inference request"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          width="14"
          height="14"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
};
