import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { siteSettingsApi } from "../features/admin/api/settings-api";
import { toast } from "react-hot-toast";

export const useSiteSettings = () => {
  return useQuery({
    queryKey: ["site-settings"],
    queryFn: siteSettingsApi.getSettings,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const useUpdateSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: siteSettingsApi.updateSetting,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["site-settings"] });
      toast.success("Cập nhật thành công");
    },
    onError: () => {
      toast.error("Cập nhật thất bại");
    },
  });
};
