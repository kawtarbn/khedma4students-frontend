export const validateStudentForm = ({ full_name, email, password, university, city }) => {
  const messages = [];
  
  // Enhanced email validation
  const isEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && !email.includes('..') && email.length <= 254;
  };

  // Enhanced password validation
  const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noSpaces = !/\s/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && noSpaces,
      errors: [
        password.length < minLength ? `Password must be at least ${minLength} characters` : null,
        !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
        !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
        !hasNumbers ? 'Password must contain at least one number' : null,
        !hasSpecialChar ? 'Password must contain at least one special character' : null,
        !noSpaces ? 'Password cannot contain spaces' : null
      ].filter(error => error !== null)
    };
  };

  // Common password patterns to avoid
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123', 'admin', 'letmein'];
  const isCommonPassword = (password) => commonPasswords.includes(password.toLowerCase());

  if (!full_name) messages.push("Full name cannot be blank.");
  else if (full_name.length < 2) messages.push("Full name must be at least 2 characters.");
  else if (full_name.length > 100) messages.push("Full name cannot exceed 100 characters.");
  
  if (!email) messages.push("Email cannot be blank.");
  else if (!isEmail(email)) messages.push("Email format is invalid.");
  else if (email.length > 254) messages.push("Email cannot exceed 254 characters.");
  
  if (!password) messages.push("Password cannot be blank.");
  else {
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.isValid) {
      messages.push(...passwordValidation.errors);
    }
    if (isCommonPassword(password)) {
      messages.push("Please choose a more secure password. This password is too common.");
    }
    if (password.length > 128) messages.push("Password cannot exceed 128 characters.");
  }
  
  if (!university) messages.push("University cannot be blank.");
  else if (university.length < 2) messages.push("University name must be at least 2 characters.");
  
  if (!city) messages.push("City must be selected.");

  return messages;
};

export const validateStudentProfileForm = (form) => {
  const errors = [];
  const isEmail = (email) => /^([a-zA-Z0-9_.-]+)@([a-zA-Z0-9_.-]+)\.([a-zA-Z]{2,})$/.test(email);

  if (!form.full_name?.trim()) errors.push("Full name cannot be empty.");
  if (!form.email?.trim()) errors.push("Email cannot be empty.");
  else if (!isEmail(form.email)) errors.push("Email format is invalid.");
  if (!form.phone?.trim()) errors.push("Phone number cannot be empty.");
  if (!form.location?.trim()) errors.push("Location cannot be empty.");
  if (!form.university?.trim()) errors.push("University cannot be empty.");
  if (!form.major?.trim()) errors.push("Major cannot be empty.");
  if (!form.year_of_study?.trim()) errors.push("Year of study cannot be empty.");
  if (!form.bio?.trim()) errors.push("Bio cannot be empty.");

  return errors;
};
export function validateEmployerForm({ full_name, email, password, company, city }) {
  const errors = [];
  
  // Enhanced email validation
  const isEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email) && !email.includes('..') && email.length <= 254;
  };

  // Enhanced password validation
  const isStrongPassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const noSpaces = !/\s/.test(password);
    
    return {
      isValid: password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar && noSpaces,
      errors: [
        password.length < minLength ? `Password must be at least ${minLength} characters` : null,
        !hasUpperCase ? 'Password must contain at least one uppercase letter' : null,
        !hasLowerCase ? 'Password must contain at least one lowercase letter' : null,
        !hasNumbers ? 'Password must contain at least one number' : null,
        !hasSpecialChar ? 'Password must contain at least one special character' : null,
        !noSpaces ? 'Password cannot contain spaces' : null
      ].filter(error => error !== null)
    };
  };

  // Common password patterns to avoid
  const commonPasswords = ['password', '123456', 'qwerty', 'abc123', 'password123', 'admin', 'letmein'];
  const isCommonPassword = (password) => commonPasswords.includes(password.toLowerCase());

  if (!full_name?.trim() && full_name !== "dummy") errors.push("Full Name is required.");
  else if (full_name && full_name.length < 2 && full_name !== "dummy") errors.push("Full Name must be at least 2 characters.");
  else if (full_name && full_name.length > 100 && full_name !== "dummy") errors.push("Full Name cannot exceed 100 characters.");
  
  if (!email?.trim()) errors.push("Email is required.");
  else if (!isEmail(email)) errors.push("Email format is invalid.");
  else if (email.length > 254) errors.push("Email cannot exceed 254 characters.");
  
  if (!password?.trim()) errors.push("Password is required.");
  else {
    const passwordValidation = isStrongPassword(password);
    if (!passwordValidation.isValid) {
      errors.push(...passwordValidation.errors);
    }
    if (isCommonPassword(password)) {
      errors.push("Please choose a more secure password. This password is too common.");
    }
    if (password.length > 128) errors.push("Password cannot exceed 128 characters.");
  }
  
  if (!company?.trim() && company !== "dummy") errors.push("Company/Organization is required.");
  else if (company && company.length < 2 && company !== "dummy") errors.push("Company name must be at least 2 characters.");
  else if (company && company.length > 100 && company !== "dummy") errors.push("Company name cannot exceed 100 characters.");
  
  if (!city?.trim() && city !== "dummy") errors.push("City is required.");

  return errors;
}


export function validateEmployerProfileForm({ full_name, email, company, city }) {
  const errors = [];

  if (!full_name.trim()) errors.push("Full Name is required.");
  if (!email.trim()) errors.push("Email is required.");
  else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) errors.push("Email format is invalid.");
  if (!company.trim()) errors.push("Company is required.");
  if (!city.trim()) errors.push("City is required.");

  return errors;
};

