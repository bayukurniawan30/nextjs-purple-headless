import React from "react";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";

const CustomButton = styled((props: any) => <Button {...props} />)(
  ({ theme }) => ({
    color: '#FFFFFF',
    "&:hover": {
      backgroundColor: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main,
      boxShadow: "none",
    },
    "&:active": {
      backgroundColor: theme.palette.secondary.main,
      borderColor: theme.palette.secondary.main,
      boxShadow: "none",
    },
  })
);

export default CustomButton;
