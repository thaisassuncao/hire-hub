import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../test/helpers";
import JobSearch from "./JobSearch";

describe("JobSearch", () => {
  it("renders search input and button", () => {
    renderWithProviders(<JobSearch onSearch={vi.fn()} />);

    expect(screen.getByPlaceholderText(/buscar vagas/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /buscar/i })).toBeInTheDocument();
  });

  it("calls onSearch with query on submit", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    renderWithProviders(<JobSearch onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/buscar vagas/i), "golang");
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledWith("golang");
  });

  it("trims whitespace from query", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    renderWithProviders(<JobSearch onSearch={onSearch} />);

    await user.type(screen.getByPlaceholderText(/buscar vagas/i), "  react  ");
    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledWith("react");
  });

  it("calls onSearch with empty string when input is empty", async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();

    renderWithProviders(<JobSearch onSearch={onSearch} />);

    await user.click(screen.getByRole("button", { name: /buscar/i }));

    expect(onSearch).toHaveBeenCalledWith("");
  });
});
