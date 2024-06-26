import { Card, Grid, MenuItem } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import { AuthContext } from "context/AuthContext";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import Select from "examples/Select";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { api } from "services/apiClient";

/**
 * Componente para editar o cardápio de uma escola.
 * @module escolas/cardapios
 * @returns {JSX.Element} Componente para edição de cardápio de escola.
 */
function EditarEscolaCardapio() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { escolaid, cardapioid } = useParams();
  const [data, setData] = useState("");
  const [turno, setTurno] = useState("M");
  const [loading, setLoading] = useState(true);

  /**
   * Efeito para carregar os dados do cardápio ao montar o componente.
   */
  useEffect(() => {
    const fetchCardapio = async () => {
      try {
        const response = await api.get(`/escolas/cardapio/api/v1/${cardapioid}/`);
        setData(response.data.data);
        setTurno(response.data.turno);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchCardapio();
        } else {
          toast.error("Erro ao carregar dados do cardápio");
          console.error("Erro ao carregar dados do cardápio", error);
        }
        setLoading(false);
      }
    };
    fetchCardapio();
  }, []);

  /**
   * Manipula a mudança de valor do campo de data.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleChangeData = (e) => {
    setData(e.target.value);
  };

  /**
   * Manipula a mudança de valor do campo de turno.
   * @param {React.ChangeEvent<{ value: unknown }>} e - O evento de mudança.
   */
  const handleChangeTurno = (e) => {
    setTurno(e.target.value);
  };

  /**
   * Manipula a edição do cardápio.
   */
  const handleEditar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/cardapio/api/v1/${cardapioid}/`, {
        data: data,
        turno: turno,
      });
      navigate(`/escola/${escolaid}/cardapio/${cardapioid}/view`);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleEditar(cardapioid);
      } else {
        toast.error("Erro ao cadastrar escola");
        console.error("Erro ao cadastrar escola", error);
      }
      setLoading(false);
    }
  };

  /**
   * Manipula o cancelamento da edição do cardápio.
   */
  const handleCancelar = () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/cardapio/${cardapioid}/view`);
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
                  Modificar Cardápio
                </MDTypography>
              </MDBox>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={6}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="date"
                      variant="outlined"
                      label="Data"
                      value={data}
                      onChange={handleChangeData}
                      fullWidth
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={6}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <Select label="Selecione um turno" value={turno} onChange={handleChangeTurno}>
                      <MenuItem value="M">Manhã</MenuItem>
                      <MenuItem value="T">Tarde</MenuItem>
                      <MenuItem value="N">Noite</MenuItem>
                    </Select>
                  </MDBox>
                </Grid>
                <Grid item xs={12}>
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

export default EditarEscolaCardapio;
