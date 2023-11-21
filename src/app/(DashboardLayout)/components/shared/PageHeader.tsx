import { Box, Breadcrumbs, Typography } from "@mui/material";
import React from "react";
import Link from "./Link";

export type PageMeta = {
  title: string;
  description?: string;
  breadcrumb?: { text: string; href?: string }[];
  image?: string;
};

const PageHeader = ({ title, breadcrumb, image }: PageMeta) => {
  return (
    <Box
      sx={{
        width: "100%",
        height: 110,
        padding: 3,
        marginBottom: 3,
        borderRadius: 2,
        backgroundColor: "primary.light",
        backgroundImage: image ? `url(${image})` : "none",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "right 30px bottom",
        backgroundSize: "contain",
      }}
    >
      <Typography variant="h3" gutterBottom>
        {title}
      </Typography>

      <Breadcrumbs aria-label="breadcrumb">
        <Link underline="hover" color="inherit" href="/">
          Home
        </Link>

        {breadcrumb &&
          breadcrumb.map((item, index) => (
            <Link
              key={index}
              underline="hover"
              color="inherit"
              href={item.href ?? "#"}
            >
              {item.text}
            </Link>
          ))}
      </Breadcrumbs>
    </Box>
  );
};

export default PageHeader;
