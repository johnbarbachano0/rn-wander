import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
// import { API_KEY, API_LOGIN_BASEURL } from "@env";

const API_KEY = "AIzaSyCbtIvuTaOGEl-ECNNAEN18apPcF1-tkik";
const API_LOGIN_BASEURL = "https://identitytoolkit.googleapis.com/v1/accounts";
const API_DB_BASEURL =
  "https://rn-hoppers-default-rtdb.asia-southeast1.firebasedatabase.app";

const headers = {
  "Content-Type": "application/json",
};

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: API_LOGIN_BASEURL,
  }),
  tagTypes: ["AUTH"],
  endpoints: (builder) => ({
    authRegister: builder.mutation({
      query: (data) => ({
        url: `:signUp?key=${API_KEY}`,
        method: "post",
        headers,
        body: data,
      }),
      invalidatesTags: () => [{ type: "AUTH" }],
    }),
    authLogin: builder.mutation({
      query: (data) => ({
        url: `:signInWithPassword?key=${API_KEY}`,
        method: "post",
        headers,
        body: data,
      }),
      invalidatesTags: () => [{ type: "AUTH" }],
    }),
  }),
});

export const { useAuthRegisterMutation, useAuthLoginMutation } = authApi;
