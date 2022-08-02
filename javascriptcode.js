let port;

async function connect() {

    try {
        port = await navigator.serial.requestPort();
        var config = {baudRate: 9600};
        await port.open(config);
        document.getElementById('PortStatus').value = "Connected";

        while (port.readable) {
            const reader = port.readable.getReader();
            try {
                while (true) {
                    const {value, done} = await reader.read();
                    if (done) {
                        add_message("Canceled");
                        break;
                    }
                    const inputValue = new TextDecoder().decode(value);
                    add_message(inputValue);
                }
            } catch (error) {
                add_message("[Error] Read" + error);
            } finally {
                reader.releaseLock();
            }
        }
    } catch (error) {
        add_message("[Error]Open" + error);
    }
}

function add_message(message) {
    let monitor = document.getElementById('monitor');
    monitor.value += ">> " + message + " \n";
    monitor.schrollTop = monitor.scrollHeight;
}

async function send(command) {

    const encoder = new TextEncoder();

    if (port) {
        const writer = port.writable.getWriter();
        await writer.write(encoder.encode(command + "\n"));
        writer.releaseLock();
        add_message("[Success] " + "تم الارسال  ");
    } else
        add_message("[Error] " + "لم يتم الارسال ؟ المنفذ غير متصل ");

}

function runSpeechRecognition() {

    // new speech recognition object
    var SpeechRecognition = SpeechRecognition || window.webkitSpeechRecognition || false;

    const choice = ['يمين', 'يسار'];


    if (SpeechRecognition) {
        var recognition = new SpeechRecognition();
        recognition.lang = 'ar-SA';

        recognition.continuous = false;

        // This runs when the speech recognition service starts
        recognition.onstart = function () {

            add_message("listen to you ... ? ");

        };
        // This runs when the speech recognition no match
        recognition.onnomatch = function (event) {
            add_message("[Error]: no match .");

        };
        recognition.onspeechend = function () {
            recognition.stop();
        };
        // This runs when the speech recognition get error as connection faild
        recognition.onerror = function (event) {

            add_message("[Error]: " + event.error);


        };
        // This runs when the speech recognition service returns result
        recognition.onresult = function (event) {
            let command = event.results[0][0].transcript;

            if (command.indexOf(choice[0]) > -1)
            {
                add_message("command is يمين");
                send("1");
                
            } else if (command.indexOf(choice[1]) > -1)
            {
                add_message("command is يسار ");
                send("0");

            } else
                add_message("[Error]: لم يتم التعرف على الامر .");


        };

        // start recognition
        recognition.start();

        // stop recognition
    } else {
        add_message("[Error]: This browser does not support SpeechRecognition or webkitSpeechRecognition. ");
    }
}

navigator.serial.addEventListener("connect", (event) => {
    // TODO: Automatically open event.target or warn user a port is available.
    add_message(">> " + "port is connected");
    document.getElementById('PortStatus').value = "Connected";
});

navigator.serial.addEventListener("disconnect", (event) => {
    // TODO: Remove |event.target| from the UI.
    // If the serial port was opened, a stream error would be observed as well.
    add_message(">> " + "port is disconnect");
    document.getElementById('PortStatus').value = "Not connected";
});
