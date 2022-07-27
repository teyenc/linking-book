import { combineReducers } from "redux";

import auth from "./auth";
import post from "./post";
import notifications from "./notifications";
import collections from "./collections";
import tags from "./tags";
import postCard from "./postCard";
import folAct from "./folAct";
import Modal from "./Modal";

export default combineReducers({
  tags,
  auth,
  post,
  notifications,
  collections,
  postCard,
  folAct,
  Modal
});
 