import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Divider,
  FormLabel,
  Grid,
  IconButton,
  Modal,
  ModalDialog,
  ModalClose,
  Typography,
  Stack,
  CircularProgress,
  Card,
  CardActions,
} from "@mui/joy";
import { EditRounded as EditRoundedIcon } from "@mui/icons-material";
import useAuth from "../store/authStore";
import { getUser, updateUser } from "../functions/userQueries";
import UserIcon from "../components/UserIcon";
import { years } from "../constants/Enums";
import UserInfoForm from "../components/UserInfoForm";
import FormRadio from "../components/FormRadio";

const Settings = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [loading, setLoading] = useState(true);

  // Data states
  const [user, setUser] = useState(null);

  // Modal states
  const [imageModalOpen, setImageModalOpen] = useState(false);

  // Form states
  const formDataTemplate = {
    firstname: "",
    lastname: "",
    major: "",
    year: "",
    theme_ld: "",
    icon_color: "",
  };
  const [formData, setFormData] = useState({ ...formDataTemplate });
  const [formErrors, setFormErrors] = useState({ ...formDataTemplate });
  const [generalError, setGeneralError] = useState("");

  // Color selection
  const [colorValue, setColorValue] = useState("#ffffff");

  const colors = [
    "red",
    "pink",
    "orange",
    "yellow",
    "lime",
    "lightGreen",
    "green",
    "teal",
    "cyan",
    "lightBlue",
    "blue",
    "indigo",
    "purple",
    "grey",
  ];

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session]);

  const fetchData = async () => {
    try {
      const data = await getUser(session.user.id);
      if (data && data[0]) {
        setUser(data[0]);
        setFormData({
          firstname: data[0].first_name || "",
          lastname: data[0].last_name || "",
          major: data[0].major || "",
          year: data[0].year || "",
          theme_ld: data[0].theme_ld || "",
        });
        setColorValue(data[0].icon_color || "#ffffff");
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setGeneralError("");
    setFormErrors({ ...formErrors, [name]: "" });
    setFormData({ ...formData, [name]: value });
  };

  const validateUpdate = () => {
    let newFormErrors = { ...formDataTemplate };
    if (!formData.firstname.trim())
      newFormErrors.firstname = "Firstname cannot be empty.";
    if (!formData.lastname.trim())
      newFormErrors.lastname = "Lastname cannot be empty.";
    if (!formData.major.trim()) newFormErrors.major = "Major cannot be empty.";
    if (!formData.year.trim()) newFormErrors.year = "Year cannot be empty.";
    setFormErrors(newFormErrors);
    return Object.values(newFormErrors).every((value) => !value);
  };

  const handleUpdate = async () => {
    if (!validateUpdate()) return;
    setLoading(true);

    const updatedUser = {
      first_name: formData.firstname,
      last_name: formData.lastname,
      major: formData.major,
      year: formData.year,
      icon_color: colorValue,
      theme_ld: formData.theme_ld,
    };

    try {
      const { error } = await updateUser(session.user.id, updatedUser);
      if (error) throw error;
      await fetchData(); // Refresh the data
    } catch (error) {
      console.error("Error updating user:", error);
      setGeneralError("Failed to update user information. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const cancelUpdate = () => {
    if (loading) return;
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      firstname: user?.first_name || "",
      lastname: user?.last_name || "",
      major: user?.major || "",
      year: user?.year || "",
    });
    setGeneralError("");
    setFormErrors({ ...formDataTemplate });
  };

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
            <Typography level="h5" sx={{ color: "text.primary" }}>
              Personal Info
            </Typography>
            <Typography level="body2">
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
              <UserIcon height={100} width={100} bgcolor={colorValue} />
              <IconButton
                aria-label="upload new picture"
                size="sm"
                variant="outlined"
                color="neutral"
                sx={{
                  bgcolor: "background.body",
                  position: "absolute",
                  zIndex: 2,
                  borderRadius: "50%",
                  left: 100,
                  top: 170,
                  boxShadow: "sm",
                }}
                onClick={() => setImageModalOpen(true)}
              >
                <EditRoundedIcon />
              </IconButton>
              <Modal
                open={imageModalOpen}
                onClose={() => setImageModalOpen(false)}
              >
                <ModalDialog variant="outlined">
                  <ModalClose />
                  <Typography level="body2">Change Color</Typography>
                  <Grid container spacing={1} sx={{ my: 2 }}>
                    {colors.map((color) => (
                      <Grid xs={3} key={color}>
                        <Box
                          sx={{
                            width: 30,
                            height: 30,
                            backgroundColor: color,
                            borderRadius: "sm",
                            cursor: "pointer",
                            border:
                              colorValue === color
                                ? "2px solid black"
                                : "2px solid transparent",
                          }}
                          onClick={() => setColorValue(color)}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </ModalDialog>
              </Modal>
            </Stack>
            <Stack spacing={2} sx={{ flexGrow: 1 }}>
            <UserInfoForm
              email={user?.email}
              formData={formData}
              formErrors={formErrors}
              handleFormChange={handleFormChange}
              years={years}
            />

              <FormRadio
                  label="Theme"
                  name="theme_ld"
                  value={formData.theme_ld}
                  onChange={handleFormChange}
                  error={formErrors.theme_ld}
                  options={["system","light", "dark"]}
              />
            </Stack>
          </Stack>
          {generalError && (
            <Typography level="body2" color="danger" sx={{ mb: 1 }}>
              {generalError}
            </Typography>
          )}
          <CardActions sx={{ justifyContent: "center" }}>
            <Button onClick={cancelUpdate} disabled={loading} color="neutral">
              Cancel
            </Button>
            <Button
              disabled={loading}
              loading={loading}
              onClick={handleUpdate}
              variant="solid"
            >
              Update
            </Button>
          </CardActions>
        </Card>
      </Stack>
    </Box>
  );
};

export default Settings;
