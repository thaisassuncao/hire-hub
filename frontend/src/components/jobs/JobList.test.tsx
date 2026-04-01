import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/helpers";
import JobList from "./JobList";
import type { Job } from "../../types/job";

const jobs: Job[] = [
  {
    id: "1",
    title: "Go Developer",
    description: "Build APIs",
    company: "ACME",
    location: "Remote",
    is_active: true,
    posted_by: "user-1",
    created_at: "2026-03-15T10:00:00Z",
    updated_at: "2026-03-15T10:00:00Z",
  },
  {
    id: "2",
    title: "React Developer",
    description: "Build UIs",
    company: "Corp",
    location: "SP",
    is_active: true,
    posted_by: "user-2",
    created_at: "2026-03-16T10:00:00Z",
    updated_at: "2026-03-16T10:00:00Z",
  },
];

describe("JobList", () => {
  it("renders loading state", () => {
    renderWithProviders(<JobList jobs={[]} isLoading={true} error="" />);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    renderWithProviders(<JobList jobs={[]} isLoading={false} error="Something went wrong" />);

    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderWithProviders(<JobList jobs={[]} isLoading={false} error="" />);

    expect(screen.getByText(/nenhuma vaga/i)).toBeInTheDocument();
  });

  it("renders list of jobs", () => {
    renderWithProviders(<JobList jobs={jobs} isLoading={false} error="" />);

    expect(screen.getByText("Go Developer")).toBeInTheDocument();
    expect(screen.getByText("React Developer")).toBeInTheDocument();
  });
});
