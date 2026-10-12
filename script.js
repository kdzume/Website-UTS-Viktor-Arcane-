// ========== 0. TEMPAT FOTO ==========
function pasangFoto(kotak) {
  kotak.innerHTML = '<span>' + kotak.dataset.file + '</span>';
  const gambar = new Image();
  gambar.alt = kotak.dataset.alt || '';
  gambar.onload = () => kotak.appendChild(gambar);   // hanya dipasang jika berhasil dimuat
  gambar.src = 'assets/images/' + kotak.dataset.file;
}
document.querySelectorAll('.gambar[data-file]').forEach(pasangFoto);

// ========== 1. NAVIGASI HALAMAN ==========
const halaman = document.querySelectorAll('.halaman');
const menu = document.querySelectorAll('nav a');
let nomor = 0;           // halaman yang sedang tampil (0 sampai 5)
let sudahSetuju = false; // sudah klik setuju spoiler?

function tampil(n) {
  if (n < 0 || n > 5) return;
  halaman.forEach(h => h.classList.remove('aktif'));
  menu.forEach(m => m.classList.remove('aktif'));
  halaman[n].classList.add('aktif');
  menu[n].classList.add('aktif');
  nomor = n;

  // kunci scroll hanya di halaman 1
  document.documentElement.classList.toggle('tanpa-scroll', n === 0);
  document.body.classList.toggle('tanpa-scroll', n === 0);

  document.getElementById('progres').style.width = ((n + 1) / 6 * 100) + '%';
  document.getElementById('spoiler').classList.toggle('sembunyi', sudahSetuju);
  window.scrollTo(0, 0);
}

menu.forEach(m => m.onclick = e => { e.preventDefault(); tampil(Number(m.dataset.n)); });
document.getElementById('mulai').onclick = () => tampil(1);
document.getElementById('awal').onclick = () => tampil(0);
document.getElementById('setuju').onclick = () => {
  sudahSetuju = true;
  document.getElementById('spoiler').classList.add('sembunyi');
};

// ========== 2. PILIHAN MORAL ==========
const jawaban = document.getElementById('jawaban');
document.getElementById('embrace').onclick = () => {
  jawaban.textContent = 'You chose evolution. Picture a world without unnecessary pain, where no one is held back by a failing body. But ask who decides what counts as "unnecessary", and what is lost when no one is allowed to struggle, doubt, or fail.';
};
document.getElementById('human').onclick = () => {
  jawaban.textContent = 'You chose to remain human. Imperfection and the freedom to choose your own path are what make a life yours. But does holding on to what is familiar also mean letting others keep suffering?';
};

// ========== 3. KUTIPAN ==========
// Cek ulang kata-katanya dan episodenya saat menonton serialnya.
const kutipan = [
  { teks: 'You need not suffer anymore.', info: 'Viktor, Arcane S2E2', jenis: 'asli' },
  { teks: 'In the pursuit of great, we failed to do good.', info: 'Viktor, Arcane Season 1', jenis: 'asli' },
  { teks: "When you're going to change the world, you don't ask for permission.", info: 'Viktor, Arcane S1E2', jenis: 'asli' },
  { teks: 'Evolution has a destination.', info: 'Viktor, Arcane Season 2', jenis: 'asli' },
  { teks: 'In all timelines, in all possibilities, only you can show me this.', info: 'Viktor, Arcane S2E9', jenis: 'asli' }
];

const daftar = document.getElementById('daftar');
kutipan.forEach(k => {
  const kartu = document.createElement('div');
  kartu.className = 'kartu';
  kartu.innerHTML = '<p>' + k.teks + '</p><small>' + k.info + '</small><br>';
  const tombol = document.createElement('button');
  tombol.textContent = 'COPY QUOTE';
  tombol.onclick = () => {
    navigator.clipboard.writeText(k.teks);
    tombol.textContent = 'COPIED!';
    setTimeout(() => tombol.textContent = 'COPY QUOTE', 1500);
  };
  kartu.appendChild(tombol);
  daftar.appendChild(kartu);
});

// ========== 4. PEMUTAR MUSIK ==========
const lagu = document.getElementById('lagu');
const play = document.getElementById('play');
const status = document.getElementById('status');

play.onclick = () => {
  if (lagu.paused) lagu.play(); else lagu.pause();
};
lagu.onplay  = () => { play.textContent = 'PAUSE'; status.textContent = 'Now playing...'; };
lagu.onpause = () => { play.textContent = 'PLAY';  status.textContent = 'Paused'; };
// Pesan ini hanya muncul kalau file lagu GAGAL dimuat
lagu.onerror = () => { status.textContent = 'Audio file not found at assets/audio/lagu.mp3'; };
lagu.ontimeupdate = () => {
  document.getElementById('progresLagu').value = (lagu.currentTime / lagu.duration) * 100 || 0;
};
document.getElementById('progresLagu').oninput = e => {
  lagu.currentTime = (e.target.value / 100) * lagu.duration;
};
document.getElementById('volume').oninput = e => { lagu.volume = e.target.value; };

// ========== 5. MEME (hanya ditampilkan, tanpa upload) ==========
const memes = [
  { file: 'viktor-meme.jpg', caption: '"I solved human suffering. Mostly."' },
  { file: 'meme-1.jpg', caption: 'No need to question ain\'t it?' },
  { file: 'meme-2.jpg', caption: 'ZZZ..' },
  { file: 'meme-3.jpg', caption: 'Kei rn fr...' }
];
let m = 0;   // meme yang sedang tampil

function tampilMeme(i) {
  m = i;
  const besar = document.getElementById('meme');
  besar.dataset.file = memes[i].file;
  besar.dataset.alt = memes[i].caption;
  pasangFoto(besar);
  document.getElementById('caption').textContent = memes[i].caption;
}

// Galeri kecil dari daftar memes; klik salah satu untuk memperbesar
const galeri = document.getElementById('galeri');
memes.forEach((item, i) => {
  const kecil = document.createElement('div');
  kecil.className = 'gambar';
  kecil.dataset.file = item.file;
  kecil.dataset.alt = item.caption;
  kecil.tabIndex = 0;
  kecil.onclick = () => tampilMeme(i);
  kecil.onkeydown = e => { if (e.key === 'Enter') tampilMeme(i); };
  pasangFoto(kecil);
  galeri.appendChild(kecil);
});

document.getElementById('ganti').onclick = () => tampilMeme((m + 1) % memes.length);

// ========== MULAI ==========
tampilMeme(0);
tampil(0);