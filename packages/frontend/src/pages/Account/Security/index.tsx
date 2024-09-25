import React, { FC } from "react";

import Sessions from "./Session";
import MFA from "./MFA";
import { Divider } from "@mui/material";

const Security: FC = () => {
  return (
    <>
      <Sessions />
      <Divider sx={{ m: "30px 10px" }} />
      <MFA />
    </>
  );
};

export default Security;
