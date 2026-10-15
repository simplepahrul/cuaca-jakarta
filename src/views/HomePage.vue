<template>
  <ion-page>
    <ion-content :fullscreen="true" ref="konten">
      <!-- kumpulan ikon, dipakai ulang lewat <use> -->
      <svg class="defs" aria-hidden="true">
        <defs>
          <symbol id="i-sun" viewBox="0 0 48 48">
            <g stroke="#111" stroke-width="3" stroke-linecap="square">
              <line x1="38" y1="24" x2="45" y2="24" />
              <line x1="33.9" y1="33.9" x2="38.8" y2="38.8" />
              <line x1="24" y1="38" x2="24" y2="45" />
              <line x1="14.1" y1="33.9" x2="9.2" y2="38.8" />
              <line x1="10" y1="24" x2="3" y2="24" />
              <line x1="14.1" y1="14.1" x2="9.2" y2="9.2" />
              <line x1="24" y1="10" x2="24" y2="3" />
              <line x1="33.9" y1="14.1" x2="38.8" y2="9.2" />
            </g>
            <circle cx="24" cy="24" r="9" fill="#ffd23f" stroke="#111" stroke-width="3" />
          </symbol>
          <symbol id="i-cloud" viewBox="0 0 48 48">
            <path
              d="M13 37 a8 8 0 0 1 -1 -15.9 a11 11 0 0 1 21 -2.6 a8.5 8.5 0 0 1 2 18.5 z"
              fill="#fff" stroke="#111" stroke-width="3" stroke-linejoin="round"
            />
          </symbol>
          <symbol id="i-part" viewBox="0 0 48 48">
            <circle cx="33" cy="15" r="8" fill="#ffd23f" stroke="#111" stroke-width="3" />
            <g transform="translate(-3 7) scale(0.85)">
              <path
                d="M13 37 a8 8 0 0 1 -1 -15.9 a11 11 0 0 1 21 -2.6 a8.5 8.5 0 0 1 2 18.5 z"
                fill="#fff" stroke="#111" stroke-width="3.4" stroke-linejoin="round"
              />
            </g>
          </symbol>
          <symbol id="i-rain" viewBox="0 0 48 48">
            <g transform="translate(0 -6)">
              <path
                d="M13 37 a8 8 0 0 1 -1 -15.9 a11 11 0 0 1 21 -2.6 a8.5 8.5 0 0 1 2 18.5 z"
                fill="#fff" stroke="#111" stroke-width="3" stroke-linejoin="round"
              />
            </g>
            <g stroke="#2f7fe0" stroke-width="3.5" stroke-linecap="round">
              <line x1="16" y1="35" x2="13" y2="43" />
              <line x1="25" y1="35" x2="22" y2="43" />
              <line x1="34" y1="35" x2="31" y2="43" />
            </g>
          </symbol>
          <symbol id="i-storm" viewBox="0 0 48 48">
            <g transform="translate(0 -6)">
              <path
                d="M13 37 a8 8 0 0 1 -1 -15.9 a11 11 0 0 1 21 -2.6 a8.5 8.5 0 0 1 2 18.5 z"
                fill="#bdbdbd" stroke="#111" stroke-width="3" stroke-linejoin="round"
              />
            </g>
            <polygon
              points="27,27 18,39 24,39 21,48 34,34 28,34 32,27"
              fill="#ffd23f" stroke="#111" stroke-width="2.5" stroke-linejoin="round"
            />
          </symbol>
        </defs>
      </svg>

      <main class="halaman">
        <header class="kepala">
          <svg class="hias matahari"><use href="#i-sun" /></svg>
          <svg class="hias awan"><use href="#i-cloud" /></svg>

          <span class="stiker">JAKARTA, ID</span>
          <h1>Suhu<br />per Jam</h1>
          <p class="sub">Prakiraan dari Open-Meteo</p>
        </header>

        <p v-if="pesanError" class="error">{{ pesanError }}</p>

        <!-- tampilan awal sebelum data diambil -->
        <div v-if="!daftarCuaca.length && !pesanError" class="kosong">
          <svg class="ikon besar"><use href="#i-cloud" /></svg>
          <p>Belum ada data.<br />Tekan tombol di bawah untuk mulai.</p>
        </div>

        <section v-if="daftarCuaca.length">
          <div class="ringkas">
            <div class="kotak dingin">
              <span>Terendah</span>
              <strong>{{ suhuMin }}°C</strong>
            </div>
            <div class="kotak panas">
              <span>Tertinggi</span>
              <strong>{{ suhuMax }}°C</strong>
            </div>
          </div>

          <p class="label-daftar">
            Data {{ awal + 1 }} sampai {{ akhir }} dari {{ daftarCuaca.length }}
          </p>

          <ul class="daftar">
            <li
              v-for="(item, i) in daftarTampil"
              :key="item.tanggal + item.jam"
              class="kartu"
              :id="item.idx === idxSekarang ? 'kartu-sekarang' : undefined"
              :class="{ sekarang: item.idx === idxSekarang }"
              :style="{ animationDelay: i * 70 + 'ms' }"
            >
              <div class="lencana">
                <svg class="ikon"><use :href="ikon(item.kode)" /></svg>
              </div>
              <div class="waktu">
                <strong>{{ item.jam }} <small>WIB</small></strong>
                <span>{{ kondisi(item.kode) }} · {{ item.tanggal }}</span>
                <em v-if="item.idx === idxSekarang" class="badge">SEKARANG</em>
              </div>
              <div class="suhu">{{ item.suhu }}<small>°C</small></div>
            </li>
          </ul>
        </section>
      </main>
    </ion-content>

    <!-- tombol di bawah supaya mudah dijangkau jempol -->
    <ion-footer class="ion-no-border">
      <div class="bar">
        <div v-if="daftarCuaca.length" class="nav">
          <button class="tombol-kecil" @click="ganti(-1)" :disabled="halaman === 0">
            ← PREV
          </button>
          <span class="info">{{ halaman + 1 }} / {{ totalHalaman }}</span>
          <button
            class="tombol-kecil"
            @click="ganti(1)"
            :disabled="halaman >= totalHalaman - 1"
          >
            NEXT →
          </button>
        </div>
        <button class="tombol" @click="muatData" :disabled="sedangMuat">
          {{ sedangMuat ? 'MEMUAT...' : 'AMBIL DATA' }}
        </button>
      </div>
    </ion-footer>
  </ion-page>
</template>

<script lang="ts">
import { IonContent, IonFooter, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';
import AmbilCuaca from '@/services/AmbilCuaca';

const URL_CUACA =
  'https://api.open-meteo.com/v1/forecast?latitude=-6.2&longitude=106.8&hourly=temperature_2m,weather_code';

export default defineComponent({
  name: 'HomePage',
  components: { IonContent, IonFooter, IonPage },
  data() {
    return {
      daftarCuaca: [] as Array<{ tanggal: string; jam: string; suhu: number; kode: number; ts: number }>,
      idxSekarang: -1,
      halaman: 0,
      perHalaman: 10,
      sedangMuat: false,
      pesanError: ''
    };
  },
  computed: {
    totalHalaman(): number {
      return Math.ceil(this.daftarCuaca.length / this.perHalaman);
    },
    awal(): number {
      return this.halaman * this.perHalaman;
    },
    akhir(): number {
      return Math.min(this.awal + this.perHalaman, this.daftarCuaca.length);
    },
    // data yang tampil di halaman ini (10 per halaman)
    daftarTampil(): Array<{ tanggal: string; jam: string; suhu: number; kode: number; ts: number; idx: number }> {
      return this.daftarCuaca
        .slice(this.awal, this.akhir)
        .map((d, i) => ({ ...d, idx: this.awal + i }));
    },
    suhuMin(): number {
      return Math.min(...this.daftarCuaca.map((d) => d.suhu));
    },
    suhuMax(): number {
      return Math.max(...this.daftarCuaca.map((d) => d.suhu));
    }
  },
  methods: {
    // pilih ikon berdasarkan kode cuaca (standar WMO dari Open-Meteo)
    ikon(kode: number): string {
      if (kode === 0) return '#i-sun';
      if (kode <= 2) return '#i-part';
      if (kode >= 95) return '#i-storm';
      if ((kode >= 51 && kode <= 67) || (kode >= 80 && kode <= 82)) return '#i-rain';
      return '#i-cloud';
    },
    kondisi(kode: number): string {
      if (kode === 0) return 'Cerah';
      if (kode <= 2) return 'Cerah berawan';
      if (kode >= 95) return 'Petir';
      if ((kode >= 51 && kode <= 67) || (kode >= 80 && kode <= 82)) return 'Hujan';
      return 'Berawan';
    },
    ganti(arah: number) {
      this.halaman += arah;
      this.$nextTick(() => {
        const konten = (this.$refs.konten as any)?.$el;
        if (konten && konten.scrollToTop) konten.scrollToTop(300);
      });
    },
    async muatData() {
      this.sedangMuat = true;
      this.pesanError = '';
      try {
        const layanan = new AmbilCuaca(URL_CUACA);
        const res = await layanan.getData();
        const waktu: string[] = res.data.hourly.time;
        const suhu: number[] = res.data.hourly.temperature_2m;
        const kode: number[] = res.data.hourly.weather_code;

        this.daftarCuaca = waktu.map((w, i) => {
          // data API dalam GMT, ditambah 7 jam supaya jadi WIB
          const ts = Date.parse(w + ':00Z');
          const wib = new Date(ts + 7 * 3600 * 1000).toISOString();
          return { tanggal: wib.slice(0, 10), jam: wib.slice(11, 16), suhu: suhu[i], kode: kode[i], ts };
        });

        // cari data jam sekarang (data terakhir yang waktunya sudah lewat)
        const sekarang = Date.now();
        this.idxSekarang = this.daftarCuaca.reduce(
          (a, d, i) => (d.ts <= sekarang ? i : a),
          -1
        );

        // buka halaman yang berisi data jam sekarang
        this.halaman = Math.floor(Math.max(this.idxSekarang, 0) / this.perHalaman);
        this.$nextTick(() => {
          document
            .getElementById('kartu-sekarang')
            ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
      } catch (e) {
        this.pesanError = 'Data gagal diambil, coba cek koneksi internet.';
      } finally {
        this.sedangMuat = false;
      }
    }
  }
});
</script>

<style scoped>
ion-content {
  --background: #f4ecd8;
}

.defs {
  position: absolute;
  width: 0;
  height: 0;
}

.halaman {
  max-width: 600px;
  margin: 0 auto;
  padding: calc(var(--ion-safe-area-top, 0px) + 20px) 16px 24px;
  font-family: 'Courier New', ui-monospace, monospace;
  color: #111;
}

/* header */
.kepala {
  position: relative;
  margin-bottom: 22px;
}

.hias {
  position: absolute;
  pointer-events: none;
}

.matahari {
  width: 84px;
  height: 84px;
  top: -6px;
  right: 4px;
  animation: putar 24s linear infinite;
}

.awan {
  width: 70px;
  height: 70px;
  top: 52px;
  right: 56px;
  animation: melayang 4s ease-in-out infinite;
}

.stiker {
  display: inline-block;
  background: #111;
  color: #ffd23f;
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 2px;
  padding: 4px 10px;
  transform: rotate(-2deg);
}

h1 {
  font-size: 44px;
  line-height: 1;
  margin: 14px 0 8px;
  text-transform: uppercase;
  font-weight: 900;
}

.sub {
  margin: 0;
  font-size: 14px;
}

/* keadaan kosong dan error */
.kosong {
  border: 3px dashed #111;
  padding: 28px 16px;
  text-align: center;
  background: #fff;
  animation: muncul 0.4s ease-out both;
}

.kosong p {
  margin: 10px 0 0;
  font-size: 14px;
  line-height: 1.5;
}

.error {
  background: #ff6b6b;
  border: 3px solid #111;
  padding: 10px;
  font-weight: 700;
}

/* ringkasan */
.ringkas {
  display: flex;
  gap: 12px;
  margin-bottom: 22px;
}

.kotak {
  flex: 1;
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  padding: 10px 12px;
  animation: muncul 0.4s ease-out both;
}

.kotak span {
  display: block;
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.kotak strong {
  font-size: 24px;
  font-weight: 900;
}

.dingin {
  background: #7ae7c7;
}

.panas {
  background: #ff6b6b;
  animation-delay: 0.1s;
}

.label-daftar {
  margin: 0 0 12px;
  font-size: 12px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
}

/* daftar kartu */
.daftar {
  list-style: none;
  margin: 0;
  padding: 0;
}

.kartu {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border: 3px solid #111;
  box-shadow: 4px 4px 0 #111;
  padding: 10px 12px;
  margin-bottom: 14px;
  animation: muncul 0.35s ease-out both;
}

.kartu.sekarang {
  background: #ffd23f;
}

.badge {
  display: inline-block;
  margin-top: 4px;
  padding: 1px 6px;
  background: #111;
  color: #ffd23f;
  font-size: 10px;
  font-style: normal;
  font-weight: 700;
  letter-spacing: 1px;
}

.lencana {
  flex: none;
  width: 52px;
  height: 52px;
  border: 3px solid #111;
  background: #f4ecd8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ikon {
  width: 36px;
  height: 36px;
  display: block;
}

.ikon.besar {
  width: 64px;
  height: 64px;
  margin: 0 auto;
}

.waktu {
  flex: 1;
  min-width: 0;
}

.waktu strong {
  display: block;
  font-size: 20px;
  font-weight: 900;
}

.waktu strong small {
  font-size: 11px;
  font-weight: 700;
}

.waktu span {
  font-size: 11px;
}

.suhu {
  font-size: 30px;
  font-weight: 900;
}

.suhu small {
  font-size: 14px;
  margin-left: 2px;
}

/* tombol bawah */
.bar {
  background: #f4ecd8;
  border-top: 3px solid #111;
  padding: 12px 16px calc(var(--ion-safe-area-bottom, 0px) + 12px);
}

.tombol {
  display: block;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  height: 56px;
  background: #ffd23f;
  color: #111;
  border: 3px solid #111;
  box-shadow: 5px 5px 0 #111;
  font-family: 'Courier New', ui-monospace, monospace;
  font-size: 18px;
  font-weight: 900;
  letter-spacing: 1px;
  cursor: pointer;
  transition: transform 0.08s, box-shadow 0.08s;
}

.tombol:active:not(:disabled) {
  transform: translate(4px, 4px);
  box-shadow: 1px 1px 0 #111;
}

.tombol:disabled {
  background: #ddd;
  cursor: wait;
}

/* navigasi halaman */
.nav {
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 600px;
  margin: 0 auto 12px;
}

.tombol-kecil {
  flex: 1;
  height: 44px;
  background: #7ae7c7;
  color: #111;
  border: 3px solid #111;
  box-shadow: 3px 3px 0 #111;
  font-family: 'Courier New', ui-monospace, monospace;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  transition: transform 0.08s, box-shadow 0.08s;
}

.tombol-kecil:active:not(:disabled) {
  transform: translate(3px, 3px);
  box-shadow: 0 0 0 #111;
}

.tombol-kecil:disabled {
  background: #ddd;
  color: #888;
  border-color: #888;
  box-shadow: 3px 3px 0 #888;
  cursor: not-allowed;
}

.info {
  flex: none;
  min-width: 64px;
  text-align: center;
  font-weight: 900;
}

/* animasi */
@keyframes putar {
  to {
    transform: rotate(360deg);
  }
}

@keyframes melayang {
  0%,
  100% {
    transform: translate(0, 0);
  }
  50% {
    transform: translate(-8px, -6px);
  }
}

@keyframes muncul {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>