"use client";

import React, { PropsWithChildren, ReactNode } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

interface ModalProps {
    isShow: boolean;
    children?: ReactNode;
    onDismiss: Function;
};

const Modal: React.FC<ModalProps> = ({ isShow, children, onDismiss }: ModalProps) => {

    return (
        <>
            {isShow &&
                <div className="pol-modal-wrapper">
                    <div className="pol-modal-overlay" onClick={() => onDismiss()}></div>
                    <div className="pol-modal">
                        <div className="pol-modal-header">
                            <button className="pol-button ml-auto pol-btn-x pol-text-dark" onClick={() => onDismiss()}><FontAwesomeIcon icon={faX}/></button>
                        </div>
                        <div className="pol-modal-content">
                            {children}
                        </div>
                    </div>
                </div>
            }
        </>
    );
};

export default Modal;