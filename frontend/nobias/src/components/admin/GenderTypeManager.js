import React, { useEffect, useState } from "react";
import {
  getGenderTypes,
  createGenderType,
  updateGenderType,
  deleteGenderType,
} from "../../api/adminService";
import Navbar from "../../components/common/Navbar";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const GenderTypeManager = () => {
  const [genders, setGenders] = useState([]);
  const [newGender, setNewGender] = useState("");
  const [editGender, setEditGender] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

  const fetchGenders = async () => {
    try {
      const res = await getGenderTypes();
      setGenders(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      console.error("Error fetching gender types:", error);
      setGenders([]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (newGender.trim()) {
      await createGenderType({ name: newGender.trim() });
      setNewGender("");
      fetchGenders();
    }
  };

  const handleUpdate = async () => {
    if (editGender?.name?.trim()) {
      await updateGenderType(editGender._id, { name: editGender.name.trim() });
      setEditGender(null);
      setOpenDialog(false);
      fetchGenders();
    }
  };

  const handleDelete = async (id) => {
    await deleteGenderType(id);
    fetchGenders();
  };

  useEffect(() => {
    fetchGenders();
  }, []);

  return (
    <>
      <Navbar type="adminGenderTypes" />

      <div className="gender-page">
        <div className="gender-container">
          <h2>Gender Type Management</h2>

          {/* Input form */}
          <form onSubmit={handleCreate} className="gender-form">
            <TextField
              label="New Gender Type"
              variant="outlined"
              value={newGender}
              onChange={(e) => setNewGender(e.target.value)}
              size="small"
              required
              fullWidth
              InputProps={{
                style: { background: "#2b2b2b", color: "#fff" },
              }}
              InputLabelProps={{
                style: { color: "#bbb" },
              }}
            />
            <Button variant="contained" type="submit" className="add-btn">
              Add Gender
            </Button>
          </form>

          {/* Table */}
          <TableContainer component={Paper} className="gender-table-container">
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                    #
                  </TableCell>
                  <TableCell style={{ color: "#fff", fontWeight: "bold" }}>
                    Gender Type
                  </TableCell>
                  <TableCell
                    align="right"
                    style={{ color: "#fff", fontWeight: "bold" }}
                  >
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {genders.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      style={{ color: "#ccc" }}
                    >
                      No gender types found.
                    </TableCell>
                  </TableRow>
                ) : (
                  genders.map((gender, index) => (
                    <TableRow key={gender._id}>
                      <TableCell style={{ color: "#fff" }}>
                        {index + 1}
                      </TableCell>
                      <TableCell style={{ color: "#fff" }}>
                        {gender.name}
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditGender(gender);
                            setOpenDialog(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          color="error"
                          onClick={() => handleDelete(gender._id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </div>

        {/* Edit Dialog */}
        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>Edit Gender Type</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Gender Type"
              fullWidth
              variant="standard"
              value={editGender?.name || ""}
              onChange={(e) =>
                setEditGender({ ...editGender, name: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button onClick={handleUpdate}>Save</Button>
          </DialogActions>
        </Dialog>
      </div>

      <style>{`
        .gender-page {
          background: #0f0f0f;
          min-height: 100vh;
          padding: 80px 20px 40px;
          color: #fff;
        }

        .gender-container {
          max-width: 700px;
          margin: 0 auto;
        }

        .gender-page h2 {
          text-align: center;
          margin-bottom: 30px;
          font-size: 2rem;
          background: linear-gradient(to right, #ff4d97, #ff6f61, #ff9800);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .gender-form {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 30px;
          flex-wrap: wrap;
        }

        .add-btn {
          background: linear-gradient(to right, #ff4d97, #ff9800);
          color: #fff;
          font-weight: 600;
        }

        .gender-table-container {
          background: #1e1e1e;
          border-radius: 8px;
          overflow: hidden;
        }

        .gender-table-container table {
          background: #1e1e1e;
        }

        .gender-table-container th {
          background: linear-gradient(to right, #ff4d97, #ff9800);
        }

        .gender-table-container tr:hover {
          background: #2a2a2a;
        }

        @media(max-width: 600px) {
          .gender-form {
            flex-direction: column;
          }

          .add-btn {
            width: 100%;
          }
        }
      `}</style>
    </>
  );
};

export default GenderTypeManager;
