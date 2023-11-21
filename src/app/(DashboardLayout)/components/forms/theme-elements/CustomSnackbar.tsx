import { styled } from "@mui/material";
import { MaterialDesignContent } from "notistack";

const CustomSnackbar = styled(MaterialDesignContent)(({ theme }) => ({
  borderWidth: "1px",
  borderStyle: "solid",
  "&.notistack-MuiContent-success": {
    borderColor: theme.palette.success.main,
    backgroundColor: "#FFFFFF",
    color: theme.palette.text.primary,
  },
  "&.notistack-MuiContent-error": {
    borderColor: theme.palette.error.main,
    backgroundColor: "#FFFFFF",
    color: theme.palette.text.primary,
  },
}));

export default CustomSnackbar;
