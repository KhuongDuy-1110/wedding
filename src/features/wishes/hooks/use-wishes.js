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
      // Do not store actual name in guest_path_name, only the type/side
      return wishesApi.createWish({
        ...data,
        guest_path_name: data.guest_path_name || "other",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      toast.success("Gửi lời chúc thành công! ❤️");
    },
    onError: (error) => {
      const serverMsg = error?.response?.data?.error;
      toast.error(serverMsg || "Có lỗi xảy ra khi gửi lời chúc. Vui lòng thử lại!");
    },
  });
};

export const useUpdateWish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishesApi.updateWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      toast.success("Cập nhật lời chúc thành công!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Lỗi khi cập nhật");
    }
  });
};

export const useRecallWish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: wishesApi.recallWish,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishes"] });
      toast.success("Đã thu hồi lời chúc!");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.error || "Lỗi khi thu hồi");
    }
  });
};
