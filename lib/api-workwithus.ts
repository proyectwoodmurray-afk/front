import { fetchApi } from "./api-config";

export async function submitJobApplication(formData: FormData) {
  return fetchApi("/workwithus", {
    method: "POST",
    body: formData,
  });
}