import React, { createContext, useContext, useState } from "react";
import { TokenExpiredModal } from "../components/TokenExpiredModal";

interface ModalContextProps {
  showModal: (options: ShowModalOptions) => void;
  hideModal: () => void;
}

interface ShowModalOptions {
  title: string;
  description: string;
  onClose: () => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [modalState, setModalState] = useState<ShowModalOptions & { visible: boolean }>({
    visible: false,
    title: "",
    description: "",
    onClose: () => {},
  });

  const onClose = () => {
    hideModal();
    modalState.onClose();
  };

  const showModal = (options: ShowModalOptions) => {
    setModalState({ ...options, visible: true });
  };

  const hideModal = () => {
    setModalState((prev) => ({ ...prev, visible: false }));
  };

  return (
    <ModalContext.Provider value={{ showModal, hideModal }}>
      {children}
      <TokenExpiredModal visible={modalState.visible} onClose={onClose} />
    </ModalContext.Provider>
  );
};

export const useModal = (): ModalContextProps => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
