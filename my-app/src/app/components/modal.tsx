"use client";

import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

interface ModalProps {
    isShow: boolean;
    children?: ReactNode;
    onDismiss: Function;
    transitionSeconds: number;
};

const Modal: React.FC<ModalProps> = ({ isShow, children, onDismiss, transitionSeconds }: ModalProps) => {
    const [modalOpacity, setmodalOpacity] = useState(0);
    const [modalDisplay, setmodalDisplay] = useState(false);
    const [init, setInit] = useState(false);
    useEffect(() => {
            if(isShow == true) {
                setmodalDisplay(true);
                setTimeout(() => setmodalOpacity(1), 100);
            } else if(init) {
                setmodalOpacity(0);
                setTimeout(() => setmodalDisplay(false), transitionSeconds*1000);
            }
        setInit(true);
    }, [isShow]);

    return (
        <>
        {modalDisplay &&
            <div className="pol-modal-wrapper">
            <div className="pol-modal-overlay" onClick={() => onDismiss()} style={{transitionDuration: transitionSeconds+"s", opacity: modalOpacity}}></div>
            <div className="pol-modal" style={{transitionDuration: transitionSeconds+"s", opacity: modalOpacity}}>
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