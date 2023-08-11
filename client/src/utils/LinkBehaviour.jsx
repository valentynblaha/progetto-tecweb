import React, { forwardRef } from "react";
import { Link } from "react-router-dom";

const LinkBehavior = forwardRef((props, ref) => <Link ref={ref} to="/" {...props} role={undefined} />);
LinkBehavior.displayName = "LinkBehavior";

export default LinkBehavior;