import React from 'react';
import { PickerProps } from 'antd/lib/date-picker/generatePicker';
import { DayjsDatePicker } from './DayjsDatePicker';
import { AppDate } from '@app/constants/Dates';

type DatePickerProps = PickerProps<AppDate>;

// eslint-disable-next-line react/display-name
export const DatePicker = React.forwardRef<React.Component<DatePickerProps>, DatePickerProps>(
  ({ className, ...props }, ref) => <DayjsDatePicker ref={ref} className={className} {...props} />,
);
