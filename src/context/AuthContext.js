import { createContext, ReactNode, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { api } from "services/apiClient";
import { destroyCookie, setCookie, parseCookies } from "nookies";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({
    username: "",
    first_name: "",
    grupo: "",
    is_superuser: false,
    access: "",
    refresh: "",
  });
  const isAuthenticated = user.username !== "";
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsername = async () => {
      const cookies = parseCookies(AuthContext);
      const access = cookies["@seeduca.access"];
      const refresh = cookies["@seeduca.refresh"];
      const username = cookies["@seeduca.username"];

      if (access) {
        api.defaults.headers["Authorization"] = `Bearer ${access}`;
        try {
          const response = await api.post("/pessoas/me/", { username });
          const { objeto_usuario } = response.data;
          const { first_name, objetos_grupos, is_superuser } = objeto_usuario;

          setUser((prevUser) => ({
            ...prevUser,
            username: username,
            first_name: first_name,
            grupo: objetos_grupos[0].name,
            is_superuser: is_superuser,
            access: access,
            refresh: refresh,
          }));
          api.defaults.headers["Authorization"] = `Bearer ${access}`;
          setLoading(false);
        } catch (error) {
          console.log(error);
          logout();
          setLoading(false);
        }
      }
    };
    fetchUsername();
  }, []);

  async function obterTokens({ username, password }) {
    console.log("Tentando obter os tokens de acesso!");
    try {
      const response = await api.post("/api/token/", {
        username,
        password,
      });

      const { access, refresh } = await response.data;

      setCookie(AuthContext, "@seeduca.access", access, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/", // Quais caminhos terao acesso ao cookie
      });
      setCookie(AuthContext, "@seeduca.refresh", refresh, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/", // Quais caminhos terao acesso ao cookie
      });
      setUser((prevUser) => ({
        ...prevUser,
        access: access,
        refresh: refresh,
      }));

      api.defaults.headers["Authorization"] = `Bearer ${access}`;

      console.log("Tokens obtidos com sucesso!");
    } catch (error) {
      toast.error("Erro ao obter os tokens de acesso. Verifique suas credenciais!");
      console.error("Erro ao obter os tokens de acesso:", error);
    }
  }

  async function refreshToken() {
    console.log("Tentando atualizar o token de acesso!");
    try {
      const response = await api.post("/api/token/refresh/", {
        refresh: user.refresh,
      });

      const { access } = await response.data;

      setUser((prevUser) => ({
        ...prevUser,
        access: access,
      }));

      api.defaults.headers["Authorization"] = `Bearer ${access}`;

      setCookie(AuthContext, "@seeduca.access", access, {
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
      });

      console.log("Token de acesso atualizado com sucesso!");
    } catch (error) {
      if (error.response.status === 401) {
        toast.error("Sua sessão expirou. Faça login novamente.");
        console.log("Sua sessão expirou. Faça login novamente.");
        await logout();
        navigate("/");
      } else {
        toast.error("Erro ao atualizar o token!");
        console.log("Erro ao atualizar o token:", error);
      }
    }
  }

  async function login({ username, password }) {
    setLoading(true);
    await obterTokens({ username, password });
    console.log("Tentando buscar os dados do usuário!");

    let first_name, objetos_grupos, is_superuser;
    try {
      const response = await api.post("/pessoas/me/", {
        username,
      });
      if (response.data.is_superuser) {
        (first_name = "Administrador"),
          (objetos_grupos = [{ name: "Administrador" }]),
          (is_superuser = response.data.is_superuser);
      } else {
        const { objeto_usuario } = response.data;
        ({ username, first_name, objetos_grupos, is_superuser } = objeto_usuario);
      }

      setUser((prevUser) => ({
        ...prevUser,
        username: username,
        first_name: first_name,
        grupo: objetos_grupos[0].name,
        is_superuser: is_superuser,
      }));

      setCookie(AuthContext, "@seeduca.username", username, {
        maxAge: 60 * 60 * 24 * 30, // Expirar em 1 mes
        path: "/", // Quais caminhos terao acesso ao cookie
      });

      console.log("Dados do usuário obtidos com sucesso!");
      navigate("/");
    } catch (err) {
      toast.error("Erro ao buscar dados do usuário!");
      console.log("Erro ao buscar dados do usuário!", err);
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    try {
      destroyCookie(undefined, "@seeduca.access");
      destroyCookie(undefined, "@seeduca.refresh");
      destroyCookie(undefined, "@seeduca.username");
      setUser((prevUser) => ({
        ...prevUser,
        username: "",
        first_name: "",
        grupo: "",
        is_superuser: false,
        access: "",
        refresh: "",
      }));
      navigate("/");
      setLoading(false);
    } catch {
      console.log("erro ao deslogar");
      setLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, loading, setLoading, login, refreshToken, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
