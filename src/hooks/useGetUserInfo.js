export const useGetUserInfo = () => {
  const { name, profilePhoto, userID, isAuth } =
    JSON.parse(localStorage.getItem("auth")) || {}; // Get the user info from localStorage

  return { name, profilePhoto, userID, isAuth };
};
