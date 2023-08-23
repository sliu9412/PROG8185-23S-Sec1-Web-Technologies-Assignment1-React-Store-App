// A comments page where purchasers with accounts may rate and comment on products they have purchased with their account.
// They may optionally upload photos as well as enter comment text.
// This page should also display comments from others to the current user before and after the purchase.

import { Nav, NavItem, NavLink, TabContent, TabPane } from "reactstrap";
import LayoutComp from "../Components/LayoutComp";
import { useContext, useState } from "react";
import CommentCards from "../Components/CommentCards";
import { Comments } from "../Utils/comments.data";
import { AlertContext, IAlertContext } from "../Components/AlertComp";
import { AccountContext, IAccountService } from "../Components/AccountComp";
import AddComment from "../Components/AddComments";

function CommentsPage() {
  const [active_tab_state, SetTabState] = useState(true);
  const { PushAlert } = useContext(AlertContext) as IAlertContext;
  const { HasLoginedAccount } = useContext(AccountContext) as IAccountService;
  const comments = [...Comments];

  const TabClickHandler = () => {
    // If not logged, push the Alert
    if (active_tab_state) {
      if (HasLoginedAccount()) {
        SetTabState(false);
      } else {
        PushAlert("Please login before submitting comment");
      }
    } else {
      SetTabState(true);
    }
  };

  return (
    <LayoutComp>
      <Nav tabs fill>
        <NavItem>
          <NavLink
            className={active_tab_state ? "active" : ""}
            onClick={TabClickHandler}
          >
            User Comments
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={active_tab_state ? "" : "active"}
            onClick={TabClickHandler}
          >
            Add My Comment
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={active_tab_state ? "1" : "2"}>
        <TabPane tabId="1">
          <div className="my-5">
            <CommentCards comments={comments} isMocked={true} />
          </div>
        </TabPane>
        <TabPane tabId="2">
          <AddComment />
        </TabPane>
      </TabContent>
    </LayoutComp>
  );
}

export default CommentsPage;
