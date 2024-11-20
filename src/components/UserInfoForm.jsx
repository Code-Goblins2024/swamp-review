import React from "react";
import { Box, FormLabel, Typography } from "@mui/joy";
import FormItem from "./FormItem";
import FormSelect from "./FormSelect";

const UserInfoForm = ({
  email,
  formData,
  formErrors,
  handleFormChange,
  years,
}) => {
  return (
    <>
      <Box sx={{ width: "100%" }}>
        <FormLabel>Email</FormLabel>
        <Typography level="body-sm" fontWeight="xl">
          {email}
        </Typography>
      </Box>

      <FormItem
        label="Firstname"
        name="firstname"
        type="text"
        value={formData.firstname}
        onChange={handleFormChange}
        error={formErrors.firstname}
      />

      <FormItem
        label="Lastname"
        name="lastname"
        type="text"
        value={formData.lastname}
        onChange={handleFormChange}
        error={formErrors.lastname}
      />

      <FormItem
        label="Major"
        name="major"
        type="text"
        value={formData.major}
        onChange={handleFormChange}
        error={formErrors.major}
      />

      <FormSelect
        label="Year"
        name="year"
        value={formData.year}
        onChange={handleFormChange}
        error={formErrors.year}
        options={years}
      />
    </>
  );
};

export default UserInfoForm;
