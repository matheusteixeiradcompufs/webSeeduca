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
 * Componente para editar um aviso no mural de uma escola.
 * @module escolas/murais/avisos
 * @returns {JSX.Element} Componente para editar um aviso no mural de uma escola.
 */
function EditarEscolaMuralAviso() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { escolaid, muralid, avisoid } = useParams();
  const [loading, setLoading] = useState(true);
  const [titulo, setTitulo] = useState("");
  const [texto, setTexto] = useState("");

  useEffect(() => {
    const fetchAviso = async () => {
      try {
        const response = await api.get(`/escolas/mural/aviso/api/v1/${avisoid}/`);
        setTitulo(response.data.titulo);
        setTexto(response.data.texto);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchAviso();
        } else {
          toast.error("Erro ao carregar os dados do aviso!");
          console.log("Erro ao carregar os dados do aviso!", error);
        }
        setLoading(false);
      }
    };
    fetchAviso();
  }, []);

  /**
   * Função para lidar com a mudança do título do aviso.
   * @param {React.ChangeEvent<HTMLInputElement>} e - Evento de mudança do input.
   */
  const handleChangeTitulo = (e) => {
    setTitulo(e.target.value);
  };

  /**
   * Função para lidar com a mudança do texto do aviso.
   * @param {React.ChangeEvent<HTMLTextAreaElement>} e - Evento de mudança do textarea.
   */
  const handleChangeTexto = (e) => {
    setTexto(e.target.value);
  };

  /**
   * Função para editar um aviso.
   */
  const handleEditar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/mural/aviso/api/v1/${avisoid}/`, {
        titulo: titulo,
        texto: texto,
      });
      navigate(`/escola/${escolaid}/mural/${muralid}/aviso/${avisoid}/view`);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleEditar();
      } else {
        toast.error("Erro ao salvar aviso!");
        console.log("Erro ao salvar aviso!", error);
      }
      setLoading(false);
    }
  };

  /**
   * Função para cancelar a edição do aviso.
   */
  const handleCancelar = () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/mural/${muralid}/aviso/${avisoid}/view`);
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
                  Editar Aviso
                </MDTypography>
              </MDBox>
              <Grid container>
                <Grid item xs={12} sm={12}>
                  <MDBox pt={3} px={2}>
                    <MDInput
                      variant="outlined"
                      label="Título"
                      value={titulo}
                      onChange={handleChangeTitulo}
                      fullWidth
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <MDBox pt={3} px={2}>
                    <MDInput
                      variant="outlined"
                      label="Texto"
                      multiline
                      rows={5}
                      value={texto}
                      onChange={handleChangeTexto}
                      fullWidth
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} sm={12}>
                  <MDBox pt={2} px={2} mb={2} display="flex" justifyContent="center">
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

export default EditarEscolaMuralAviso;
