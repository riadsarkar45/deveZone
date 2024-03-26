import { Button, TextField } from "@mui/material";
import { useContext, useState } from "react";
import { UserContext } from "../../Global/User";
import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditOutlineIcon from '@mui/icons-material/ModeEditOutline';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
const EditProfile = () => {
    const { userInfo } = useContext(UserContext)
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
      };

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    return (
        <div>
            <div className="p-2">
                <div>
                    <TextField value={userInfo?.name} id="standard-basic" label="Name" variant="standard" fullWidth />
                </div>
                <div className="mt-3">
                    <TextField value={userInfo?.email} id="standard-basic" label="Email" variant="standard" fullWidth />
                </div>
                <div className="mt-3">
                    <TextField value='http://localhost:5173/profile' id="standard-basic" label="Custom Url" variant="standard" fullWidth />
                </div>
                <div className="mt-3 flex gap-3">
                    <Button variant="outlined" color="error" startIcon={<DeleteIcon />}>
                        Delete Account
                    </Button>
                    <Button onClick={handleClick} variant="outlined" color="warning" startIcon={<ModeEditOutlineIcon />}>
                        Update
                    </Button>
                </div>
            </div>
            <div>
                <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                    <Alert
                        onClose={handleClose}
                        severity="success"
                        variant="filled"
                        sx={{ width: '100%' }}
                    >
                        Update Successful 
                    </Alert>
                </Snackbar>
            </div>
        </div>

    );
};

export default EditProfile;