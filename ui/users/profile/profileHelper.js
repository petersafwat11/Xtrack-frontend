// Function to generate a random password
export const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  let password = "";
  for (let i = 0; i < 10; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Form fields configuration
export const userFormFields = [
  {
    id: "user_id",
    label: "User ID",
    type: "text",
    required: true,
    disabledWhen: (isNewUser) => !isNewUser,
  },
  {
    id: "user_name",
    label: "User Name",
    type: "text",
    required: true,
  },
  {
    id: "user_email",
    label: "Email",
    type: "email",
    required: true,
  },
  {
    id: "user_pwd",
    label: "Password",
    type: "password",
    required: true,
    disabledWhen: (isNewUser) => isNewUser,
    readOnlyWhen: (isNewUser) => isNewUser,
    placeholderWhen: (isNewUser) =>
      !isNewUser ? "Leave empty to keep current password" : "",
    note: (isNewUser) =>
      isNewUser &&
      "Password will be auto-generated and sent to the user's email",
  },
  {
    id: "user_company",
    label: "Company",
    type: "text",
    required: true,
  },
  {
    id: "user_address",
    label: "Address",
    type: "text",
    required: true,
  },
  {
    id: "user_country",
    label: "Country",
    type: "text",
    required: true,
  },
  {
    id: "user_phone",
    label: "Phone",
    type: "text",
    required: true,
  },
];

// Checkbox permissions configuration
export const permissionCheckboxes = [
  { id: "admin_user", label: "Admin User" },
  { id: "dashboard", label: "Dashboard Access" },
  { id: "ocean_af", label: "Ocean AF Access" },
  { id: "ocean_ar", label: "Ocean AR Access" },
  { id: "ocean_ft", label: "Ocean FT Access" },
  { id: "ocean_schedule", label: "Ocean Schedule Access" },
  { id: "air_cargo", label: "Air Cargo Access" },
  { id: "air_schedule", label: "Air Schedule Access" },
  { id: "vessel_tracking", label: "Vessel Tracking Access" },
  { id: "marine_traffic", label: "Marine Traffic Access" },
  { id: "user_active", label: "User Active" },
];

// Function to generate default form data with admin permissions if needed
export const getDefaultFormData = (
  isNewUser = false,
  admin = false,
  generatePasswordFn = generateRandomPassword
) => {
  return {
    user_id: "",
    user_name: "",
    user_email: "",
    user_pwd: isNewUser ? generatePasswordFn() : "",
    user_company: "",
    user_address: "",
    user_country: "",
    user_phone: "",
    ...(admin
      ? {
          dashboard: "Y",
          ocean_af: "Y",
          ocean_ar: "Y",
          ocean_ft: "Y",
          ocean_schedule: "Y",
          air_cargo: "Y",
          air_schedule: "Y",
          vessel_tracking: "Y",
          marine_traffic: "Y",
          user_active: "Y",
          valid_till: new Date(new Date().setDate(new Date().getDate() + 1))
            .toISOString()
            .split("T")[0],
          admin_user: "N",
        }
      : {}),
  };
};
