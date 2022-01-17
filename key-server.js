var net = require('net');
var HOST = '127.0.0.1';
var PORT = 6969;
//g=5 p=7 y=3
var g = 5
var p = 7
var y = 3

net.createServer(function (sock) {
    var state = 0 //idle
    var key = null
    var r_server = (g ** y) % p
    sock.on('data', function (data) {
        switch (state) {
            case 0:
                if (data == 'HELLO') {
                    console.log(r_server)
                    sock.write('HELLO')
                    state = 1 //wait for key
                }
                break
            case 1:
                if (data == 'KEY') {
                    console.log('prepare Rserver')
                    sock.write("" + r_server)
                    console.log('sent Rserver ' + r_server)
                    state = 2 //wait for R_client
                } else {
                    sock.write('INVALID')
                    console.log('wrong method')
                }
                break
            case 2:
                if (data == 'BYE') {
                    sock.destroy()
                    state = 3 //end 
                    console.log('exit')
                }
                else if (data >= 0) {

                    if (key == null) {
                        try {
                            let v = parseInt(data)
                            key = (r_server * v) % p
                            sock.write('RECEIVED')
                            console.log("key = " + key)
                        } catch (e) {
                            sock.write('INVALID')
                            console.log('INVALID')
                        }
                    }
                    else if (key != null) {
                        try {
                            var value = parseInt(data) ^ key
                            sock.write('RECEIVED')
                            console.log("value = " + value)
                        } catch (e) {
                            sock.write('INVALID')
                            console.log('INVALID')
                        }
                    }
                }
                break
        }
    });

}).listen(PORT, HOST);

console.log('Server listening on ' + HOST + ':' + PORT);