import BSForm from 'react-bootstrap/Form';

interface FormProps {
  children: React.ReactNode;
}

export const Form = ({ children }: FormProps) => {
  return <BSForm>{children}</BSForm>;
};
