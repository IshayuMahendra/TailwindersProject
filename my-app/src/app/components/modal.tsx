"use client";

import React, { PropsWithChildren, ReactNode, useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faX } from '@fortawesome/free-solid-svg-icons'

interface ModalProps {
    children?: ReactNode;
    bgColor?: string;
    fgColor?: string;
    onDismiss: Function;
    transitionSeconds: number;
};

const Modal: React.FC<ModalProps> = ({ children, onDismiss, transitionSeconds, bgColor, fgColor }: ModalProps) => {
    const [modalOpacity, setmodalOpacity] = useState(0);
    useEffect(() => {
        setmodalOpacity(1);
    }, []);

    const beginDismiss = () => {
        setmodalOpacity(0);
        setTimeout(() => onDismiss(), transitionSeconds*1000);
    }

    return (
        <>
            <div className="pol-modal-wrapper">
            <div className="pol-modal-overlay" onClick={() => beginDismiss()} style={{transitionDuration: transitionSeconds+"s", opacity: modalOpacity}}></div>
            <div className="pol-modal" style={{transitionDuration: transitionSeconds+"s", opacity: modalOpacity, backgroundColor: bgColor ? bgColor: '#AAC789'}}>
                <div className="pol-modal-header">
                    <button className="pol-button ml-auto pol-btn-x pol-text-dark" style={{color: fgColor ? fgColor: "#1E4147"}} onClick={() => beginDismiss()}><FontAwesomeIcon icon={faX}/></button>
                </div>
                <div className="pol-modal-content">
                    {children}
                </div>
            </div>
        </div>
        </>
    );
};

export default Modal;