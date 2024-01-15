import net from "node:net"

/**
  * @typedef {{name: string, protocol: number}} Version
  * @typedef {{max: number, online: number}} Players
  * @typedef {{text: string}} Description
  * @typedef {{version: Version, players: Players, description: Description}} Status
  */

/**
  * @param value {number}
  * @returns {number[]}
  */
const toVarint = (value) => {
  const res = [];
  while (true) {
    if ((value & 0x80) == 0) {
      res.push(value);
      return res;
    }
    res.push((value & 0x7F) | 0x80);
    value >>>= 7;
  }
}

/**
  * @param ip {string}
  * @param port {number}
  * @param protocol {number}
  * @param callback {(status: Status) => any}
  */
export const statusPing = (ip, port, protocol, callback) => {
  let socket = net.connect({
    host: ip,
    port,
  });

  // handshake
  let packet = [
    0x00, // packet id
    ...toVarint(protocol), // protocol version
    0, // ip (empty string)
    0, 0, // port (none)
    1, // next state
  ];
  let buffer = new Uint8Array([packet.length, ...packet, 1, 0x00]);
  socket.write(buffer);

  socket.on("data", buf => {
    let pos = 0;
    while (buf[pos] != 0x7B) { pos++ };
    const trimmed = buf.subarray(pos);
    callback(JSON.parse(trimmed.toString()));
  });
}
