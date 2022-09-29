import { Input } from "antd";
import { FC, ReactElement } from "react";

interface Props {
  children?: ReactElement;
  label: string;
}

const FilterWrapper: FC<Props> = ({ label, children }) => {
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: 16,
        marginBottom: 16,
        maxWidth: 800,
        borderRadius: 5,
        boxShadow: "0 0.5px 0 0 #ffffff inset, 0 1px 2px 0 #B3B3B3",
      }}
    >
      <h3>{label}</h3>
      <Input.Group style={{ display: "flex", width: "auto", gap: 12 }}>
        {children}
      </Input.Group>
    </div>
  );
};

export default FilterWrapper;
