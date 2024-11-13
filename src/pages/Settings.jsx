import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AspectRatio,
  Box,
  Button,
  Divider,
  FormControl,
  FormLabel,
  Input,
  IconButton,
  Textarea,
  Stack,
  Typography,
  Card,
  CardActions,
  CardOverflow,
  CircularProgress,
} from "@mui/joy";
import { Person as PersonIcon, EditRounded as EditRoundedIcon } from "@mui/icons-material";
import supabase from "../config/supabaseClient";
import useAuth from "../store/authStore";
import { getUser } from "../functions/userQueries";
import { years, roles } from "../constants/Enums";

const Settings = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    await Promise.all([fetchUser()]);
    setLoading(false);
  };

  const fetchUser = async () => {
    try {
      const data = await getUser(session.user.id);
      setUser(data);
      
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser([]);
    }
  };

  const imageUrl = user[0]?.profile_image;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flex: 1, width: "100%" }}>
      <Stack
        spacing={4}
        sx={{
          maxWidth: "800px",
          mx: "auto",
          px: { xs: 2, md: 6 },
          py: { xs: 2, md: 3 },
        }}
      >
        <Card>
          <Box sx={{ mb: 1, textAlign: "center" }}>
            <Typography variant="h5" sx={{ color: "text.primary" }}>
              Personal Info
            </Typography>
            <Typography variant="body2">
              Customize your profile information
            </Typography>
          </Box>
          <Divider />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{ my: 2 }}
          >
            <Stack direction="column" spacing={1}>
              <AspectRatio
                ratio="1"
                maxHeight={200}
                sx={{ flex: 1, minWidth: 120, borderRadius: '100%' }}
              >
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
                  srcSet="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286&dpr=2 2x"
                  loading="lazy"
                  alt=""
                />
              </AspectRatio>
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                  bgcolor: 'background.body',
                  position: 'absolute',
                  zIndex: 2,
                  borderRadius: '50%',
                  left: 100,
                  top: 170,
                  boxShadow: 'sm',
                }}
              >
                <EditRoundedIcon />
              </IconButton>
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input placeholder="First Name" />
              </FormControl>
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input placeholder="Last Name" />
              </FormControl>
              <FormControl>
                <FormLabel>Email</FormLabel>
                <Input type="email" placeholder="Email" sx={{ flexGrow: 1 }} />
              </FormControl>
              <FormControl>
                <FormLabel>Major</FormLabel>
                <Input placeholder="Your Major" />
              </FormControl>
            </Stack>
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
              <Button variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
        <Card>
          <Box sx={{ mb: 1 }}>
            <Typography variant="h5">Bio</Typography>
            <Typography variant="body2">
              Write a short introduction for your profile
            </Typography>
          </Box>
          <Divider />
          <Stack spacing={2} sx={{ my: 2 }}>
            <Textarea minRows={4} placeholder="Tell us a bit about yourself" />
          </Stack>
          <CardOverflow sx={{ borderTop: "1px solid", borderColor: "divider" }}>
            <CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
              <Button variant="outlined" color="neutral">
                Cancel
              </Button>
              <Button variant="contained" color="primary">
                Save
              </Button>
            </CardActions>
          </CardOverflow>
        </Card>
      </Stack>
    </Box>
  );
};

export default Settings;
