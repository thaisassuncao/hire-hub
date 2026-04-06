import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/helpers";
import Header from "./Header";

describe("Header", () => {
  it("shows login and register links when not authenticated", () => {
    renderWithProviders(<Header />);

    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
    expect(screen.getByText(/cadastrar/i)).toBeInTheDocument();
  });

  it("shows display name derived from email and logout when authenticated", () => {
    renderWithProviders(<Header />, {
      auth: {
        isAuthenticated: true,
        user: { id: "1", email: "john.doe@test.com", name: "john doe", created_at: "", updated_at: "" },
      },
    });

    expect(screen.getByText(/John Doe/)).toBeInTheDocument();
    expect(screen.getByText(/sair/i)).toBeInTheDocument();
  });

  it("shows dashboard link when authenticated", () => {
    renderWithProviders(<Header />, {
      auth: {
        isAuthenticated: true,
        user: { id: "1", email: "john@test.com", name: "john", created_at: "", updated_at: "" },
      },
    });

    expect(screen.getByText(/painel/i)).toBeInTheDocument();
  });

  it("does not show dashboard link when not authenticated", () => {
    renderWithProviders(<Header />);

    expect(screen.queryByText(/painel/i)).not.toBeInTheDocument();
  });

  it("calls logout when logout button is clicked", async () => {
    const user = userEvent.setup();
    const logoutMock = vi.fn();

    renderWithProviders(<Header />, {
      auth: {
        isAuthenticated: true,
        user: { id: "1", email: "john@test.com", name: "john", created_at: "", updated_at: "" },
        logout: logoutMock,
      },
    });

    await user.click(screen.getByText(/sair/i));
    expect(logoutMock).toHaveBeenCalled();
  });

  it("toggles language on button click", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Header />);

    const langButton = screen.getByText(/switch to english/i);
    await user.click(langButton);

    expect(screen.getByText(/mudar para o portugu/i)).toBeInTheDocument();
  });
});
