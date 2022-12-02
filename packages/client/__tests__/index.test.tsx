import { render, screen } from "@testing-library/react";
import BattleRoom from "../pages/battle-room";
import { Provider } from "react-redux";
import store from "../redux/hooks";
import { wrapper } from "../redux/hooks";

describe("Battle Room", () => {
  it("renders a heading", () => {
    render(
      <Provider store={store}>
        <BattleRoom />
      </Provider>
    );

    const heading = screen.getByRole("heading", {
      name: /battle room/i,
    });

    expect(heading).toBeInTheDocument();
  });
});

// it("passes", () => {
//     expect(true).toBe(true);
//   });
