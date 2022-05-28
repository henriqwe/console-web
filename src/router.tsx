import { Data } from "pages/Data";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { App } from "pages/App";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/data" element={<Data />} />
      </Routes>
    </BrowserRouter>
  );
}

// NProgress.start();
// NProgress.done();
