import * as React from 'react';
import ConfirmacionCardsView from './ConfirmacionCardsView';

const ConfirmacionCards = ({
    solicitudes,
    loading,
    onConfirm
}) => {
    return (
        <ConfirmacionCardsView
            solicitudes={solicitudes}
            loading={loading}
            onConfirm={onConfirm}
        />
    );
};

export default ConfirmacionCards;
