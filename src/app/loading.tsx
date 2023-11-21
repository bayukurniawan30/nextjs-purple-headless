import { CircularProgress } from "@mui/material";

const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100%",
      }}
    >
      <CircularProgress color="secondary" />
    </div>
  );
};

export default Loading;
