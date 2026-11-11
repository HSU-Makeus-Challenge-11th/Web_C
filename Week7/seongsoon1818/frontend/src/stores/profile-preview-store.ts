import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Profile {
  email: string;
  nickname: string;
}

interface ProfilePreviewStore {
  profile: Profile;
  saveProfile: (profile: Profile) => void;
}

export const useProfilePreview = create<ProfilePreviewStore>()(
  persist(
    (set) => ({
      profile: { email: "movie@example.com", nickname: "영화팬" },
      saveProfile: (profile) => set({ profile }),
    }),
    {
      name: "umcine-profile-preview",
      storage: createJSONStorage(() => sessionStorage),
      partialize: ({ profile }) => ({ profile }),
    },
  ),
);
