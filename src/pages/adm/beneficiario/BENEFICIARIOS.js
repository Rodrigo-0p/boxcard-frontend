import * as React from 'react';
import Main from '../../../util/main';
import MainIcon from '../../../util/mainIcon';
import MainUrl from './url/mainUrl';

// COMPONENTS
import BeneficiariosHeader from '../../base/beneficiarios/component/header/BeneficiariosHeader';
import BeneficiariosToolbar from '../../base/beneficiarios/component/toolbar/BeneficiariosToolbar';
import BeneficiariosCards from '../../base/beneficiarios/component/cards/BeneficiariosCards';
import BeneficiariosModal from '../../base/beneficiarios/component/modal/BeneficiariosModal';
import CargaMasivaModal from '../../base/beneficiarios/component/modal/CargaMasivaModal';

import MainLayout from '../../../components/layout/MainLayout';
import '../../base/beneficiarios/styles/BENEFICIARIOS.css';

const cod_form = 11; // Código del menú de Beneficiarios

const initialFilters = {
    searchText: '',
    estadoFilter: 'all',
    modalidadFilter: 'all',
};

const BENEFICIARIOS = () => {
    const menuProps = Main.useMenuNavigation(cod_form);

    const [beneficiarios, setBeneficiarios] = React.useState([]);
    const [beneficiariosFiltrados, setBeneficiariosFiltrados] = React.useState([]);
    const [filters, setFilters] = React.useState(initialFilters);
    const [loading, setLoading] = React.useState(false);
    const [currentPage, setCurrentPage] = React.useState(1);
    const [pageSize, setPageSize] = React.useState(12);

    // Modales
    const [modalVisible, setModalVisible] = React.useState(false);
    const [modalMode, setModalMode] = React.useState('create');
    const [benefSeleccionado, setBenefSeleccionado] = React.useState(null);
    const [cargaMasivaVisible, setCargaMasivaVisible] = React.useState(false);

    const message = Main.useMessage();

    const { permisos, loading: permisosLoading, error: permisosError } = Main.usePermisos(['nominas_benef']);

    React.useEffect(() => {
        if (permisos?.globales?.view) {
            loadBeneficiarios();
        }
    }, [permisos]);

    React.useEffect(() => {
        aplicarFiltros();
        setCurrentPage(1);
    }, [filters, beneficiarios]);

    const loadBeneficiarios = async () => {
        setLoading(true);
        try {
            const resp = await Main.Request(MainUrl.url_listar, 'GET', {});
            if (resp.data.success) {
                setBeneficiarios(resp.data.data || []);
                setBeneficiariosFiltrados(resp.data.data || []);
            } else {
                message.error('Error al cargar beneficiarios');
            }
        } catch (error) {
            message.error('Error al cargar beneficiarios');
        } finally {
            setLoading(false);
        }
    };

    const aplicarFiltros = () => {
        let filtered = [...beneficiarios];

        if (filters.searchText) {
            const search = Main.normalize(filters.searchText);
            filtered = filtered.filter(b => {
                const texto = Main.normalize(
                    `${b.nombre_completo} ${b.nro_documento} ${b.ruc} ${b.nro_telef} ${b.correo}`
                );
                return search.split(' ').every(t => texto.includes(t));
            });
        }

        if (filters.estadoFilter !== 'all') {
            filtered = filtered.filter(b => b.estado === filters.estadoFilter);
        }

        setBeneficiariosFiltrados(filtered);
    };

    const handleFiltersChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handlePageSizeChange = (newPageSize) => {
        setPageSize(newPageSize);
        setCurrentPage(1);
    };

    const handleNuevo = () => {
        setModalMode('create');
        setBenefSeleccionado(null);
        setModalVisible(true);
    };

    const handleEdit = (beneficiario) => {
        setModalMode('edit');
        setBenefSeleccionado(beneficiario);
        setModalVisible(true);
    };

    const handleView = (beneficiario) => {
        setModalMode('view');
        setBenefSeleccionado(beneficiario);
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
        setBenefSeleccionado(null);
    };

    const handleSave = async (formData) => {
        try {
            let resp;
            if (modalMode === 'edit') {
                const payload = {
                    ...formData,
                    cod_beneficiario: benefSeleccionado.cod_beneficiario,
                };
                resp = await Main.Request(MainUrl.url_update, 'POST', payload);
            } else {
                resp = await Main.Request(MainUrl.url_insert, 'POST', formData);
            }

            if (resp.data.success) {
                message.success(resp.data.mensaje || 'Operación exitosa');
                handleModalClose();
                await loadBeneficiarios();
            } else {
                message.warning(resp.data.mensaje);
            }
        } catch (error) {
            message.error('Se produjo un error al procesar la información.');
        }
    };

    const handleSaveDelete = async (cod_beneficiario) => {
        try {
            const resp = await Main.Request(MainUrl.url_delete, 'POST', { cod_beneficiario });
            if (resp.data.success) {
                message.success(resp.data.mensaje || 'Beneficiario eliminado');
                await loadBeneficiarios();
            } else {
                message.error(resp.data.mensaje);
            }
        } catch (error) {
            message.warning('Error al eliminar beneficiario');
        }
    };

    const handleApprove = async (cod_beneficiario) => {
        try {
            const resp = await Main.Request(MainUrl.url_aprobar, 'POST', { cod_beneficiario });
            if (resp.data.success) {
                message.success(resp.data.mensaje);
                await loadBeneficiarios();
            } else {
                message.error(resp.data.mensaje);
            }
        } catch (error) {
            message.error('Error al aprobar beneficiario');
        }
    };

    const handleOpenCargaMasiva = () => setCargaMasivaVisible(true);
    const handleCloseCargaMasiva = () => setCargaMasivaVisible(false);
    const handleFinishCargaMasiva = async () => {
        setCargaMasivaVisible(false);
        await loadBeneficiarios();
    };

    const handleDescargarModelo = async () => {
        try {
            const XLSX = await import('xlsx');
            const wb = XLSX.utils.book_new();

            const wsData = [
                ['Documento', 'RUC', 'Nombre y Apellido', 'Email', 'Telefono', 'Monto Limite'],
                ['1234567', '1234567-0', 'JUAN PEREZ', 'juan.perez@ejemplo.com', '0981123456', 0],
            ];
            const ws = XLSX.utils.aoa_to_sheet(wsData);

            ['A2', 'B2'].forEach(addr => { if (ws[addr]) ws[addr].z = '@'; });

            ws['!cols'] = [
                { wch: 15 }, { wch: 15 }, { wch: 35 }, { wch: 30 }, { wch: 15 }, { wch: 15 }
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Modelo Importacion');
            XLSX.writeFile(wb, 'Modelo_Beneficiarios_BoxCard.xlsx');
            message.success('Plantilla descargada correctamente');
        } catch (err) {
            message.error('Error al generar la plantilla');
        }
    };

    const handleExportar = async () => {
        try {
            const XLSX = await import('xlsx');
            message.loading('Preparando exportación...', 0);

            if (beneficiariosFiltrados.length === 0) {
                message.destroy();
                message.warning('No hay datos para exportar');
                return;
            }

            const headers = ['N°', 'Documento', 'RUC', 'Nombre y Apellido', 'Celular', 'Email', 'Monto Límite', 'Estado'];
            const bodyRows = beneficiariosFiltrados.map((b, i) => [
                i + 1,
                b.nro_documento || '',
                b.ruc || '',
                b.nombre_completo || '',
                b.nro_telef || '',
                b.correo || '',
                b.monto_limite || 0,
                b.estado === 'A' ? 'Activo' : b.estado === 'P' ? 'Pendiente' : 'Inactivo',
            ]);

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.aoa_to_sheet([headers, ...bodyRows]);

            bodyRows.forEach((_, rowIdx) => {
                const docCell = `B${rowIdx + 2}`;
                const rucCell = `C${rowIdx + 2}`;
                if (ws[docCell]) ws[docCell].z = '@';
                if (ws[rucCell]) ws[rucCell].z = '@';
            });

            ws['!cols'] = [
                { wch: 5 }, { wch: 18 }, { wch: 15 }, { wch: 35 }, { wch: 15 }, { wch: 30 }, { wch: 18 }, { wch: 10 }
            ];

            XLSX.utils.book_append_sheet(wb, ws, 'Catastro Beneficiarios');
            const fecha = new Date().toISOString().split('T')[0];
            XLSX.writeFile(wb, `Beneficiarios_${fecha}.xlsx`);

            message.destroy();
            message.success(`${beneficiariosFiltrados.length} registro(s) exportado(s)`);
        } catch (error) {
            console.error('Error al exportar:', error);
            message.destroy();
            message.error('Error al exportar');
        }
    };

    return (
        <MainLayout {...menuProps}>
            {
                permisosLoading ? (
                    <Main.BeneficiarioSkeleton />
                ) : permisosError ? (
                    <Main.SinAcceso
                        titulo="Error al Verificar Permisos"
                        mensaje="Ocurrió un error al verificar tus permisos. Por favor, intenta recargar la página."
                    />
                ) : !permisos?.globales?.view ? (
                    <Main.SinAcceso
                        titulo="Acceso Denegado"
                        mensaje="No tienes permisos para ver el módulo de Beneficiarios"
                    />
                ) : (
                    <>
                        <div style={{ paddingBottom: '60px' }}>

                            <BeneficiariosHeader
                                totalBeneficiarios={beneficiarios.length}
                                onRefreshData={loadBeneficiarios}
                                handleExportar={handleExportar}
                                onDescargarModelo={handleDescargarModelo}
                                onImportar={handleOpenCargaMasiva}
                                onNuevo={handleNuevo}
                            />

                            <BeneficiariosToolbar
                                onFiltersChange={handleFiltersChange}
                            />

                            <BeneficiariosCards
                                beneficiarios={beneficiariosPaginados}
                                loading={loading}
                                onView={handleView}
                                onEdit={handleEdit}
                                onApprove={handleApprove}
                                permisos={permisos.globales}
                                saveDelete={handleSaveDelete}
                            />
                        </div>

                        <Main.Pages
                            currentPage={currentPage}
                            pageSize={pageSize}
                            total={beneficiariosFiltrados.length}
                            onPageChange={handlePageChange}
                            onPageSizeChange={handlePageSizeChange}
                        />

                        <BeneficiariosModal
                            visible={modalVisible}
                            mode={modalMode}
                            beneficiario={benefSeleccionado}
                            onClose={handleModalClose}
                            onSave={handleSave}
                            permisos={permisos.globales}
                        />

                        <CargaMasivaModal
                            visible={cargaMasivaVisible}
                            onClose={handleCloseCargaMasiva}
                            onFinish={handleFinishCargaMasiva}
                        />

                    </>
                )
            }
        </MainLayout>
    );
};

export default BENEFICIARIOS;
