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
 * Componente para editar uma escola existente.
 * @module escolas
 * @returns {JSX.Element} Componente EditarEscola.
 */
function EditarEscola() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { escolaid } = useParams();
  const [loading, setLoading] = useState(true);
  const [cnpj, setCnpj] = useState("");
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [descricao, setDescricao] = useState("");

  useEffect(() => {
    /**
     * Função assíncrona para buscar os detalhes da escola a ser editada.
     */
    const fetchEscola = async () => {
      try {
        const response = await api.get(`/escolas/api/v1/${escolaid}/`);
        setCnpj(response.data.cnpj);
        setNome(response.data.nome);
        setEndereco(response.data.endereco);
        setDescricao(response.data.descricao);
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchEscola();
        } else {
          toast.error("Erro ao carregar escolas");
          console.error("Erro ao carregar escolas:", error);
        }
        setLoading(false);
      }
    };
    fetchEscola();
  }, []);

  /**
   * Manipulador para alterar o valor do CNPJ.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleChangeCnpj = (e) => {
    setCnpj(e.target.value);
  };

  /**
   * Manipulador para alterar o valor do nome.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleChangeNome = (e) => {
    setNome(e.target.value);
  };

  /**
   * Manipulador para alterar o valor do endereço.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleChangeEndereco = (e) => {
    setEndereco(e.target.value);
  };

  /**
   * Manipulador para alterar o valor da descrição.
   * @param {React.ChangeEvent<HTMLInputElement>} e - O evento de mudança.
   */
  const handleChangeDescricao = (e) => {
    setDescricao(e.target.value);
  };

  /**
   * Manipulador para salvar as alterações feitas na escola.
   */
  const handleEditar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/api/v1/${escolaid}/`, {
        cnpj: cnpj,
        nome: nome,
        endereco: endereco,
        descricao: descricao,
      });
      navigate(`/escola/${escolaid}/view`);
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
   * Manipulador para cancelar a edição da escola.
   */
  const handleCancelar = () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/view`);
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
                  Modificar Escola
                </MDTypography>
              </MDBox>
              <Grid container spacing={3} mb={2}>
                <Grid item xs={12} sm={12}>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="number"
                      variant="outlined"
                      label="CNPJ"
                      value={cnpj}
                      onChange={handleChangeCnpj}
                      fullWidth
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="text"
                      variant="outlined"
                      label="Nome"
                      value={nome}
                      onChange={handleChangeNome}
                      fullWidth
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="text"
                      variant="outlined"
                      label="Endereço"
                      value={endereco}
                      onChange={handleChangeEndereco}
                      fullWidth
                    />
                  </MDBox>
                  <MDBox display="flex" justifyContent="center" pt={2} px={2}>
                    <MDInput
                      type="text"
                      variant="outlined"
                      label="Descrição"
                      value={descricao}
                      onChange={handleChangeDescricao}
                      multiline
                      rows={3}
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

export default EditarEscola;
