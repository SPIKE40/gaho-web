import { Suspense } from "react";
import MidmPage from "./midm";

const MidmMainPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MidmPage />
    </Suspense>
  );
};

export default MidmMainPage;
