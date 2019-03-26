import axios from 'axios';

export const downloadFile = (fileName, url, callback) => {
    axios({
        url: url,
        method: 'GET',
        responseType: 'blob', // important
    }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', fileName);
        document.body.appendChild(link);
        link.click();
        if (callback)
            callback(response.data);
    });
}