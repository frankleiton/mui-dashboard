import { Grid, Paper } from "@mui/material";
import TableUser from "../Components/TableUser";

const Customers = () => {
  return (
    <Grid item xs={12}>
      <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
        <TableUser />
      </Paper>
    </Grid>
  );
};

export default Customers;
