import { Button, ButtonProps } from 'react-bootstrap';
import { useFormContext } from 'react-hook-form';

export interface SubmitButtonProps extends ButtonProps {
  children?: React.ReactNode;
}

export function SubmitButton({ children, ...rest }: SubmitButtonProps) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <Button type="submit" disabled={isSubmitting} {...rest}>
      {children || 'Enviar'}
    </Button>
  );
}
