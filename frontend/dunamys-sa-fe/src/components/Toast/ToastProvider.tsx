import React, { useState, useEffect } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';
import { setToastCallback, ToastVariant } from '../../services/toastService';

interface ToastData {
  show: boolean;
  message: string;
  variant: ToastVariant;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toastData, setToastData] = useState<ToastData>({
    show: false,
    message: '',
    variant: 'danger',
  });

  const showToastHandler = (
    message: string,
    variant: ToastVariant = 'danger'
  ) => {
    setToastData({ show: true, message, variant });
  };

  useEffect(() => {
    setToastCallback(showToastHandler);
  }, []);

  const handleClose = () => {
    setToastData((prev) => ({ ...prev, show: false }));
  };

  return (
    <>
      {children}
      <ToastContainer position="bottom-center" className="p-3">
        <Toast
          show={toastData.show}
          onClose={handleClose}
          delay={3000}
          autohide
          bg={toastData.variant}
        >
          <Toast.Body
            className={
              toastData.variant === 'warning' ? 'text-dark' : 'text-white'
            }
          >
            {toastData.message}
          </Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};
