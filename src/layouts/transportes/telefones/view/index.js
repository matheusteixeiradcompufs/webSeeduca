import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { AuthContext } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useParams, useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import { api } from "services/apiClient";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente para visualizar um telefone associado a um transporte.
 * @module transportes/telefones
 * @returns {JSX.Element} Componente de visualização de telefone do transporte.
 */
function ViewTransporteTelefone() {
  const { refreshToken } = useContext(AuthContext);
  const { transporteid, telefoneid } = useParams();
  const [loading, setLoading] = useState(true);
  const [numero, setNumero] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTelefone = async () => {
      try {
        const response = await api.get(`/pessoas/transporte/telefone/api/v1/${telefoneid}/`);
        setNumero(response.data.numero);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchTelefone();
        } else {
          toast.error("Erro ao carregar telefone!");
          console.log("Erro ao carregar telefone!", error);
        }
        setLoading(false);
      }
    };
    fetchTelefone();
  }, []);

  /**
   * Redireciona para a página de edição do telefone.
   */
  const handleOnEditar = () => {
    setLoading(true);
    navigate(`/transportes/${transporteid}/telefone/${telefoneid}/editar`);
  };

  /**
   * Volta para a página de listagem de telefones do transporte.
   */
  const handleVoltar = () => {
    setLoading(true);
    navigate(`/transportes/${transporteid}/telefones`);
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
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Visualizar Telefone do Transporte
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
                      fullWidth
                      disabled
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDBox mr={1}>
                      <MDButton variant="contained" color="warning" onClick={handleOnEditar}>
                        Modificar
                      </MDButton>
                    </MDBox>
                    <MDBox ml={1}>
                      <MDButton variant="contained" color="error" onClick={handleVoltar}>
                        Voltar
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

export default ViewTransporteTelefone;
