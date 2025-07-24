import { signOut } from "@/lib/auth-client";
import { toast } from "sonner";

export async function handleLogout() {
  let toastId: string | number | undefined;

  try {
    // Show loading state
    toastId = toast.loading("Signing out...");

    // Sign out from better-auth with timeout
    const logoutPromise = signOut();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Logout timeout")), 5000)
    );

    await Promise.race([logoutPromise, timeoutPromise]);

    // Clear any cached data
    if (typeof window !== "undefined") {
      try {
        // Clear localStorage and sessionStorage
        localStorage.clear();
        sessionStorage.clear();

        // Clear any service worker caches if present
        if ("caches" in window) {
          caches
            .keys()
            .then((names) => {
              names.forEach((name) => {
                caches.delete(name);
              });
            })
            .catch((err) => console.warn("Failed to clear caches:", err));
        }
      } catch (storageError) {
        console.warn("Failed to clear storage:", storageError);
      }
    }

    if (toastId) toast.dismiss(toastId);
    toast.success("Logged out successfully");

    // Redirect to home page
    redirectToHome();
  } catch (error) {
    console.error("Logout failed:", error);

    if (toastId) toast.dismiss(toastId);
    toast.error("Logout failed, redirecting anyway");

    // Clear storage even if logout failed
    if (typeof window !== "undefined") {
      try {
        localStorage.clear();
        sessionStorage.clear();
      } catch (storageError) {
        console.warn(
          "Failed to clear storage after logout failure:",
          storageError
        );
      }
    }

    // Force redirect even if logout fails
    redirectToHome();
  }
}

function redirectToHome() {
  // Use a small delay to ensure the logout is processed
  setTimeout(() => {
    if (typeof window !== "undefined") {
      // Force a hard redirect to ensure clean state
      window.location.href = "/";
    }
  }, 300);
}
