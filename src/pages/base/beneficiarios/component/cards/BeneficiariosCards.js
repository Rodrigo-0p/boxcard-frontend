import * as React from 'react';
import BeneficiariosCardsView from './BeneficiariosCardsView';
import Main from '../../../../../util/main';
import MainIcon from '../../../../../util/mainIcon';

const BeneficiariosCards = ({
    beneficiarios,
    loading,
    onEdit,
    onView,
    onApprove,
    permisos,
    saveDelete
}) => {

    const handleDelete = (beneficiario) => {
        Main.Modal.confirm({
            title: '¿Eliminar beneficiario?',
            icon: <MainIcon.ExclamationCircleOutlined />,
            content: `¿Está seguro que desea eliminar a "${beneficiario.nombre_completo}"?`,
            okText: 'Eliminar',
            okType: 'danger',
            cancelText: 'Cancelar',
            onOk: async () => {
                saveDelete(beneficiario.cod_beneficiario);
            }
        });
    };

    return (
        <BeneficiariosCardsView
            beneficiarios={beneficiarios}
            loading={loading}
            onView={onView}
            onEdit={onEdit}
            onDelete={handleDelete}
            onApprove={onApprove}
            permisos={permisos}
        />
    );
};

export default BeneficiariosCards;
