import { IComment } from "../../Utils/comments.data";

// Local storage's key
export const local_comment_info_key = "local_comment_info";

// Load Local Storage's Data
export const LoadLocalComment = () => {
  let user_comment_list: IComment[] = [];
  const local_account_info = localStorage.getItem(local_comment_info_key);
  if (local_account_info) {
    const account_info_json = JSON.parse(local_account_info);
    if (account_info_json) {
      user_comment_list = account_info_json;
    }
  }
  return user_comment_list;
};

// Save Local Storage's Data
export const SaveLocalComment = (user_comment_list: IComment[]) => {
  localStorage.setItem(
    local_comment_info_key,
    JSON.stringify(user_comment_list)
  );
};
