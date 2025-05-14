import React from "react";
import { Box, Container, Typography, Link, Grid, Divider } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import {
  FaGithub,
  FaLinkedin,
  FaFacebook,
  FaInstagram,
  FaGlobe,
} from "react-icons/fa";

const Footer = () => {
  // Social media links
  const socialLinks = [
    {
      icon: FaGithub,
      url: "https://github.com/Eshan-Nayanapriya",
      color: "#f0f6fc",
    },
    {
      icon: FaLinkedin,
      url: "http://www.linkedin.com/in/eshan-nayanapriya-5940b72b0",
      color: "#0077b5",
    },
    {
      icon: FaGlobe,
      url: "https://eshan-nayanapriya.github.io/My_Portfolio",
      color: "#64ffda",
    },
    {
      icon: FaInstagram,
      url: "https://www.instagram.com/eshan_mr_?igsh=aHVwbGo0YXYzanFk",
      color: "#e1306c",
    },
    {
      icon: FaFacebook,
      url: "https://www.facebook.com/profile.php?id=100084452055273&mibextid=ZbWKwL",
      color: "#1877f2",
    },
  ];

  const footerLinkStyle = {
    color: "rgba(255,255,255,0.9)",
    "&:hover": { color: "#a5d8ff" },
  };

  const resourceLinks = [
    "Country Data API",
    "Documentation",
    "Privacy Policy",
    "Terms of Service",
  ];

  const policyLinks = ["Privacy Policy", "Terms of Service", "Cookie Policy"];

  return (
    <Box
      component="footer"
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 mt-auto"
    >
      <Container
        maxWidth="xl"
        className="MuiContainer-root MuiContainer-maxWidthXl"
      >
        <Grid container spacing={4}>
          {/* About */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-bold text-xl mb-4">
              WorldView
            </Typography>
            <Typography variant="body2" className="text-white/90 mb-4">
              Discover the world's countries, their cultures, and fascinating
              facts. Your gateway to global exploration.
            </Typography>
            <Box className="flex gap-4 mt-6">
              {socialLinks.map((social, index) => (
                <div
                  key={index}
                  className="cursor-pointer transition-transform hover:scale-110"
                  onClick={() => window.open(social.url, "_blank")}
                >
                  <social.icon size={24} style={{ color: social.color }} />
                </div>
              ))}
            </Box>
          </Grid>

          {/* Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-bold text-xl mb-4">
              Quick Links
            </Typography>
            <Box className="flex flex-col gap-2">
              <Link
                component={RouterLink}
                to="/"
                sx={footerLinkStyle}
                className="transition-colors"
              >
                Home
              </Link>
              <Link
                component={RouterLink}
                to="/favorites"
                sx={footerLinkStyle}
                className="transition-colors"
              >
                Favorites
              </Link>
              <Typography variant="body2" className="text-white/90">
                About Us
              </Typography>
              <Typography variant="body2" className="text-white/90">
                Contact
              </Typography>
            </Box>
          </Grid>

          {/* Resources */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-bold text-xl mb-4">
              Resources
            </Typography>
            <Box className="flex flex-col gap-2">
              {resourceLinks.map((item, index) => (
                <Typography
                  key={index}
                  variant="body2"
                  className="text-white/90"
                >
                  {item}
                </Typography>
              ))}
            </Box>
          </Grid>

          {/* Newsletter */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" className="font-bold text-xl mb-4">
              Stay Updated
            </Typography>
            <Typography variant="body2" className="text-white/90 mb-4">
              Subscribe to our newsletter for the latest updates and travel
              tips.
            </Typography>
            <Box className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:outline-none focus:border-white/50 w-full"
              />
              <button className="px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors whitespace-nowrap">
                Subscribe
              </button>
            </Box>
          </Grid>
        </Grid>

        <Divider className="my-6 bg-white/30" />

        {/* Footer bottom */}        <Box className="flex flex-col md:flex-row justify-between items-center">
          <Typography variant="body2" className="text-white/90">
            © {new Date().getFullYear()} WorldView. All rights reserved.
          </Typography>
          <Box className="flex gap-4 mt-4 md:mt-0">
            {policyLinks.map((item, index) => (
              <Typography
                key={index}
                variant="body2"
                className="text-white/90 text-sm"
              >
                {item}
              </Typography>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
