const { app, BrowserWindow } = require('electron');
app.commandLine.appendSwitch('ignore-certificate-errors');

let mainWindow;

app.whenReady().then(() => {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: true,
        },
    });

    mainWindow.loadURL('http://localhost:3000/login');
});
