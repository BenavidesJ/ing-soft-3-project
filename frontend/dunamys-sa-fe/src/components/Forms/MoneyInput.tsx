import { InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { Form as BSForm, InputGroup } from 'react-bootstrap';

export interface MoneyInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  name: string;
  label?: string;
  helperText?: string;
  size?: 'sm' | 'lg';
  value?: string | number | string[] | undefined;
}

export const MoneyInput = ({
  name,
  label,
  helperText,
  size,
  value,
  ...rest
}: MoneyInputProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message as string | undefined;
  const registeredProps = register(name);

  return (
    <BSForm.Group className="mb-3" controlId={name}>
      {label && <BSForm.Label>{label}</BSForm.Label>}
      <InputGroup>
        <InputGroup.Text>₡</InputGroup.Text>
        <BSForm.Control
          type="number"
          size={size}
          {...registeredProps}
          {...rest}
          isInvalid={!!errorMessage}
          value={value}
        />
      </InputGroup>
      {helperText && (
        <BSForm.Text className="text-muted">{helperText}</BSForm.Text>
      )}
      <BSForm.Control.Feedback type="invalid">
        {errorMessage}
      </BSForm.Control.Feedback>
    </BSForm.Group>
  );
};
