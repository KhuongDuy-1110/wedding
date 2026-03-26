import { useMutation, useQueryClient } from "@tanstack/react-query";
import { rsvpApi } from "../api/rsvp-api";
import { toast } from "react-hot-toast";

export const useSubmitRSVP = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => rsvpApi.submitRSVP(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rsvp"] });
      toast.success("Xác nhận thành công! Cảm ơn bạn rất nhiều! ❤️");
    },
    onError: (error) => {
      const serverMsg = error?.response?.data?.error;
      toast.error(serverMsg || "Có lỗi xảy ra. Vui lòng thử lại sau!");
    },
  });
};
