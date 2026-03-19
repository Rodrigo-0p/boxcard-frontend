import * as React from 'react';
import ConfirmacionCardsView from './ConfirmacionCardsView';

const ConfirmacionCards = ({
    solicitudes,
    loading,
    onConfirm,
    onReject
}) => {
    return (
        <ConfirmacionCardsView
            solicitudes={solicitudes}
            loading={loading}
            onConfirm={onConfirm}
            onReject={onReject}
        />
    );
};

export default ConfirmacionCards;
