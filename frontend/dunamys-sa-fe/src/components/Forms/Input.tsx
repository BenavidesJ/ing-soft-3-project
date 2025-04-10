import { InputHTMLAttributes, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Form as BSForm } from 'react-bootstrap';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string;
  label?: string;
  type?: string;
  helperText?: string;
  size?: 'sm' | 'lg';
  value?: string | number | string[] | undefined;
}

export const Input = ({
  name,
  label,
  type = 'text',
  helperText,
  size,
  value,
  ...rest
}: InputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;
  const registeredProps = register(name);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <BSForm.Group className="mb-3" controlId={name}>
      {label && <BSForm.Label>{label}</BSForm.Label>}
      <div className="position-relative" style={{ minHeight: '2.5rem' }}>
        <BSForm.Control
          type={inputType}
          size={size}
          {...registeredProps}
          {...rest}
          isInvalid={!!errorMessage}
          value={value}
        />
        {isPassword && (
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="position-absolute"
            style={{
              right: '2rem',
              top: '5px',
              cursor: 'pointer',
            }}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        )}
        {helperText && (
          <BSForm.Text className="text-muted">{helperText}</BSForm.Text>
        )}
        <BSForm.Control.Feedback type="invalid">
          {errorMessage}
        </BSForm.Control.Feedback>
      </div>
    </BSForm.Group>
  );
};
