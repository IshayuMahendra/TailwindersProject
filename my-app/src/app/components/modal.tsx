"use client";

import React, { PropsWithChildren, ReactNode } from 'react';

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
                            <button className="pol-button ml-auto pol-btn-x" onClick={() => onDismiss()}>X</button>
                        </div>
                        {children}
                    </div>
                </div>
            }
        </>
    );
};

export default Modal;