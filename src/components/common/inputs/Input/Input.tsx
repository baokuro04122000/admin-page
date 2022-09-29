import React from 'react';
import { Input as AntInput, InputProps as AntInputProps, InputRef } from 'antd';
import * as S from './Input.styles';

export interface InputProps extends AntInputProps {
  className?: string;
}

export const { TextArea } = AntInput;

// eslint-disable-next-line react/display-name
export const Input = React.forwardRef<InputRef, InputProps>(({ className, children, ...props }, ref) => (
  <S.Input ref={ref} className={className} {...props}>
    {children}
  </S.Input>
));
