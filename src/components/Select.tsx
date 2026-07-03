interface Option {
  value: string | number;
  label: string;
}

interface SelectProps {
  value: string | number | '';
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

export default function Select({
  value,
  onChange,
  options,
  placeholder = 'Select…',
  disabled,
  id,
  ...rest
}: SelectProps) {
  return (
    <select
      id={id}
      className="field-input"
      value={value === null ? '' : value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      {...rest}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}
