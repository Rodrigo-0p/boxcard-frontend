import * as React from 'react';
import Main from '../../../util/main';

const url_verpermisos = '/bs/verPermisos';
const usePermisos = (tablas = []) => {

  const [permisos , setPermisos ] = React.useState(null);
  const [loading  , setLoading  ] = React.useState(true);
  const [error    , setError    ] = React.useState(null);

  React.useEffect(()=>{
    
    const fetchPermisos = async ()=>{
      if (!tablas || tablas.length === 0) {
        setLoading(false);
        return;
      }

      try {
      setLoading(true); 
      const resp = await Main.Request(url_verpermisos,'POST',{tablas})
        if (resp.data.success) {
          setPermisos(resp.data.permisos);
        } else {
          setError('Error al obtener permisos');
        }
      } catch (error) {
        console.error('Error obteniendo permisos:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchPermisos();

  },[tablas.join(',')]);

  return { permisos, loading, error }
};

export default usePermisos;