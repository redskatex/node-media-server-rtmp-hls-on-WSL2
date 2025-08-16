const NodeMediaServer = require('node-media-server');
const express = require('express');
const path = require('path');

const app = express();
const WEB_PORT = process.env.WEB_PORT || 3000;

// Servire file statici nella cartella "public"
app.use(express.static(path.join(__dirname, 'public')));

app.listen(WEB_PORT, () => {
  console.log(`🌐 Pagina web attiva su http://localhost:${WEB_PORT}`);
});

// Configurazione NodeMediaServer
const config = {
  logType: 3,
  http: {
    port: process.env.HTTP_PORT || 8000,
    mediaroot: path.join(__dirname, 'media'),
    allow_origin: '*',
  },
  rtmp: {
    port: process.env.RTMP_PORT || 1935,
    chunk_size: 60000,
    gop_cache: true,
    ping: 30,
    ping_timeout: 60,
    host: '0.0.0.0', 
  },
  trans: {
    ffmpeg: '/usr/bin/ffmpeg',
    tasks: [
      {
        app: 'live',
        hls: true,
        hlsFlags: '[hls_time=2:hls_list_size=3:hls_flags=delete_segments]',
        dash: true,
        dashFlags: '[f=dash:window_size=3:extra_window_size=5]'
      }
    ]
  }
};

const nms = new NodeMediaServer(config);

// Eventi RTMP
nms.on('prePublish', (id, StreamPath, args) => {
  console.log(`🔴 prePublish - id: ${id}, path: ${StreamPath}`);
});

nms.on('postPublish', (id, StreamPath, args) => {
  console.log(`🟢 postPublish - id: ${id}, path: ${StreamPath}`);
});

nms.on('donePublish', (id, StreamPath, args) => {
  console.log(`⚪ donePublish - id: ${id}, path: ${StreamPath}`);
});

// Avvio del server
nms.run();
console.log('🎥 NodeMediaServer in esecuzione...');
