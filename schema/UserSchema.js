import * as yup from "yup";
// import { isUsernameAvailable } from "../api/api";

export const registerSchema = yup.object().shape({
  email: yup.string().required("Required.").email("Invalid email format."),

  // .test(
  //   "is-username-available",
  //   "Username already in use.",
  //   async (username) => {
  //     if (username) {
  //       const res = await isUsernameAvailable(username);
  //       return res;
  //     }
  //   }
  // ),
  password: yup
    .string()
    .required("Required.")
    .min(8, "Minimum of 8 characters.")
    .test(
      "isValidPass",
      "Needs one uppercase, one number and one symbol.",
      (value) => {
        const hasUpperCase = /[A-Z]/.test(value);
        const hasNumber = /[0-9]/.test(value);
        const hasSymbole = /[!@#%&]/.test(value);
        var validConditions = 0;
        const numberOfMustBeValidConditions = 3;
        const conditions = [hasUpperCase, hasNumber, hasSymbole];
        conditions.forEach((condition) => condition && validConditions++);
        if (validConditions >= numberOfMustBeValidConditions) {
          return true;
        }
        return false;
      }
    ),
  repassword: yup
    .string()
    .required("Required.")
    .oneOf([yup.ref("password"), null], "Passwords do not match."),
});

export const loginSchema = yup.object().shape({
  email: yup.string().required("Required.").email("Invalid email format."),
  // .test("is-username-exist", "Username does not exist.", async (username) => {
  //   if (username) {
  //     const res = await isUsernameAvailable(username);
  //     return !res;
  //   }
  // }),
  password: yup
    .string()
    .required("Required.")
    .min(8, "Minimum of 8 characters."),
});
