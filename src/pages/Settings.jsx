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
  Modal,
  ModalDialog,
  ModalClose,
  Textarea,
  Stack,
  Typography,
  Card,
  CardActions,
  CardOverflow,
  CircularProgress,
} from "@mui/joy";
import { Person as PersonIcon, EditRounded as EditRoundedIcon, FileUpload } from "@mui/icons-material";
import supabase from "../config/supabaseClient";
import useAuth from "../store/authStore";
import { getUser } from "../functions/userQueries";
import { years, roles } from "../constants/Enums";
import UserIcon from "../components/UserIcon";
import { MuiColorInput } from 'mui-color-input'


const Settings = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const handleOpen = () => setImageModalOpen(true);
  const handleClose = () => setImageModalOpen(false);
  
  const [colorValue, setColorValue] = React.useState('#ffffff');
  const handleColorChange = (newValue) => {
    setColorValue(newValue)
  }

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
      setColorValue(user?.icon_color);
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
              <UserIcon
              height={100}
              width={100}
              bgcolor={colorValue}
              />
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                color="neutral"
                onClick={handleOpen}
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
              {/* Edit Image Modal */}
              <Modal open={imageModalOpen} onClose={handleClose}>
              <ModalDialog variant="outlined">
                    <ModalClose />
                    <Typography variant="body2">Change Color</Typography>
                    <MuiColorInput format="hex" value={colorValue} onChange={handleColorChange} />
                  </ModalDialog>
                </Modal>
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
      </Stack>
    </Box>
  );
};

export default Settings;
