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
    mutationFn: (data) => wishesApi.createWish(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi gửi lời chúc. Vui lòng thử lại!");
      console.error(error);
    },
  });
};
