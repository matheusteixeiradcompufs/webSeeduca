import { Card, Grid } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

/**
 * Componente que representa o menu do aluno.
 * @module escolas/salas/turmas/alunos/components
 * @param {Object} props - Propriedades do componente.
 * @param {string} props.boletimid - ID do boletim do aluno.
 * @param {string} props.alunoid - ID do aluno.
 * @returns {JSX.Element} O componente do menu do aluno.
 */
function Menu({ boletimid, alunoid }) {
  return (
    <Card>
      <MDBox
        mx={2}
        mt={-2}
        py={2}
        px={2}
        variant="gradient"
        bgColor="info"
        borderRadius="lg"
        coloredShadow="info"
      >
        <MDTypography variant="h6" color="white">
          Menu do Aluno
        </MDTypography>
      </MDBox>
      <Grid container spacing={3} mb={2}>
        <Grid item xs={12} sm={12}>
          <MDBox display="flex" justifyContent="center" pt={2} px={2}>
            <MDBox mr={1} ml={1}>
              <Link to={`/pessoas/aluno/${alunoid}/boletim/${boletimid}/frequencia`}>
                <MDButton variant="gradient" color="secondary">
                  Frequência
                </MDButton>
              </Link>
            </MDBox>
            <MDBox mr={1} ml={1}>
              <Link to={`/pessoas/aluno/${alunoid}/boletim/${boletimid}/notas`}>
                <MDButton variant="gradient" color="secondary">
                  Notas
                </MDButton>
              </Link>
            </MDBox>
          </MDBox>
        </Grid>
      </Grid>
    </Card>
  );
}

// Definição das propriedades necessárias e seus tipos
Menu.propTypes = {
  boletimid: PropTypes.string.isRequired, // ID do boletim do aluno
  alunoid: PropTypes.string.isRequired, // ID do aluno
};

export default Menu;
