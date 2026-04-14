import { AppDispatch, RootState } from "@/redux/store";
import { useDispatch, useSelector } from "react-redux";

// Typed hooks for broader use across the app
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

export default function useAuthState() {
  const user = useSelector((state: RootState) => state.auth);
  if (user) {
    return user;
  }
  return null;
}
