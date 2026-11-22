import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const tokenCache =
  Platform.OS !== "web"
    ? {
        async getToken(key: string) {
          try {
            return await SecureStore.getItemAsync(key);
          } catch (error) {
            console.warn("SecureStore getToken error:", error);
            try {
              await SecureStore.deleteItemAsync(key);
            } catch {
              // Ignore
            }
            return null;
          }
        },
        async saveToken(key: string, value: string) {
          try {
            await SecureStore.setItemAsync(key, value);
          } catch (error) {
            console.warn("SecureStore saveToken error:", error);
          }
        },
        async clearToken(key: string) {
          try {
            await SecureStore.deleteItemAsync(key);
          } catch (error) {
            console.warn("SecureStore clearToken error:", error);
          }
        },
      }
    : undefined;
