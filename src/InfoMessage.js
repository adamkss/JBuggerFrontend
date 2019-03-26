import React from 'react';
import { Typography } from '@material-ui/core';

export default ({ message }) =>
    <div className="padded-top">
        <Typography variant="subtitle2">
            {message}
        </Typography>
    </div>

