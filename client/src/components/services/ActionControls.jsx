import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import AuthorActions from "./AuthorActions";
import { ServiceStatuses } from "../../utils/constants";
import RequestService from "./RequestService";

const ActionControls = (params) => {
  const { currentAccount } = useContext(AuthContext);
  const { service } = params;
  if (service.author === currentAccount) {
    return <AuthorActions />;
  }
  if (service.status === ServiceStatuses[0]) {
    return <RequestService />;
  }
  return null;
};

export default ActionControls;
