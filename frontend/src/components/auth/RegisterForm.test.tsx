import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/helpers";
import RegisterForm from "./RegisterForm";

vi.mock("../../api/auth", () => ({
  registerUser: vi.fn(),
}));

import { registerUser } from "../../api/auth";

const mockedRegisterUser = vi.mocked(registerUser);

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders register form with name, email and password fields", () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByLabelText(/nome/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /cadastrar/i })).toBeInTheDocument();
  });

  it("renders link to login page", () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByText(/entrar/i)).toBeInTheDocument();
  });

  it("calls registerUser on submit with form values", async () => {
    const user = userEvent.setup();
    const loginMock = vi.fn();

    mockedRegisterUser.mockResolvedValue({
      user: { id: "1", email: "john@test.com", name: "John", created_at: "", updated_at: "" },
      tokens: { access_token: "at", refresh_token: "rt" },
    });

    renderWithProviders(<RegisterForm />, { auth: { login: loginMock } });

    await user.type(screen.getByLabelText(/nome/i), "John");
    await user.type(screen.getByLabelText(/email/i), "john@test.com");
    await user.type(screen.getByLabelText(/senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(mockedRegisterUser).toHaveBeenCalledWith({
      name: "John",
      email: "john@test.com",
      password: "password123",
    });
  });

  it("shows error on duplicate email", async () => {
    const user = userEvent.setup();

    mockedRegisterUser.mockRejectedValue({
      response: { data: { error_code: "DUPLICATE_EMAIL" } },
    });

    renderWithProviders(<RegisterForm />);

    await user.type(screen.getByLabelText(/nome/i), "John");
    await user.type(screen.getByLabelText(/email/i), "john@test.com");
    await user.type(screen.getByLabelText(/senha/i), "password123");
    await user.click(screen.getByRole("button", { name: /cadastrar/i }));

    expect(await screen.findByText(/email ja cadastrado/i)).toBeInTheDocument();
  });
});
