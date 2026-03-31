import { formatDate, formatDateTime } from "./date";

describe("formatDate", () => {
  it("formats date in pt-BR locale", () => {
    const result = formatDate("2026-03-15T10:30:00Z", "pt-BR");
    expect(result).toBe("15/03/2026");
  });

  it("formats date in en locale", () => {
    const result = formatDate("2026-03-15T10:30:00Z", "en");
    expect(result).toBe("03/15/2026");
  });

  it("defaults to pt-BR", () => {
    const result = formatDate("2026-03-15T10:30:00Z");
    expect(result).toBe("15/03/2026");
  });
});

describe("formatDateTime", () => {
  it("formats date and time in pt-BR locale", () => {
    const result = formatDateTime("2026-03-15T10:30:00Z", "pt-BR");
    expect(result).toMatch(/15\/03\/2026/);
    expect(result).toMatch(/\d{2}:\d{2}/);
  });

  it("formats date and time in en locale", () => {
    const result = formatDateTime("2026-03-15T10:30:00Z", "en");
    expect(result).toMatch(/03\/15\/2026/);
  });
});
