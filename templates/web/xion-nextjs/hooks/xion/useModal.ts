import { AbstraxionContext } from "@/components/AbstraxionContext";
import { useContext } from "react";


export const useModal = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>,
] => {
  const { showModal, setShowModal } = useContext(AbstraxionContext);

  return [showModal, setShowModal];
};