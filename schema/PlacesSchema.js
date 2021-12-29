import * as yup from "yup";

export const placesSchema = yup.object().shape({
  title: yup
    .string()
    .required("Required.")
    .min(1, "At least 1 character.")
    .max(50, "Maximum of 50 characters"),
  description: yup
    .string()
    .required("Required.")
    .min(1, "At least 1 character.")
    .max(250, "Maximum of 250 characters"),
  visitAt: yup.date().required("Required."),
  image: yup.string().required("Image is required."),
  location: yup.object().required("Location is required."),
});
