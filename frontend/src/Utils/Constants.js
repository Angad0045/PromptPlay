export const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8080"
    : "https://promptplay-backend.vercel.app";

export const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3MTI4N2Q2MGU4MmZjODdkYmM3NmVkMGNjZjAyYjFjYSIsIm5iZiI6MTcxOTU2NzQ5OS45NTkyNzQsInN1YiI6IjY2N2U3NzFiZjRjNTJiMzc4YmM0Y2JlNCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.lUL0YhjLe2Dxnkj2Au8WLeXp_VBQxuYc44OasDmCQx8",
  },
};
