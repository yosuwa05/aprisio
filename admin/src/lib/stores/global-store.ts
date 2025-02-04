// $lib/stores/global-store.ts
import { writable } from 'svelte/store';

type adminDetails = {
  profileImage: string | null;
  Name: string;
};

export type GlobalStore = {
  adminDetails: adminDetails;
};

export const writableGlobalStore = writable<GlobalStore>({
  adminDetails: {
    profileImage: null,
    Name: ''
  }
});

// Function to load admin data from localStorage into the store
export function loadAdminData() {
  const adminData = localStorage.getItem('admin');
  if (adminData) {
    const parsedAdminData = JSON.parse(adminData);
    writableGlobalStore.set({
      adminDetails: {
        profileImage: parsedAdminData.profileImage || null,
        Name: parsedAdminData.Name || ''
      }
    });
  }
}

// Function to update admin data both in the store and localStorage
export function updateAdminData(newData: adminDetails) {
  const updatedData = { ...newData };
  localStorage.setItem('admin', JSON.stringify(updatedData)); // Update localStorage
  writableGlobalStore.set({ adminDetails: updatedData }); // Update the store
}
