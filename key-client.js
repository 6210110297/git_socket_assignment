var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;
var client = new net.Socket();
    //g=5 p=7 x=4
var g = 5
var p = 7
var x = 4
var r_client = (g**x)%p
var value = 5
var state = 0

client.connect(PORT, HOST, function () {
    console.log('CONNECTED TO: ' + HOST + ':' + PORT);

    client.write('HELLO');
    state = 1
    console.log('wait for HELLO');
});


client.on('data', function (data) {
    switch (state) {
        case 1:
            if (data == 'HELLO') {
                client.write('REQUEST')
                state = 2
                console.log('key sent, wait for variable');
            }
            break
        case 2:
            console.log('begin case 2')
            if (data != 'INVALID') {
                try {
                    let v = parseInt(data)
                    key = (r_client * v) % p
                    client.write("" + r_client)
                    console.log("key = " + key)
                    state = 3
                } catch (e) {
                    client.write('INVALID')
                    console.log('INVALID')
                }
            } else {
                console.log('request for Rserver')
                client.write('KEY')
            }
            break
        case 3:
            if(data == 'RECEIVED' && value <= 7){
                var e_data = value ^ key
                client.write("" + e_data)
                console.log("sent " + e_data)
                value++
            }else{
                client.write('BYE')
                client.destroy()
                state = 4
                console.log('exit')
            }
    }
});

client.on('close', function () {
    console.log('Connection closed');
});
