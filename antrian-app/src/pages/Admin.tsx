import {
  alpha,
  Box,
  Button,
  Container,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Typography,
  type SelectChangeEvent,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAntrian, updateStatusAntrian } from "../api/api";

export const enum StatusCustomers {
  ACTIVE = "ACTIVE",
  WAITING = "WAITING",
  COMPLETE = "COMPLETE",
  INCOMPLETE = "INCOMPLETE",
}

const Admin = () => {
  const [open, setOpen] = React.useState(false);
  const [editStatus, setEditStatus] = React.useState(false);
  const [dataSelected, setDataSelected] = React.useState();
  const [statusTemp, setStatusTemp] = React.useState("WAITING");
  const [data, setData] = React.useState([]);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [totalRows, setTotalRows] = React.useState(0);
  const navigate = useNavigate();

  const handleViewDetail = (data: any) => {
    setDataSelected(data);
    setOpen(true);
  };
  const handleEditStatus = (data: any) => {
    setDataSelected(data);
    setStatusTemp(data.status);
    setEditStatus(true);
    setOpen(true);
  };

  const handleChangeStatus = (event: SelectChangeEvent) => {
    setStatusTemp(event.target.value);
  };

  const handleUpdateStatus = async () => {
    try {
      const response = await updateStatusAntrian(dataSelected!._id, statusTemp);
      setSnackbarOpen(true);
      fetchAllQueue();
      handleClose();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleClose = () => {
    setEditStatus(false);
    setOpen(false);
  };

  const fetchAllQueue = async () => {
    try {
      const response = await getAntrian(page + 1, rowsPerPage);
      setData(response.data.data);
      setTotalRows(response.data.total);
    } catch (error) {
      console.error("Failed to Fetching Data");
    }
  };

  useEffect(() => {
    fetchAllQueue();
  }, [page, rowsPerPage]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        color: "#09132E",
        backgroundColor: "#09132E",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
        padding: "10px"
      }}
    >
      <Paper
        sx={{
          height: "50%",
          padding: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 3,
          minWidth: "80%",
          background: "linear-gradient(145deg, #0b215e, #1E293B)",
        }}
        elevation={3}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            borderBottom: "3px solid #FBDC05",
            display: "inline-block",
            pb: 0.5,
            mb: 2,
            color: "white",
          }}
        >
          Data Antrian
        </Typography>
        <TableContainer component={Paper} elevation={3}>
          <Table>
            <TableHead
              sx={{
                backgroundColor: "#FBDC05",
                color: "black",
                fontWeight: "bold",
              }}
            >
              <TableRow>
                <TableCell
                  align="center"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  No
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  Nama
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  Email
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  Phone
                </TableCell>
                <TableCell
                  align="left"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  Timestamp
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  Status
                </TableCell>
                <TableCell
                  align="center"
                  sx={{ color: "black", fontWeight: "bold" }}
                >
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.length > 0 &&
                data.map((row: any, i) => (
                  <TableRow key={row._id}>
                    <TableCell align="center">
                      {page * rowsPerPage + i + 1}
                    </TableCell>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.email}</TableCell>
                    <TableCell align="left">{row.phone}</TableCell>
                    <TableCell align="left">
                      {new Date(row.timestamp).toLocaleString()}
                    </TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        color:
                          row.status === StatusCustomers.INCOMPLETE
                            ? "red"
                            : row.status === StatusCustomers.COMPLETE
                            ? "green"
                            : row.status === StatusCustomers.WAITING
                            ? "blue"
                            : "black",
                        fontWeight: "bold",
                        backgroundColor:
                          row.status === StatusCustomers.INCOMPLETE
                            ? alpha("#E6595A", 0.1)
                            : row.status === StatusCustomers.COMPLETE
                            ? alpha("#27B05B", 0.1)
                            : row.status === StatusCustomers.WAITING
                            ? alpha("#0044ff", 0.1)
                            : "transparent",
                        padding: 1,
                        borderRadius: 1,
                      }}
                    >
                      {row.status}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        onClick={() => {
                          row.status !== StatusCustomers.ACTIVE
                            ? handleViewDetail(row)
                            : handleEditStatus(row);
                        }}
                      >
                        {row.status == StatusCustomers.ACTIVE ? (
                          <ModeEditIcon />
                        ) : (
                          <VisibilityIcon />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={totalRows}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
          sx={{
            color: "white",
            "& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows":
              {
                color: "white",
              },
            "& .MuiSelect-icon": {
              color: "white",
            },
          }}
        />
      </Paper>
      <Dialog open={open} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle
          sx={{ fontWeight: "bold", textAlign: "center", color: "#16211B" }}
        >
          Detail Pelanggan
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 3 }}>
          <Box display="flex" flexDirection="column" gap={2}>
            <Typography variant="body1">
              <strong> Nama:</strong> {dataSelected?.name ?? ""}
            </Typography>
            <Typography variant="body1">
              <strong> Email:</strong> {dataSelected?.email ?? ""}
            </Typography>
            <Typography variant="body1">
              <strong> No. Hp:</strong> {dataSelected?.phone ?? ""}
            </Typography>
            {editStatus && (
              <Box display="flex" alignItems="center" gap={2}>
                <Typography variant="body1">
                  <strong> Status: </strong>
                </Typography>
                <Select
                  id="select-status"
                  value={statusTemp}
                  onChange={handleChangeStatus}
                  size="small"
                >
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="WAITING">WAITING</MenuItem>
                  <MenuItem value="COMPLETE">COMPLETE</MenuItem>
                  <MenuItem value="INCOMPLETE">INCOMPLETE</MenuItem>
                </Select>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center" }}>
          {editStatus ? (
            <Button
              onClick={handleUpdateStatus}
              variant="contained"
              sx={{
                marginBottom: "10px",
                backgroundColor: "#FBDC05",
                color: "#0D1B2A",
                fontWeight: 700,
                fontSize: "1rem",
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 4px 12px rgba(251, 220, 5, 0.3)",
                "&:hover": {
                  backgroundColor: "#E5C504",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(251, 220, 5, 0.4)",
                },
              }}
            >
              Simpan
            </Button>
          ) : (
            <Button
              onClick={handleClose}
              variant="contained"
              sx={{
                marginBottom: "10px",
                backgroundColor: "#FBDC05",
                color: "#0D1B2A",
                fontWeight: 700,
                fontSize: "1rem",
                py: 1.5,
                px: 3,
                borderRadius: 2,
                textTransform: "uppercase",
                fontFamily: "Inter, sans-serif",
                boxShadow: "0 4px 12px rgba(251, 220, 5, 0.3)",
                "&:hover": {
                  backgroundColor: "#E5C504",
                  transform: "translateY(-2px)",
                  boxShadow: "0 6px 20px rgba(251, 220, 5, 0.4)",
                },
              }}
            >
              Tutup
            </Button>
          )}
        </DialogActions>
      </Dialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message="Status updated successfully"
        ContentProps={{
          sx: {
            backgroundColor: "#10B981",
            color: "#fff",
          },
        }}
      />
    </Container>
  );
};

export default Admin;
