import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Button from '@mui/material/Button';

interface DialogComponentProps {
    open: boolean;
    onClose: () => void;
    title: string;
    content: string;
    primaryButtonText?: string;
    secondaryButtonText?: string;
    onPrimaryClick?: () => void;
    onSecondaryClick?: () => void;
}

const AlertDialog: React.FC<DialogComponentProps> = ({open, onClose, title, content, primaryButtonText, secondaryButtonText, onPrimaryClick, onSecondaryClick}) => {
    const [open_, setOpen] = React.useState<boolean>(open);
    
    const handleClickOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
  
    return (
      <React.Fragment>
        <Button variant="outlined" onClick={handleClickOpen}>
          Open alert dialog
        </Button>
        <Dialog
          open={open_}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">
            {title}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {content}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            {secondaryButtonText && <Button onClick={onSecondaryClick||onClose}>{secondaryButtonText}</Button>}
            {primaryButtonText && <Button onClick={onPrimaryClick||handleClose} autoFocus>
              {primaryButtonText}
            </Button>}
          </DialogActions>
        </Dialog>
      </React.Fragment>
    );
  }

  export default AlertDialog;