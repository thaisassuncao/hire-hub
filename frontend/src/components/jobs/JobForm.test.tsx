import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/helpers";
import JobForm from "./JobForm";

vi.mock("../../api/jobs", () => ({
  createJob: vi.fn(),
  updateJob: vi.fn(),
}));

import { createJob } from "../../api/jobs";

const mockedCreateJob = vi.mocked(createJob);

async function fillForm(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByLabelText(/tulo da vaga/i), "Go Dev");
  await user.type(screen.getByLabelText(/descri/i), "Build APIs with Go");
  await user.type(screen.getByLabelText(/empresa/i), "ACME");
  await user.type(screen.getByLabelText(/local/i), "Remote");
  await user.type(screen.getByLabelText(/min/i), "5000");
  await user.type(screen.getByLabelText(/max/i), "10000");
}

describe("JobForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    renderWithProviders(<JobForm />);

    expect(screen.getByLabelText(/tulo da vaga/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descri/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/local/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/min/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/max/i)).toBeInTheDocument();
  });

  it("calls createJob on submit with form values", async () => {
    const user = userEvent.setup();

    mockedCreateJob.mockResolvedValue({
      id: "1",
      title: "Go Dev",
      description: "Build APIs with Go",
      company: "ACME",
      location: "Remote",
      salary_min: 5000,
      salary_max: 10000,
      is_active: true,
      posted_by: "user-1",
      created_at: "",
      updated_at: "",
    });

    renderWithProviders(<JobForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(mockedCreateJob).toHaveBeenCalledWith({
      title: "Go Dev",
      description: "Build APIs with Go",
      company: "ACME",
      location: "Remote",
      salary_min: 5000,
      salary_max: 10000,
    });
  });

  it("shows error on failure", async () => {
    const user = userEvent.setup();

    mockedCreateJob.mockRejectedValue(new Error("fail"));

    renderWithProviders(<JobForm />);

    await fillForm(user);
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText(/ocorreu um erro/i)).toBeInTheDocument();
  });

  it("shows validation error when fields are empty", async () => {
    const user = userEvent.setup();

    renderWithProviders(<JobForm />);

    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(screen.getByText(/obrigat/i)).toBeInTheDocument();
    expect(mockedCreateJob).not.toHaveBeenCalled();
  });

  it("shows error when salary max <= min", async () => {
    const user = userEvent.setup();

    renderWithProviders(<JobForm />);

    await user.type(screen.getByLabelText(/tulo da vaga/i), "Dev");
    await user.type(screen.getByLabelText(/descri/i), "Uma descricao longa o suficiente");
    await user.type(screen.getByLabelText(/empresa/i), "Co");
    await user.type(screen.getByLabelText(/local/i), "SP");
    await user.type(screen.getByLabelText(/min/i), "10000");
    await user.type(screen.getByLabelText(/max/i), "5000");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(screen.getByText(/maior que o m/i)).toBeInTheDocument();
    expect(mockedCreateJob).not.toHaveBeenCalled();
  });
});
