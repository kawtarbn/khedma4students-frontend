// Clear all localStorage data for fresh login
export const clearStudentStorage = () => {
  console.log("=== CLEARING STUDENT STORAGE ===");
  
  // Remove all student-related items
  const itemsToRemove = [
    'studentId',
    'full_name', 
    'role',
    'employerId',
    'employer_name',
    'company',
    'token'
  ];
  
  itemsToRemove.forEach(item => {
    localStorage.removeItem(item);
    console.log(`Removed ${item} from localStorage`);
  });
  
  console.log("✅ Student storage cleared");
  console.log("Items remaining:", Object.keys(localStorage));
};

export const getStudentInfo = () => {
  const studentId = localStorage.getItem("studentId");
  const fullName = localStorage.getItem("full_name");
  const role = localStorage.getItem("role");
  
  console.log("=== CURRENT STUDENT INFO ===");
  console.log("Student ID:", studentId);
  console.log("Full Name:", fullName);
  console.log("Role:", role);
  
  return {
    studentId,
    fullName,
    role
  };
};
