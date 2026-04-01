import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/helpers";
import JobForm from "./JobForm";

vi.mock("../../api/jobs", () => ({
  createJob: vi.fn(),
}));

import { createJob } from "../../api/jobs";

const mockedCreateJob = vi.mocked(createJob);

describe("JobForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all form fields", () => {
    renderWithProviders(<JobForm />);

    expect(screen.getByLabelText(/vagas/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/descricao/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/empresa/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/local/i)).toBeInTheDocument();
  });

  it("calls createJob on submit with form values", async () => {
    const user = userEvent.setup();

    mockedCreateJob.mockResolvedValue({
      id: "1",
      title: "Go Dev",
      description: "Build APIs with Go",
      company: "ACME",
      location: "Remote",
      is_active: true,
      posted_by: "user-1",
      created_at: "",
      updated_at: "",
    });

    renderWithProviders(<JobForm />);

    await user.type(screen.getByLabelText(/vagas/i), "Go Dev");
    await user.type(screen.getByLabelText(/descricao/i), "Build APIs with Go");
    await user.type(screen.getByLabelText(/empresa/i), "ACME");
    await user.type(screen.getByLabelText(/local/i), "Remote");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(mockedCreateJob).toHaveBeenCalledWith({
      title: "Go Dev",
      description: "Build APIs with Go",
      company: "ACME",
      location: "Remote",
      salary_min: undefined,
      salary_max: undefined,
    });
  });

  it("shows error on failure", async () => {
    const user = userEvent.setup();

    mockedCreateJob.mockRejectedValue(new Error("fail"));

    renderWithProviders(<JobForm />);

    await user.type(screen.getByLabelText(/vagas/i), "Go Dev");
    await user.type(screen.getByLabelText(/descricao/i), "Build APIs with Go");
    await user.type(screen.getByLabelText(/empresa/i), "ACME");
    await user.type(screen.getByLabelText(/local/i), "Remote");
    await user.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText(/ocorreu um erro/i)).toBeInTheDocument();
  });
});
