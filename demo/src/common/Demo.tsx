import React from "react";

interface IProps {
  children?: JSX.Element | JSX.Element[];
}

export default ({ children }: IProps) => (
  <>
    <h2>Try it out</h2>
    {children}
  </>
);
