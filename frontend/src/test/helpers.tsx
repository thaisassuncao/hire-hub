import type { ReactNode } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { I18nextProvider } from "react-i18next";
import i18n from "../i18n";
import { AuthContext, type AuthContextType } from "../contexts/AuthContext";

const defaultAuth: AuthContextType = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  login: vi.fn(),
  logout: vi.fn(),
};

interface RenderOptions {
  route?: string;
  auth?: Partial<AuthContextType>;
}

export function renderWithProviders(ui: ReactNode, options: RenderOptions = {}) {
  const { route = "/", auth = {} } = options;
  const authValue = { ...defaultAuth, ...auth };

  return render(
    <I18nextProvider i18n={i18n}>
      <AuthContext.Provider value={authValue}>
        <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
      </AuthContext.Provider>
    </I18nextProvider>
  );
}
