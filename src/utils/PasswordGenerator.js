export const generatePassword = (length, includeCharacters) => {
  const numbers = "0123456789";
  const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const specialChars = "!@#$%^&*()_+[]{}|;:,.<>?";

  let characters = "";
  for (let key in includeCharacters) {
    if (includeCharacters[key]) {
      switch (key) {
        case "Numbers":
          characters += numbers;
          break;
        case "Alphabets":
          characters += alphabets;
          break;
        case "Special Characters":
          characters += specialChars;
          break;
        default:
          break;
      }
    }
  }

  if (characters.length === 0) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
};
