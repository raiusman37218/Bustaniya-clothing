import { Box, Grid, Typography, TextField, FormControlLabel, Checkbox } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import InputAdornment from "@mui/material/InputAdornment";
import InstagramIcon from "@mui/icons-material/Instagram";
import FacebookOutlinedIcon from "@mui/icons-material/FacebookOutlined";
import PinterestIcon from "@mui/icons-material/Pinterest";
import TwitterIcon from "@mui/icons-material/Twitter";
import CopyrightIcon from "@mui/icons-material/Copyright";
import Link from "next/link";
import { brand, fonts } from "@/src/lib/designTokens";

function FooterGridDesktop() {
  return (
    <Grid container spacing={4} justifyContent="space-between">
      <Grid item xs={12} md={5}>
        <Box
          sx={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}
          >
            <Typography
              variant="h5"
              sx={{
                fontWeight: "600",
                fontFamily: fonts.display,
                color: "#1d2d14",
              }}
            >
              Join our club, get 15% off for your Birthday
            </Typography>
            <form onSubmit={(e) => e.preventDefault()}>
              <TextField
                placeholder="Enter your email"
                variant="outlined"
                sx={{
                  width: "100%",
                  maxHeight: "56px",
                  "& .MuiOutlinedInput-root": {
                    color: "#1d2d14",
                    fontFamily: fonts.sans,
                    borderRadius: "2px",
                    "& fieldset": {
                      borderColor: "rgba(29, 45, 20, 0.3)",
                      transition: "border-color 0.3s ease",
                    },
                    "&:hover fieldset": {
                      borderColor: "#1d2d14",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "#1d2d14",
                    },
                  },
                  "& .MuiInputBase-input::placeholder": {
                    color: "rgba(29, 45, 20, 0.5)",
                    opacity: 1,
                  },
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <ArrowForwardIcon 
                        sx={{ 
                          color: "#1d2d14", 
                          cursor: "pointer", 
                          transition: "color 0.2s",
                          "&:hover": { color: "rgba(29, 45, 20, 0.7)" } 
                        }} 
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </form>
            <FormControlLabel
              control={
                <Checkbox
                  sx={{
                    color: "rgba(29, 45, 20, 0.6)",
                    "&.Mui-checked": { color: "#1d2d14" },
                  }}
                />
              }
              label="By submitting your email, you agree to receive advertising emails from Bustaniya."
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                alignItems: "flex-start",
                mt: -0.5,
                "& .MuiFormControlLabel-label": {
                  fontWeight: "400",
                  width: "100%",
                  fontSize: "13px",
                  lineHeight: 1.4,
                  fontFamily: fonts.sans,
                },
              }}
            />
          </Box>

          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "20px",
              mt: { md: 4 },
            }}
          >
            <Box sx={{ display: "flex", gap: "16px" }}>
              <InstagramIcon sx={{ fontSize: "28px", color: "rgba(29, 45, 20, 0.7)", cursor: "pointer", transition: "color 0.2s", "&:hover": { color: "#1d2d14" } }} />
              <FacebookOutlinedIcon sx={{ fontSize: "28px", color: "rgba(29, 45, 20, 0.7)", cursor: "pointer", transition: "color 0.2s", "&:hover": { color: "#1d2d14" } }} />
              <PinterestIcon sx={{ fontSize: "28px", color: "rgba(29, 45, 20, 0.7)", cursor: "pointer", transition: "color 0.2s", "&:hover": { color: "#1d2d14" } }} />
              <TwitterIcon sx={{ fontSize: "28px", color: "rgba(29, 45, 20, 0.7)", cursor: "pointer", transition: "color 0.2s", "&:hover": { color: "#1d2d14" } }} />
            </Box>

            <Box sx={{ display: "flex", gap: "8px", alignItems: "center" }}>
              <CopyrightIcon sx={{ fontSize: "16px", color: "rgba(29, 45, 20, 0.5)" }} />
              <Typography sx={{ fontSize: "13px", color: "rgba(29, 45, 20, 0.5)", fontFamily: fonts.sans }}>
                2026 Bustaniya. All Rights Reserved.
              </Typography>
            </Box>
          </Box>
        </Box>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "4px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#1d2d14",
              fontFamily: fonts.sans,
              mb: 1,
            }}
          >
            Shop & Explore
          </Typography>

          <Link href="/shop" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              Shop Catalog
            </Typography>
          </Link>

          <Link href="/wishlist" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              My Wishlist
            </Typography>
          </Link>

          <Link href="/cart" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              Shopping Cart
            </Typography>
          </Link>
        </Box>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "4px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#1d2d14",
              fontFamily: fonts.sans,
              mb: 1,
            }}
          >
            Customer Care
          </Typography>

          <Link href="/faq" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              FAQs & Help
            </Typography>
          </Link>

          <Link href="/order-track" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              Track My Order
            </Typography>
          </Link>

          <Link href="/contact-us" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              Contact Us
            </Typography>
          </Link>

          <Link href="mailto:support@bustaniya.com" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              Email Support
            </Typography>
          </Link>
        </Box>
      </Grid>

      <Grid item xs={6} sm={4} md={2}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            padding: "4px",
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: "600",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.1em",
              color: "#1d2d14",
              fontFamily: fonts.sans,
              mb: 1,
            }}
          >
            My Account
          </Typography>

          <Link href="/login" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              Sign In
            </Typography>
          </Link>

          <Link href="/register" passHref style={{ textDecoration: 'none' }}>
            <Typography
              sx={{
                color: "rgba(29, 45, 20, 0.7)",
                fontSize: "14px",
                fontFamily: fonts.sans,
                transition: "all 0.2s ease",
                cursor: "pointer",
                "&:hover": {
                  color: "#1d2d14",
                  transform: "translateX(4px)",
                },
              }}
            >
              Create Account
            </Typography>
          </Link>
        </Box>
      </Grid>
    </Grid>
  );
}

export default FooterGridDesktop;
