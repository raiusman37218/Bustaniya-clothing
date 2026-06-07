import React, { PropsWithChildren } from "react";
import Image from "next/image";
import { Box } from "@mui/material";
import { radius, brand } from "@/src/lib/designTokens";

interface Types {
  Images: string;
  isHovered: boolean;
  isSelected: string;
}

export default function ProductImage(props: PropsWithChildren<Types>) {
  const { Images, isHovered, isSelected } = props;
  return (
    <Box 
      sx={{ 
        width: "100%", 
        borderRadius: radius.product,
        overflow: "hidden",
        backgroundColor: brand.imageBg,
        boxShadow: "0 4px 24px rgba(0,0,0,0.06)",
        border: `1px solid ${brand.border}`
      }}
    >
      <Image
        src={isHovered ? isSelected : Images}
        width={500}
        height={625}
        priority
        style={{ 
          objectFit: "cover", 
          width: "100%",
          height: "auto",
          display: "block"
        }}
        alt="image for detail product"
      />
    </Box>
  );
}
