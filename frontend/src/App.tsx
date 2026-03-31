import AuthProvider from "./contexts/AuthProvider";
import AppRouter from "./routes/AppRouter";

export default function App() {
  return (
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  );
}
