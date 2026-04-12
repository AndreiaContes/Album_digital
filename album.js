// Captura os parâmetros da URL
const urlParams = new URLSearchParams(window.location.search);

// Pega o valor do evento
const evento = urlParams.get("evento");

// Define um padrão caso não exista
const eventoAtual = evento || "evento-teste";

// Teste no console
console.log("Evento atual:", eventoAtual);

//////////////////////////////
// EVENTO (MULTI-EVENTO)
//////////////////////////////
const params = new URLSearchParams(window.location.search);
const evento = params.get("evento") || "default";

//////////////////////////////
// CONFIGURAÇÃO SUPABASE
//////////////////////////////
const SUPABASE_URL = "https://rakktbwnybrsvqpbgaid.supabase.co";
const SUPABASE_KEY = "sb_publishable_tLqbug91hIKbyGJHv4V8kA_HbjCmKiL";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

//////////////////////////////
// ELEMENTOS DOM
//////////////////////////////
const albumGrid = document.getElementById('albumGrid'); 
const zoomOverlay = document.getElementById('zoomOverlay');
const zoomedImage = document.getElementById('zoomedImage');
const closeZoom = document.getElementById('closeZoom');

//////////////////////////////
// FUNÇÕES DE ZOOM
//////////////////////////////
if (closeZoom) {
  closeZoom.addEventListener('click', () => {
    zoomOverlay.style.display = 'none';
  });
}

function openZoom(src) {
  zoomedImage.src = src;
  zoomOverlay.style.display = 'flex';
}

//////////////////////////////
// FUNÇÃO ADICIONAR FOTO
//////////////////////////////
function addPhotoToAlbum(photoSrc, isNew = false) {
  if (!albumGrid) return;

  const wrapper = document.createElement('div');
  wrapper.classList.add('photo-wrapper');

  // Imagem
  const img = document.createElement('img');
  img.src = photoSrc;
  img.alt = "Foto enviada";
  img.addEventListener('click', () => openZoom(photoSrc));

  wrapper.appendChild(img);

  // 🔥 Botão excluir APENAS para foto recém enviada
  if (isNew) {
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Excluir";
    deleteBtn.onclick = () => wrapper.remove();

    wrapper.appendChild(deleteBtn);
  }

  albumGrid.appendChild(wrapper);
}

//////////////////////////////
// 🔥 CARREGAR FOTOS DO STORAGE (COM FILTRO)
//////////////////////////////
async function carregarFotosAlbum() {
  const { data, error } = await supabaseClient.storage
    .from('fotos-eventos')
    .list();

  if (error) {
    console.error("Erro ao carregar fotos:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("Nenhuma foto encontrada no álbum.");
    return;
  }

  albumGrid.innerHTML = "";

  data.forEach(file => {
    if (!file.name) return;

    // 🔥 FILTRO POR EVENTO (ESSA É A CORREÇÃO PRINCIPAL)
    if (!file.name.startsWith(evento)) return;

    const { data: publicUrl } = supabaseClient.storage
      .from('fotos-eventos')
      .getPublicUrl(file.name);

    addPhotoToAlbum(publicUrl.publicUrl, false);
  });

  console.log("Fotos carregadas do evento:", evento);
}

//////////////////////////////
// FUNÇÃO DE UPLOAD LOCAL (preview)
//////////////////////////////
function handleUpload(file) {
  const reader = new FileReader();
  reader.onload = (e) => {
    addPhotoToAlbum(e.target.result, true);
  };
  reader.readAsDataURL(file);
}

//////////////////////////////
// TESTE LOCAL (VSCode)
//////////////////////////////
if (
  window.location.protocol === 'file:' ||
  window.location.hostname === 'localhost' ||
  window.location.hostname === '127.0.0.1'
) {
  addPhotoToAlbum('teste-fotos/foto1.png', true);
  addPhotoToAlbum('teste-fotos/foto2.png', true);
}

//////////////////////////////
// 🚀 INICIALIZAÇÃO
//////////////////////////////
carregarFotosAlbum();
