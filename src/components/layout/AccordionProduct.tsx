import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import MinimizeIcon from "@mui/icons-material/Minimize";
import { useState } from "react";
import { brand, fonts } from "@/src/lib/designTokens";

export default function AccordionProduct() {
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  
  const handleClick = (id: number) => {
    setSelectedItem(id === selectedItem ? null : id);
  };

  const items = [
    {
      id: 1,
      name: "Fit & Sizing",
      content:
        "📐 We recommend taking your usual size. On average, customers say this style fits true to size. Amee (Studio Model) is 5'2, usually wears an XS and wears a size XS here.",
    },
    {
      id: 2,
      name: "Fabric & Care",
      content:
        "Fabric: Cupro luxe, Made in Turkey. 100% cupro, 38% Elastane, 100% vegan materials. Care: Cold machine wash, line dry. Do not tumble dry or dry clean. Do not use bleach or fabric softener.",
    },
    {
      id: 3,
      name: "Product Details",
      content:
        "Tailored + slim fit. High waisted. Elasticated waistband. Cut out detail at the side finished with a gunmetal snap. Side pockets. Front pleats. 3\" cuff at the hem.",
    },
    {
      id: 4,
      name: "Shipping & Returns",
      content:
        "Shipping: Free shipping on US and Canada orders over $175. Returns: Unwashed, worn items are eligible for returns or exchanges within 30 days of purchase. Final Sale items are not eligible for returns or exchanges.",
    },
  ];

  return (
    <Box
      sx={{
        width: '100%',
        mt: 4,
        mb: 6,
        borderTop: `1px solid ${brand.border}`,
      }}
    >
      {items.map((item) => (
        <Accordion
          key={item.id}
          expanded={selectedItem === item.id}
          onChange={() => handleClick(item.id)}
          square
          sx={{
            backgroundColor: 'transparent',
            boxShadow: 'none',
            borderBottom: `1px solid ${brand.border}`,
            '&::before': {
              display: 'none',
            },
          }}
        >
          <AccordionSummary
            expandIcon={
              selectedItem === item.id ? (
                <MinimizeIcon sx={{ fontSize: '1.2rem', color: brand.sage }} />
              ) : (
                <AddIcon sx={{ fontSize: '1.2rem', color: brand.charcoal }} />
              )
            }
            sx={{
              px: 0,
              py: 0.5,
              '& .MuiAccordionSummary-content': {
                margin: '12px 0',
              },
            }}
          >
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontWeight: 600,
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                color: selectedItem === item.id ? brand.sage : brand.ink,
              }}
            >
              {item.name}
            </Typography>
          </AccordionSummary>
          <AccordionDetails sx={{ px: 0, pb: 2.5, pt: 0 }}>
            <Typography
              sx={{
                fontFamily: fonts.sans,
                fontSize: '0.9rem',
                lineHeight: 1.6,
                color: brand.muted,
              }}
            >
              {item.content}
            </Typography>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
