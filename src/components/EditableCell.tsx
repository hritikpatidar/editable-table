import React from "react";
import TextField from "@mui/material/TextField";

interface EditableCellProps {
  value: string | number;
  type?: "text" | "number";
  disabled?: boolean;
  onChange: (value: string | number) => void;
}

const EditableCell: React.FC<EditableCellProps> = ({
  value,
  type = "text",
  disabled = false,
  onChange,
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    if (type === "number") {
      onChange(inputValue === "" ? "" : Number(inputValue));
    } else {
      onChange(inputValue);
    }
  };

  return (
    <TextField
      fullWidth
      size="small"
      variant="outlined"
      type={type}
      value={value}
      disabled={disabled}
      onChange={handleChange}
      sx={{
        minWidth: 180,
        "& .MuiOutlinedInput-root": {
          borderRadius: "8px",
          backgroundColor: "#fff",
        },
      }}
    />
  );
};

export default React.memo(EditableCell);