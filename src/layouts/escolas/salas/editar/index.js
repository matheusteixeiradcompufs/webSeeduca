import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente para editar informações de uma sala de uma escola.
 * @module escolas/salas
 * @returns {JSX.Element} Componente para editar informações de uma sala.
 */
function EditarEscolaSala() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { escolaid, salaid } = useParams();
  const [numero, setNumero] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSala = async () => {
      try {
        const response = await api.get(`/escolas/sala/api/v1/${salaid}/`);
        setNumero(response.data.numero);
        setQuantidade(response.data.quantidade_alunos);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchSala();
        } else {
          toast.error("Erro ao carregar escola");
          console.error("Erro ao carregar escola:", error);
        }
        setLoading(false);
      }
    };
    fetchSala();
  }, []);

  /**
   * Atualiza o estado do número da sala com o valor do input.
   * @param {React.ChangeEvent<HTMLInputElement>} e O evento de mudança do input.
   */
  const handleChangeNumero = (e) => {
    setNumero(e.target.value);
  };

  /**
   * Atualiza o estado da quantidade de alunos da sala com o valor do input.
   * @param {React.ChangeEvent<HTMLInputElement>} e O evento de mudança do input.
   */
  const handleChangeQuantidade = (e) => {
    setQuantidade(e.target.value);
  };

  /**
   * Manipula a edição das informações da sala.
   * Envia uma requisição para a API para modificar as informações da sala.
   */
  const handleEditar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/sala/api/v1/${salaid}/`, {
        numero: numero,
        quantidade_alunos: quantidade,
      });
      navigate(`/escola/${escolaid}/sala/${salaid}/view`);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleEditar();
      } else {
        toast.error("Erro ao modificar escola");
        console.log("Erro ao modificar escola", error);
      }
      setLoading(false);
    }
  };

  /**
   * Manipula o cancelamento da edição das informações da sala.
   * Navega de volta para a página de visualização da sala.
   */
  const handleCancelar = async () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/sala/${salaid}/view`);
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
                  Modificar Sala da Escola
                </MDTypography>
              </MDBox>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12} sm={12}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="number"
                      variant="outlined"
                      label="Número da Sala"
                      value={numero}
                      onChange={handleChangeNumero}
                      fullWidth
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="number"
                      variant="outlined"
                      label="Quantidade de Alunos da Sala"
                      value={quantidade}
                      onChange={handleChangeQuantidade}
                      fullWidth
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDBox mr={1}>
                      <MDButton variant="contained" color="success" onClick={handleEditar}>
                        Salvar
                      </MDButton>
                    </MDBox>
                    <MDBox ml={1}>
                      <MDButton variant="contained" color="error" onClick={handleCancelar}>
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

export default EditarEscolaSala;
