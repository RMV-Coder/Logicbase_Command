import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useRouter } from "next/navigation";
interface DialogFormProps{
    open: boolean;
    onClose: () => void;
    isVerified: (data: boolean) => void;
}
const VerifyAdminDialog: React.FC<DialogFormProps> = ({open, onClose, isVerified}) => {
    const router = useRouter();
    const handleClose = () => {
        onClose();
    };

  return (
    
    <Dialog
        open={open}
        onClose={handleClose}
        slotProps={{
            paper: {
                component: 'form',
                onSubmit: async(event: React.FormEvent<HTMLFormElement>) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const email = formData.get('email');
                const password = formData.get('password');
                const response = await fetch('/api/verify-admin', {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ email, password }),
                    });
                    const data = await response.json();
                    if(!response.ok){
                        isVerified(false);
                        router.push('/');
                        throw new Error(data.error);
                    }
                    isVerified(true);
                    handleClose();
                },
            },
        }}
      >
        <DialogTitle>Restricted Admin Access Only</DialogTitle>
        <DialogContent>
            <DialogContentText>
                To gain access to the admin panel, please enter your email address here.
            </DialogContentText>
            <TextField
                autoFocus
                required
                margin="dense"
                id="email"
                name="email"
                label="Email Address"
                type="email"
                fullWidth
                variant="standard"
            />
            <TextField
                autoFocus
                required
                margin="dense"
                id="password"
                name="password"
                label="Admin Password"
                type="password"
                fullWidth
                variant="standard"
            />
        </DialogContent>
        <DialogActions>
            <Button onClick={()=>{
                isVerified(false);
                handleClose();
            }}>Cancel</Button>
            <Button type="submit">Verify</Button>
        </DialogActions>
    </Dialog>
  );
}
export default VerifyAdminDialog;
