import axios from "axios";
import { AuthErrorCodes } from "firebase/auth";
import { Product } from "./type";

export const mapAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case AuthErrorCodes.EMAIL_EXISTS:
      return "The email address is already in use by another account.";
    case AuthErrorCodes.WEAK_PASSWORD:
      return "The password is too weak. Please choose a stronger password.";
    case AuthErrorCodes.INVALID_EMAIL:
      return "Don't match Email!";
    case AuthErrorCodes.INVALID_IDP_RESPONSE:
      return "Invalid credentials!";
    default:
      return "An unexpected error occurred. Please try again.";
  }
};

export const isFormValidate = (email: string, password: string): boolean => {
  if (email === "") {
    alert("Enter proper email");
    return false;
  } else if (password === "") {
    alert("Enter password");
    return false;
  } else {
    return true;
  }
};

export async function fetchProducts(api: string): Promise<Product[]> {
  const result = await axios.get("https://fakestoreapi.com/products");
  return result.data;
}
