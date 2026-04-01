import { screen } from "@testing-library/react";
import { renderWithProviders } from "../../test/helpers";
import JobCard from "./JobCard";
import type { Job } from "../../types/job";

const baseJob: Job = {
  id: "1",
  title: "Go Developer",
  description: "Build APIs",
  company: "ACME",
  location: "Remote",
  is_active: true,
  posted_by: "user-1",
  created_at: "2026-03-15T10:00:00Z",
  updated_at: "2026-03-15T10:00:00Z",
};

describe("JobCard", () => {
  it("renders job title, company and location", () => {
    renderWithProviders(<JobCard job={baseJob} />);

    expect(screen.getByText("Go Developer")).toBeInTheDocument();
    expect(screen.getByText(/ACME — Remote/)).toBeInTheDocument();
  });

  it("renders salary range when both min and max are set", () => {
    const job = { ...baseJob, salary_min: 5000, salary_max: 10000 };
    renderWithProviders(<JobCard job={job} />);

    expect(screen.getByText(/5,000/)).toBeInTheDocument();
    expect(screen.getByText(/10,000/)).toBeInTheDocument();
  });

  it("does not render salary when not set", () => {
    renderWithProviders(<JobCard job={baseJob} />);

    expect(screen.queryByText(/salario/i)).not.toBeInTheDocument();
  });

  it("links to job detail page", () => {
    renderWithProviders(<JobCard job={baseJob} />);

    const link = screen.getByRole("link", { name: "Go Developer" });
    expect(link).toHaveAttribute("href", "/jobs/1");
  });

  it("renders formatted date", () => {
    renderWithProviders(<JobCard job={baseJob} />);

    expect(screen.getByText("15/03/2026")).toBeInTheDocument();
  });
});
