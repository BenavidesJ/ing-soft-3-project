import React from 'react';
import { useFormContext } from 'react-hook-form';

interface Option {
  value: string;
  label: string;
}

interface SelectInputProps {
  name: string;
  label: string;
  options: Option[];
}

export const SelectInput: React.FC<SelectInputProps> = ({
  name,
  label,
  options,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <div className="mb-3">
      <label htmlFor={name} className="form-label">
        {label}
      </label>
      <select
        id={name}
        {...register(name)}
        className={`form-control ${errors[name] ? 'is-invalid' : ''}`}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {errors[name] && (
        <div className="invalid-feedback">{(errors as any)[name]?.message}</div>
      )}
    </div>
  );
};
