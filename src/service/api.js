import axios from "axios";

export const Request  = async(url, method, data, message = null) =>{
    try {
        return await axios({
            method : method,
            url    : process.env.REACT_APP_BASEURL + url,
            data   : data,
            headers:{ 'x-access-token': sessionStorage.getItem("token")},
        }).then( response =>{
            return response;
        })    
    } catch (error) {
        if ([403,500, 401, 404, 400].includes(error.response?.status)) {
            if (message) {
                message.error(error.response.data.message || 'Error en la solicitud');
            }            
        }else{
            console.error('Error en Request:', error);
            return { data: { success: false, message: 'Actualmente no podemos conectarnos. Revisa tu conexión a internet o inténtalo más tarde' } };
        }
    }
    
}