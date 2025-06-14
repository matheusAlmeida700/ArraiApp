import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userDataService, userService } from "@/services/api";
import { useAuth } from "@/contexts/AuthContext";

export function useUserData() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["user", user?.id],
    queryFn: () => userService.getById(user.id),
    enabled: !!user?.id,
    staleTime: 5 * 60 * 1000,
  });
}

export const useUser = (id?: string) => {
  const isFetchingSingle = !!id;

  const query = useQuery({
    queryKey: isFetchingSingle ? ["user", id] : ["users"],
    queryFn: isFetchingSingle
      ? () => userService.getById(id!)
      : userService.getAll,
    enabled: isFetchingSingle ? !!id : true,
  });

  return query;
};

export const useUpdateUserXpAndCoins = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, xpToAdd }: { userId: string; xpToAdd: number }) => {
      return userDataService.updateXp(userId, xpToAdd);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });
};

export const useUpdateUserStats = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      xpToAdd,
      coinsToAdd,
    }: {
      userId: string;
      xpToAdd: number;
      coinsToAdd: number;
    }) => {
      await userDataService.updateXp(userId, xpToAdd);
      await userDataService.updateCoins(userId, coinsToAdd);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });
};
