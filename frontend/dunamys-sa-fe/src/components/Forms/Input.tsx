import { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { Form as BSForm } from 'react-bootstrap';

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

  return (
    <BSForm.Group className="mb-3" controlId={name}>
      {label && <BSForm.Label>{label}</BSForm.Label>}
      <BSForm.Control
        type={type}
        size={size}
        {...registeredProps}
        {...rest}
        isInvalid={!!errorMessage}
        value={value}
      />
      {helperText && (
        <BSForm.Text className="text-muted">{helperText}</BSForm.Text>
      )}
      <BSForm.Control.Feedback type="invalid">
        {errorMessage}
      </BSForm.Control.Feedback>
    </BSForm.Group>
  );
};
