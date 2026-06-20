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

function FooterGridMobile() {
  return (
    <Box sx={{ pt: 4 }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          pb: 4,
          borderBottom: "1px solid rgba(29, 45, 20, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "600",
            fontFamily: fonts.display,
            color: "#1d2d14",
            fontSize: "20px",
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

      <Grid container spacing={4} sx={{ py: 4 }}>
        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#1d2d14",
                fontFamily: fonts.sans,
                mb: 0.5,
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
                }}
              >
                Shopping Cart
              </Typography>
            </Link>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#1d2d14",
                fontFamily: fonts.sans,
                mb: 0.5,
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
                }}
              >
                Email Support
              </Typography>
            </Link>
          </Box>
        </Grid>

        <Grid item xs={6}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: "600",
                fontSize: "13px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                color: "#1d2d14",
                fontFamily: fonts.sans,
                mb: 0.5,
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
                }}
              >
                Create Account
              </Typography>
            </Link>
          </Box>
        </Grid>
      </Grid>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          pt: 2,
          borderTop: "1px solid rgba(29, 45, 20, 0.1)",
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
  );
}

export default FooterGridMobile;
