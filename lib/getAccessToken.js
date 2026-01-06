
export async function getAccessToken() {
  const res = await fetch("/api/login/refresh", {
    method: "POST",
    credentials: "include", // send refresh cookie
  });

  const data = await res.json();
  const accessToken = data.accessToken;
  return accessToken;
}
