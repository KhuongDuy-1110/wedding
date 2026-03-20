import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishesApi } from "../api/wishes-api";
import { toast } from "react-hot-toast";

export const useWishes = () => {
  return useQuery({
    queryKey: ["wishes"],
    queryFn: wishesApi.getWishes,
  });
};

export const useCreateWish = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      const guestName = sessionStorage.getItem("guest_name") || "Không xác định";
      return wishesApi.createWish({ ...data, guest_path_name: guestName });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      toast.success("Gửi lời chúc thành công! ❤️");
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi gửi lời chúc. Vui lòng thử lại!");
      console.error(error);
    },
  });
};
