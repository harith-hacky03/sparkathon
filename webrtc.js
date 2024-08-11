const logElement = document.getElementById('log');
const connectButton = document.getElementById('connect');
const peerIdInput = document.getElementById('peer-id');
const myPeerIdElement = document.getElementById('my-peer-id');

const peer = new Peer();

// Display your own PeerJS ID
peer.on('open', (id) => {
    myPeerIdElement.textContent = id;
    log(`Your Peer ID: ${id}`);
});

// Connect to another peer
connectButton.addEventListener('click', () => {
    const remotePeerId = peerIdInput.value;
    if (remotePeerId) {
        const connection = peer.connect(remotePeerId);
        setupConnection(connection);
    } else {
        log('Please enter a Peer ID to connect to.');
    }
});

// Handle incoming connections
peer.on('connection', (connection) => {
    setupConnection(connection);
});

function setupConnection(connection) {
    connection.on('open', () => {
        log(`Connected to: ${connection.peer}`);

        // Send key press events
        document.addEventListener('keydown', (event) => {
            connection.send({ type: 'keydown', key: event.key });
        });

        // Send scroll events
        window.addEventListener('scroll', () => {
            const scrollPosition = { top: window.scrollY, left: window.scrollX };
            connection.send({ type: 'scroll', position: scrollPosition });
        });

        // Receive events
        connection.on('data', (data) => {
            if (data.type === 'keydown') {
                console.log(`Key pressed: ${data.key}`);
            } else if (data.type === 'scroll') {
                window.scrollTo(data.position.left, data.position.top);
                console.log(`Scrolled to: ${data.position.top}px, ${data.position.left}px`);
            }
        });
    });

    connection.on('error', (err) => {
        log(`Connection error: ${err}`);
    });
}

// Logging function
function log(message) {
    logElement.innerText += `${message}\n`;
}
