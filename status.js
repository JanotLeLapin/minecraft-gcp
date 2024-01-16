import net from "node:net"

/**
  * @typedef {{name: string, protocol: number}} Version
  * @typedef {{max: number, online: number}} Players
  * @typedef {{text: string, extra?: TextComponent[]}} TextComponent
  * @typedef {{version: Version, players: Players, description: Description}} Status
  */

class Socket {
  /**
    * @param host {string}
    * @param port {number}
    */
  constructor (host, port) {
    this._host = host;
    this._port = port;
  }

  /**
    * @param {number} timeout 
    * @returns {Promise<any, any>}
    */
  async connect(timeout) {
    /**
      * @type {net.Socket}
      * @private
      */
    this._socket = net.connect({
      host: this._host,
      port: this._port,
    });
    return new Promise((resolve, reject) => {
      /**
        * @type {number[]}
        * @private
        */
      this._socket.on("connect", resolve);
      this._socket.setTimeout(timeout, () => reject(new Error("timeout")));
    });
  }

  /**
    * @returns {Promise<Buffer, any>}
    */
  async read() {
    return new Promise((resolve, _) => {
      this._socket.on("data", resolve);
    })
  }

  /**
    * @param data {number[]}
    */
  async write(data) {
    this._socket.write(new Uint8Array(data));
  }
}

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
  * @returns {Promise<Status>}
  */
export const statusPing = async (ip, port, protocol) => {
  const socket = new Socket(ip, port);
  await socket.connect(3000);
  let packet = [
    0x00, // packet id
    ...toVarint(protocol), // protocol version
    0, // ip (empty string)
    0, 0, // port (none)
    1, // next state
  ];
  await socket.write([packet.length, ...packet, 1, 0x00]);

  const buffer = await socket.read();
  let pos = 0;
  while (buffer[pos] != 0x7B) { pos++ };
  const trimmed = buffer.subarray(pos);
  console.log(JSON.parse(trimmed.toString()));
  return JSON.parse(trimmed.toString());
}

/**
  * @param comp {TextComponent}
  * @returns {string}
  */
export const displayComponent = (comp) => comp.text || comp.extra.map(c => c.text).join("\n")
