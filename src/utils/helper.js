// Helper function to check if a string is a valid email
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to check if a string is a valid phone number (basic)
export const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\d{10}$/; // Adjust this regex to match the phone number format you expect
  return phoneRegex.test(phone);
};
