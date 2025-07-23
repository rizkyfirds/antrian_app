import {
  Box,
  Button,
  CircularProgress,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import jsPDF from "jspdf";
import {
  getAntrian,
  createAntrian,
  updateStatusAntrian,
  getCurrentQueue,
  getLastQueue,
  type createDataInterface,
} from "./api/api";

interface dataToPDFInterface {
  name: string;
  email: string;
  phone: number;
  timestamp: string;
  no_queue: number;
}

const App = () => {
  const [countQueue, setCountQueue] = React.useState(0);
  const [nowQueue, setNowQueue] = React.useState(0);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const fetchCurrentQueue = async () => {
    try {
      const response = await getCurrentQueue();
      const current: number = response.data;
      setNowQueue(current);
    } catch (error) {
      console.error("Gagal Fetching Data");
    }
  };

  const fetchLastQueue = async () => {
    try {
      const response = await getLastQueue();
      const last: number = response.data;
      setCountQueue(last);
    } catch (error) {
      console.error("Gagal Fetching Data");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const rawData = Object.fromEntries(formData.entries());
    const formJson: createDataInterface = {
      name: rawData.name as string,
      email: rawData.email as string,
      phone: rawData.phone as string,
    };
    try {
      const res = await createAntrian(formJson);
      if (res.status === 201) {
        const { name, email, phone, timestamp, no_queue } = res.data;
        const dataResult: dataToPDFInterface = {
          name,
          email,
          phone,
          timestamp,
          no_queue,
        };
        refetch();
        generatePDF(dataResult);
        handleClose();
      }
    } catch (err) {
      console.error("Error submitting antrian:", err);
    }
  };

  const generatePDF = (data: dataToPDFInterface) => {
    const doc = new jsPDF();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);

    doc.setTextColor(32, 48, 114);
    doc.text("TIKET ANTRIAN", 105, 30, { align: "center" });

    doc.setFontSize(72);
    doc.setTextColor(251, 220, 5);
    doc.text(data.no_queue.toString(), 105, 80, { align: "center" });

    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.setFont("helvetica", "normal");

    const date = new Date(data.timestamp);
    const dateStr = date.toLocaleDateString("id-ID", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    const timeStr = date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });

    doc.text(`Tanggal: ${dateStr}`, 20, 110);
    doc.text(`Waktu: ${timeStr}`, 20, 120);
    doc.text(`Nama: ${data.name}`, 20, 130);
    doc.text(`Phone: ${data.phone}`, 20, 140);
    doc.text(`Nomor Antrian: ${data.no_queue}`, 20, 150);

    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text(
      "Harap simpan tiket ini dan tunggu nomor Anda dipanggil.",
      105,
      200,
      { align: "center" }
    );
    doc.text("Terima kasih atas kesabaran Anda.", 105, 215, {
      align: "center",
    });

    doc.setDrawColor(32, 48, 114);
    doc.setLineWidth(2);
    doc.rect(10, 10, 190, 267);

    doc.save(`Tiket-Antrian-${data.no_queue}-${date.getTime()}.pdf`);
  };

  const refetch = () => {
    fetchCurrentQueue();
    fetchLastQueue();
  };

  React.useEffect(() => {
    refetch();
  }, []);

  return (
    <Container
      maxWidth={false}
      sx={{
        color: "#09132E",
        backgroundColor: "#09132E",
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontFamily: "'Inter', 'Roboto', 'Helvetica', 'Arial', sans-serif",
      }}
    >
      <Paper
        sx={{
          height: "100%",
          p: 6,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 4,
          minWidth: "300px",
          background: "linear-gradient(145deg, #0b215e, #1E293B)",
          color: "#fff",
          rowGap: "20px"
        }}
        elevation={6}
      >
        <Typography
          variant="h5"
          textAlign="center"
          sx={{
            fontWeight: 600,
            mb: 2,
            color: "#FFFFFF",
            fontFamily: "Inter, sans-serif",
          }}
        >
          Antrian Saat Ini
        </Typography>

        <Typography
          variant="h2"
          sx={{
            fontWeight: 800,
            zIndex: 1,
            fontSize: "3rem",
            color: "#FFFFFF",
            paddingX: "120px"
          }}
        >
          {nowQueue}
        </Typography>

        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "#CBD5E1",
            fontWeight: 500,
          }}
        >
          Total Antrian: <strong>{countQueue}</strong>
        </Typography>

        <Button
          variant="contained"
          fullWidth
          sx={{
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
          onClick={handleClickOpen}
        >
          Ambil Nomor Antrian
        </Button>
      </Paper>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          sx: {
            background: "linear-gradient(145deg, #0b215e, #1E293B)",
            color: "white",
            borderRadius: "14px",
          },
        }}
      >
        <DialogTitle fontWeight="bold" variant="h6">
          Form Pengambilan Antrian
        </DialogTitle>
        <DialogContent sx={{ paddingBottom: 0 }}>
          <form onSubmit={handleSubmit}>
            <TextField
              autoFocus
              required
              margin="dense"
              id="name"
              name="name"
              label="Nama Lengkap"
              type="text"
              fullWidth
              variant="filled"
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-root:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "& .MuiFilledInput-root.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="email"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="filled"
              sx={{
                input: { color: "white" },
                label: { color: "white" },
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-root:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "& .MuiFilledInput-root.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <TextField
              autoFocus
              required
              margin="dense"
              id="phone"
              name="phone"
              label="No. Hp"
              type="number"
              fullWidth
              variant="filled"
              sx={{
                input: {
                  color: "white",
                  "&::-webkit-outer-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "&::-webkit-inner-spin-button": {
                    WebkitAppearance: "none",
                    margin: 0,
                  },
                  "&[type=number]": {
                    MozAppearance: "textfield",
                  },
                },
                label: { color: "white" },
                borderRadius: "8px",
                boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.4)",
                "& .MuiFilledInput-root": {
                  backgroundColor: "transparent",
                },
                "& .MuiFilledInput-root:hover": {
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                },
                "& .MuiFilledInput-root.Mui-focused": {
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            />
            <DialogActions>
              <Button onClick={handleClose} sx={{backgroundColor: "#FBDC05", paddingX: "20px", color: "black", fontWeight: "Bold"}}>Batal</Button>
              <Button type="submit" sx={{backgroundColor: "#10B981", paddingX: "20px", color: "black", fontWeight: "Bold"}}>Kirim</Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Container>
  );
};

export default App;
