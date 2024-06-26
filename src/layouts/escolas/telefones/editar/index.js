import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { AuthContext } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "services/apiClient";

/**
 * Componente para editar o número de telefone de uma escola.
 * @module escolas/telefones
 * @returns {JSX.Element} Componente para editar o número de telefone de uma escola.
 */
function EditarEscolaTelefone() {
  const { refreshToken } = useContext(AuthContext);
  const { escolaid, telefoneid } = useParams();
  const navigate = useNavigate();
  const [numero, setNumero] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    /**
     * Função assíncrona para buscar os dados do telefone da escola.
     */
    const fetchTelefone = async () => {
      try {
        const response = await api.get(`/escolas/telefone/api/v1/${telefoneid}/`);
        setNumero(response.data.numero);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchTelefone();
        } else {
          toast.error("Erro ao carregar dados do telefone!");
          console.log("Erro ao carregar dados do telefone!", error);
        }
        setLoading(false);
      }
    };
    fetchTelefone();
  }, []);

  /**
   * Função para lidar com a alteração do número do telefone.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleChangeNumero = (e) => {
    setNumero(e.target.value);
  };

  /**
   * Função para lidar com a edição do número de telefone.
   */
  const handleEditar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/telefone/api/v1/${telefoneid}/`, {
        numero: numero,
      });
      navigate(`/escola/${escolaid}/telefone/${telefoneid}/view`);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleEditar();
      } else {
        toast.error("Erro ao cadastrar escola");
        console.log("Erro ao cadastrar escola", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para lidar com o cancelamento da edição do número de telefone.
   */
  const handleCancelar = () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/telefone/${telefoneid}/view`);
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
                  Modificar Telefone da Escola
                </MDTypography>
              </MDBox>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12} sm={12}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="number"
                      variant="outlined"
                      label="Número"
                      value={numero}
                      onChange={handleChangeNumero}
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

export default EditarEscolaTelefone;
