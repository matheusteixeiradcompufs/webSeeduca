import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import { useContext, useEffect, useState } from "react";
import { Audio } from "react-loader-spinner";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { api } from "services/apiClient";
import { useNavigate, useParams } from "react-router-dom";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import Transfer from "../components/Transfer";
import { AuthContext } from "context/AuthContext";
import DashboardNavbar from "layouts/dashboard/components/DashboardNavbar";

/**
 * Componente para gerenciar os itens do cardápio de uma escola.
 * Permite selecionar e salvar os itens do cardápio.
 * @module escolas/cardapios/itens
 * @returns {JSX.Element} Componente de gerenciamento de itens do cardápio.
 */
function ManageEscolaCardapioItens() {
  const { refreshToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const { escolaid, cardapioid } = useParams();
  const [loading, setLoading] = useState(true);
  const [left, setLeft] = useState([]);
  const [right, setRight] = useState([]);

  useEffect(() => {
    const fetchItens = async () => {
      try {
        const res = await api.get(`/escolas/cardapio/api/v1/${cardapioid}/`);
        setRight(res.data.objetos_itens);
        const response = await api.get("/escolas/cardapio/item/api/v1/");
        setLeft(
          response.data.filter(
            (item) => !res.data.objetos_itens.some((element) => element.id === item.id)
          )
        );
        setLoading(false);
      } catch (error) {
        if (error.response.status === 401) {
          await refreshToken();
          await fetchItens();
        } else {
          toast.error("Erro ao carregar cardápio!");
          console.error("Erro ao carregar cardápio!", error);
        }
        setLoading(false);
      }
    };
    fetchItens();
  }, []);

  /**
   * Salva os itens selecionados no cardápio da escola.
   */
  const handleSalvar = async () => {
    setLoading(true);
    try {
      await api.patch(`/escolas/cardapio/api/v1/${cardapioid}/`, {
        itens: right.map((item) => item.id),
      });
      navigate(`/escola/${escolaid}/cardapio/${cardapioid}/itens`);
    } catch (error) {
      if (error.response.status === 401) {
        await refreshToken();
        await handleSalvar();
      } else {
        toast.error("Erro ao salvar itens no cardápio!");
        console.error("Erro ao salvar itens no cardápio!", error);
      }
      setLoading(false);
    }
  };

  /**
   * Cancela a operação de gerenciamento de itens e retorna à página anterior.
   */
  const handleCancelar = () => {
    setLoading(true);
    navigate(`/escola/${escolaid}/cardapio/${cardapioid}/itens`);
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
                  Selecione os Itens do Cardápio
                </MDTypography>
              </MDBox>
              <MDBox pt={3} px={2} display="flex" justifyContent="center">
                <Transfer left={left} setLeft={setLeft} right={right} setRight={setRight} />
              </MDBox>
              <MDBox pt={3} px={2} mb={2} display="flex" justifyContent="center">
                <MDBox mr={1}>
                  <MDButton variant="gradient" color="success" onClick={handleSalvar}>
                    Salvar
                  </MDButton>
                </MDBox>
                <MDBox ml={1}>
                  <MDButton variant="gradient" color="error" onClick={handleCancelar}>
                    Cancelar
                  </MDButton>
                </MDBox>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
    </DashboardLayout>
  );
}

export default ManageEscolaCardapioItens;
