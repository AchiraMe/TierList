import React from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";

const withRouter = (Component) => {
  const ComponentWithRouterProps = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const params = useParams();

    return (
      <Component
        {...props}
        router={{ navigate, location, params }}
      />
    );
  };

  return ComponentWithRouterProps;
};

export default withRouter;
