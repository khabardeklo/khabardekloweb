export const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000/api";
export const backendOrigin = backendUrl.replace(/\/api$/, "");
