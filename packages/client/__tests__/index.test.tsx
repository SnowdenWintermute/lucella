import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ButtonBasic from "../components/common-components/buttons/ButtonBasic";

describe("Battle Room", () => {
  it("renders the button text", () => {
    render(<ButtonBasic title="test" onClick={jest.fn()} />);

    const button = screen.getByRole("button", {
      name: /test/i,
    });

    expect(button).toBeInTheDocument();
  });
});
