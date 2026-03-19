import * as React from 'react';
import {
  useLocation
  , useNavigate
} from "react-router-dom";
import useIdleTimeout from '../components/hook/useIdleTimeout'
import Main from '../util/main';
import axios from "axios";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [loading, setLoading] = React.useState(true);
  const [usuario, setUser] = React.useState(null);
  const [nombre, setNombre] = React.useState(null);
  const [empresa, setEmpresa] = React.useState([]);
  const [menus, setMenus] = React.useState([]);
  const [logoUrl, setLogoUrl] = React.useState(null);
  const [rol, setRol] = React.useState(null);

  React.useEffect(() => {
    const session = sessionStorage.getItem("session");
    if (session) {
      const vmenu = sessionStorage.getItem("menu") || '[]';
      const data = JSON.parse(session);
      const menu = JSON.parse(vmenu);
      setUser(data.cod_usuario);
      setNombre(data.nombre);
      setEmpresa(data.empresa);
      setMenus(menu);
      setLogoUrl(data.logoUrl);
      setRol(data.rol || data.role);
      const token = sessionStorage.getItem("token");
      if (token) {
        loadUserMenus();
      }
    }
    setLoading(false);
  }, []);

  const login = async ({ token, user, empresa }) => {
    try {
      setLoading(true);
      const session = {
        cod_usuario: user.username,
        empresa: empresa || [],
        nombre: user.descripcion,
        rol: user.role,
        login_time: user.login_time
      };
      sessionStorage.setItem("session", JSON.stringify(session));
      sessionStorage.setItem("token", token);
      setUser(session.cod_usuario);
      setNombre(session.nombre);
      setEmpresa(session.empresa);
      setRol(session.rol);
      updateLogo();
      await loadUserMenus();
      return { success: true };

    } catch (error) {
      setLoading(false);
      setUser(null);
      setNombre(null);
      setEmpresa([]);
      setMenus([]);
      sessionStorage.clear();
      return {
        success: false,
        message: error.message || 'Error al cargar permisos'
      };
    }
  };
  const logout = () => {
    sessionStorage.clear();
    setUser(null);
    setNombre(null);
    setEmpresa([]);
    setMenus([]);
    setRol(null);
    navigate("/");
  };
  const updateLogo = async () => {
    let session = JSON.parse(sessionStorage.getItem("session"));
    return new Promise(async (resolve) => {
      try {
        const token = sessionStorage.getItem('token');
        const response = await axios({
          method: 'GET',
          url: process.env.REACT_APP_BASEURL + '/img/logempresa',
          headers: { 'x-access-token': token },
          responseType: 'blob'
        })
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64String = reader.result;
          setLogoUrl(base64String);
          if (session) {
            session.logoUrl = base64String;
            sessionStorage.setItem("session", JSON.stringify(session));
          }
          resolve(true);
        };
        reader.readAsDataURL(response.data);
      } catch (err) {
        setLogoUrl('');
        if (session) {
          session.logoUrl = '';
          sessionStorage.setItem("session", JSON.stringify(session));
        }
        resolve(false);
      } finally {
        setLoading(false);
      }
    });
  };
  const getLogo = async (url) => {
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios({
        method: 'GET',
        url: `${process.env.REACT_APP_BASEURL}/img/logempresa?file_path=${url}`,
        headers: { 'x-access-token': token },
        responseType: 'blob'
      });

      // Convertir blob a base64 con Promise
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(response.data);
      });

    } catch (err) {
      console.error('Error cargando logo:', err);
      return null;
    }
  };
  // Cargar menús
  const loadUserMenus = async () => {
    try {
      const response = await Main.Request(`/bs/menus`, 'GET', {}) || {};
      if (response && response.data.success) {
        setMenus(response.data.data);
        sessionStorage.setItem("menu", JSON.stringify(response.data.data));
      } else {
        throw new Error(response.data.message || 'Error al cargar menús');
      }
    } catch (error) {
      console.error('Error cargando menús:', error);
    } finally {
      setLoading(false);
    }
  };
  const updateEmpresa = (nuevaEmpresa, newToken) => new Promise(async (resolve) => {
    try {
      let session = JSON.parse(sessionStorage.getItem("session"));
      let vtoken = sessionStorage.getItem("token");

      session.empresa = nuevaEmpresa;
      vtoken = newToken;
      sessionStorage.setItem("token", vtoken);
      sessionStorage.setItem("session", JSON.stringify(session));
      setEmpresa(nuevaEmpresa);
      await updateLogo();
      resolve(true);
    } catch (error) {
      console.error("Error al actualizar la empresa/sesión:", error);
      resolve(false);
    }
  });

  const updateToken = (newToken) => {
    sessionStorage.setItem("token", newToken);
  };
  // Hook de inactividad: 30 mins
  useIdleTimeout(logout, 30 * 60 * 1000);

  return (
    <AuthContext.Provider value={{
      usuario
      , nombre
      , empresa
      , menus
      , role: rol
      , loading
      , setLoading
      // FUNCIONES
      , login
      , logout
      , updateEmpresa
      , updateToken
      , logoUrl
      , getLogo
      , updateLogo
      , setNombreActualizado: (nuevoNombre) => {
        setNombre(nuevoNombre);
        let session = JSON.parse(sessionStorage.getItem("session"));
        if (session) {
          session.nombre = nuevoNombre;
          sessionStorage.setItem("session", JSON.stringify(session));
        }
      }
    }} >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);