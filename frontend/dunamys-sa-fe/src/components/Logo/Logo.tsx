import React from 'react';

interface LogoProps {
  image?: React.ReactNode;
  text: string;
}

export const Logo = ({ text, image }: LogoProps) => {
  return (
    <div>
      {image && (
        <img
          alt=""
          src="/img/logo.svg"
          width="30"
          height="30"
          className="d-inline-block align-top"
        />
      )}
      <span>{text}</span>
    </div>
  );
};
