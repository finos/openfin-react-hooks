import React from "react";

interface IProps {
    children?: JSX.Element | JSX.Element[];
}

export default ({ children }: IProps) => (
    <>
        <h4>Launch Configuration</h4>
        {children}
    </>
);
