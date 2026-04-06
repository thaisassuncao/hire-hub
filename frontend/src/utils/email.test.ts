import { displayNameFromEmail } from "./email";

describe("displayNameFromEmail", () => {
  it("extracts and capitalizes local part", () => {
    expect(displayNameFromEmail("john@test.com")).toBe("John");
  });

  it("replaces dots with spaces and capitalizes", () => {
    expect(displayNameFromEmail("email.estudante@email.com")).toBe("Email Estudante");
  });

  it("replaces underscores with spaces and capitalizes", () => {
    expect(displayNameFromEmail("email_estudante@email.com")).toBe("Email Estudante");
  });

  it("replaces mixed dots and underscores and capitalizes", () => {
    expect(displayNameFromEmail("email.estudante_dois@email.com")).toBe("Email Estudante Dois");
  });

  it("capitalizes single word", () => {
    expect(displayNameFromEmail("testdev@email.com")).toBe("Testdev");
  });

  it("trims whitespace and capitalizes", () => {
    expect(displayNameFromEmail(".test.@email.com")).toBe("Test");
  });
});
