import React from 'react';
import styled from 'styled-components';
import labelled from './labelled.svg';
import unselected from './unselected.svg';

interface CheckBoxProps {
  checked: boolean;
  onClick: () => void;
  children: React.ReactChildren;
  className: string;
}

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
  img {
    margin-right: 6px;
  }
`;

const noneFunc = () => {};

function CheckBox({checked, onClick = noneFunc, children, className}: CheckBoxProps): React.ReactElement<CheckBoxProps> {
  return (
    <Wrapper className={className}>
      <img
        onClick={onClick}
        src={checked ? labelled : unselected}
        alt="check box"
      />
      <span className="content" onClick={onClick}>
        {children}
      </span>
    </Wrapper>
  );
}

export default CheckBox
