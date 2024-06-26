import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import { useNavigate, useParams } from "react-router-dom";
import MDInput from "components/MDInput";
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente funcional que representa a página de edição de um item da merenda.
 * @module itens
 * @returns {JSX.Element} O componente React para renderizar.
 */
function EditarItem() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { itemid } = useParams();
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    /**
     * Função assíncrona para buscar os dados do item da API.
     * @returns {Promise<void>}
     */
    const fetchItens = async () => {
      try {
        const response = await api.get(`/escolas/cardapio/item/api/v1/${itemid}/`);
        setNome(response.data.nome);
        setDescricao(response.data.descricao);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchItens();
        } else {
          toast.error("Erro ao carregar os dados do ítem da merenda!");
          console.log("Erro ao carregar os dados do ítem da merenda!", error);
        }
        setLoading(false);
      }
    };
    fetchItens();
  }, []);

  /**
   * Atualiza o estado do nome do item com o valor fornecido.
   * @param {Object} e - O evento de mudança.
   */
  const handleChangeNome = (e) => {
    setNome(e.target.value);
  };

  /**
   * Atualiza o estado da descrição do item com o valor fornecido.
   * @param {Object} e - O evento de mudança.
   */
  const handleChangeDescricao = (e) => {
    setDescricao(e.target.value);
  };

  /**
   * Edita o item da merenda.
   */
  const handleEditar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/cardapio/item/api/v1/${itemid}/`, {
        nome: nome,
        descricao: descricao,
      });
      navigate(`/itemmerenda/${itemid}/view`);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleEditar();
      } else {
        toast.error("Erro ao editar item!");
        console.log("Erro ao editar item!", error);
      }
      setLoading(false);
    }
  };

  /**
   * Cancela a edição do item e retorna à página de visualização.
   */
  const handleCancelar = () => {
    setLoading(true);
    navigate(`/itemmerenda/${itemid}/view`);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Audio
            height="80"
            width="80"
            radius="9"
            color="#3089ec"
            ariaLabel="three-dots-loading"
            wrapperStyle
            wrapperClass
          />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <ToastContainer />
      <DashboardNavbar />
      <MDBox pt={6} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="warning"
                borderRadius="lg"
                coloredShadow="warning"
              >
                <MDTypography variant="h6" color="white">
                  Modificar Item da Merenda
                </MDTypography>
              </MDBox>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <MDBox pt={3} px={2} display="flex">
                    <MDInput
                      variant="outlined"
                      label="Nome do Ítem"
                      value={nome}
                      onChange={handleChangeNome}
                      fullWidth
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <MDBox pt={3} px={2} display="flex">
                    <MDInput
                      variant="outlined"
                      label="Descrição do Ítem"
                      multiline
                      rows={5}
                      value={descricao}
                      onChange={handleChangeDescricao}
                      fullWidth
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <MDBox pt={3} px={2} mb={2} display="flex" justifyContent="center">
                    <MDBox mr={1}>
                      <MDButton variant="gradient" color="success" onClick={handleEditar}>
                        Salvar
                      </MDButton>
                    </MDBox>
                    <MDBox ml={1}>
                      <MDButton variant="gradient" color="error" onClick={handleCancelar}>
                        Cancelar
                      </MDButton>
                    </MDBox>
                  </MDBox>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default EditarItem;
