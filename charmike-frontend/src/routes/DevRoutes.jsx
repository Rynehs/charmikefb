import { Route } from "react-router-dom";

import ComponentPreview from "../pages/dev/ComponentPreview";
import ApiTest from "../pages/dev/ApiTest";
import Playground from "../pages/dev/Playground";

export default function DevRoutes() {
  return (
    <>
      <Route
        path="/dev/components"
        element={<ComponentPreview />}
      />

      <Route
        path="/dev/api"
        element={<ApiTest />}
      />

      <Route
        path="/dev/playground"
        element={<Playground />}
      />
    </>
  );
}