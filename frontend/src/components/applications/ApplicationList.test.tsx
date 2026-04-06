import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/helpers";
import ApplicationList from "./ApplicationList";
import type { Application } from "../../types/application";

const applications: Application[] = [
  {
    id: "1",
    job_id: "job-1",
    user_id: "user-1",
    status: "pending",
    job: {
      id: "job-1",
      title: "Go Developer",
      description: "Build APIs",
      company: "ACME",
      location: "Remote",
      is_active: true,
      posted_by: "user-2",
      created_at: "2026-03-15T10:00:00Z",
      updated_at: "2026-03-15T10:00:00Z",
    },
    created_at: "2026-03-16T10:00:00Z",
    updated_at: "2026-03-16T10:00:00Z",
  },
];

describe("ApplicationList", () => {
  it("renders loading state", () => {
    renderWithProviders(<ApplicationList applications={[]} isLoading={true} error="" />);

    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renders error state", () => {
    renderWithProviders(<ApplicationList applications={[]} isLoading={false} error="Oops" />);

    expect(screen.getByText("Oops")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    renderWithProviders(<ApplicationList applications={[]} isLoading={false} error="" />);

    expect(screen.getByText(/ainda n.o se candidatou/i)).toBeInTheDocument();
  });

  it("renders application with job info", () => {
    renderWithProviders(<ApplicationList applications={applications} isLoading={false} error="" />);

    expect(screen.getByText("Go Developer")).toBeInTheDocument();
    expect(screen.getByText(/ACME — Remote/)).toBeInTheDocument();
    expect(screen.getByText(/pendente/i)).toBeInTheDocument();
  });

  it("links to job detail", () => {
    renderWithProviders(<ApplicationList applications={applications} isLoading={false} error="" />);

    const link = screen.getByRole("link", { name: "Go Developer" });
    expect(link).toHaveAttribute("href", "/jobs/job-1");
  });
});
