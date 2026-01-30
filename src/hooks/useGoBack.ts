import { useNavigate } from "react-router-dom";
import { useCallback } from "react";

/**
 * Custom hook that provides a goBack function with fallback to home.
 * If there's no meaningful browser history, navigates to home instead.
 */
export function useGoBack(fallbackPath: string = "/") {
  const navigate = useNavigate();

  const goBack = useCallback(() => {
    // Check if we have meaningful history to go back to
    // Browsers typically start with history.length of 1-2
    if (window.history.length > 2) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  }, [navigate, fallbackPath]);

  return goBack;
}
