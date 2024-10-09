import React, { useState, useCallback, useEffect } from "react";
import HomePage from "../Pages/HomePage";
import "./Modal.css";

const Modal = () => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = useCallback(() => {
    setIsOpen(true);
    document.body.classList.add("no-scroll");
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    document.body.classList.remove("no-scroll");
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        closeModal();
      }
    },
    [closeModal]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <>
      <button className="open-btn" onClick={openModal}>
        Media
      </button>

      {isOpen && (
        <div id="modelConfirm" className="modal-wrapper">
          <div className="modal-content">
            <div className="modal-close">
              <button onClick={closeModal} type="button" className="close-btn" aria-label="Close modal">
              </button>
            </div>

            <div className="modal-body">
              <HomePage />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;