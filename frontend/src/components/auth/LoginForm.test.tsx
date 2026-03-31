import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/helpers";
import LoginForm from "./LoginForm";

vi.mock("../../api/auth", () => ({
  loginUser: vi.fn(),
}));

import { loginUser } from "../../api/auth";

const mockedLoginUser = vi.mocked(loginUser);

describe("LoginForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders login form with email and password fields", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
  });

  it("renders link to register page", () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByText(/cadastrar/i)).toBeInTheDocument();
  });

  it("calls loginUser on submit with form values", async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn();

    mockedLoginUser.mockResolvedValue({
      user: { id: "1", email: "john@test.com", name: "John", created_at: "", updated_at: "" },
      tokens: { access_token: "at", refresh_token: "rt" },
    });

    renderWithProviders(<LoginForm />, { auth: { login: loginMock } });

    await user.type(screen.getByLabelText(/email/i), "john@test.com");
    await user.type(screen.getByLabelText(/senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(mockedLoginUser).toHaveBeenCalledWith({
      email: "john@test.com",
      password: "password123",
    });
  });

  it("shows error on invalid credentials", async () => {
    const user = userEvent.setup();

    mockedLoginUser.mockRejectedValue({
      response: { data: { error_code: "INVALID_CREDENTIALS" } },
    });

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "john@test.com");
    await user.type(screen.getByLabelText(/senha/i), "wrong");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/email ou senha incorretos/i)).toBeInTheDocument();
  });

  it("disables button while submitting", async () => {
    const user = userEvent.setup();

    let resolveLogin: (value: unknown) => void;
    mockedLoginUser.mockReturnValue(
      new Promise((resolve) => {
        resolveLogin = resolve;
      })
    );

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/email/i), "john@test.com");
    await user.type(screen.getByLabelText(/senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(screen.getByRole("button")).toBeDisabled();

    resolveLogin!({
      user: { id: "1", email: "john@test.com", name: "John", created_at: "", updated_at: "" },
      tokens: { access_token: "at", refresh_token: "rt" },
    });
  });
});
