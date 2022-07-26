import { atom } from "recoil";

export const modalState = atom({
  key: "modalState",
  default: false,
});

export const editmodalState = atom({
  key: "editmodalState",
  default: false,
});

export const postIdState = atom({
  key: "postIdState",
  default: "",
});
