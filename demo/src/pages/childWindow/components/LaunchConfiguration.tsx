import React from "react";

interface IProps {
  children?: JSX.Element | JSX.Element[];
}

export default ({ children }: IProps) => (
  <>
    <h4>Child Window Launch Configuration</h4>
    {children}
  </>
);
