import axios from "axios";

export const Request = async (url, method, data, message = null) => {
    try {
        return await axios({
            method: method,
            url: process.env.REACT_APP_BASEURL + url,
            data: data,
            headers: { 'x-access-token': sessionStorage.getItem("token") },
        });
    } catch (error) {
        const errorResponse = {
            success: false,
            message: 'Error desconocido',
            status: error.response?.status
        };

        // Si hay respuesta del servidor
        if (error.response) {
            const data = error.response.data;
            const technical = data?.error ? ` (${data.error})` : '';
            errorResponse.message = (data?.mensaje || data?.message || 'Error del servidor') + technical;

            // Manejar token expirado específicamente
            if (error.response.status === 401 &&
                error.response.data?.code === 'TOKEN_EXPIRED') {
                errorResponse.message = 'Tu sesión ha expirado';
                sessionStorage.clear();
                window.location.href = '/';
            }

            // Mostrar mensaje si existe contexto
            if (message) {
                message.error(errorResponse.message);
            }
        }
        // Si no hay respuesta pero sí request (sin conexión)
        else if (error.request) {
            errorResponse.message = 'Actualmente no podemos conectarnos. Revisa tu conexión a internet o inténtalo más tarde';
            if (message) {
                message.error(errorResponse.message);
            }
        }
        // Error antes de hacer el request
        else {
            errorResponse.message = error.message || 'Error configurando la petición';
        }

        return { data: errorResponse };
    }
}