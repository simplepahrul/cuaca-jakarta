import axios from 'axios';

export default class AmbilCuaca {
  alamat: string;

  constructor(alamat: string) {
    this.alamat = alamat;
  }

  async getData() {
    const hasil = await axios.get(this.alamat);
    return hasil;
  }
}
