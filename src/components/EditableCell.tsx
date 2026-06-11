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
      autoFocus
      sx={{
        minWidth: 150,
        "& .MuiOutlinedInput-root": {
          borderRadius: "6px",
          backgroundColor: "var(--bg)",
          transition: "all 0.2s",
          "& fieldset": {
            borderColor: "var(--border)",
          },
          "&:hover fieldset": {
            borderColor: "var(--primary)",
          },
          "&.Mui-focused fieldset": {
            borderColor: "var(--primary)",
            borderWidth: 2,
          },
        },
        "& .MuiOutlinedInput-input": {
          color: "var(--text)",
          fontWeight: 500,
          fontSize: { xs: "0.85rem", md: "0.95rem" },
          py: 1,
          px: 1.25,
        },
        "& .MuiOutlinedInput-input::placeholder": {
          color: "var(--text-lighter)",
          opacity: 0.7,
        },
      }}
    />
  );
};

export default React.memo(EditableCell);