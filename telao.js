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

let fotos = [];
let index = 0;

//////////////////////////////
// 🔄 CARREGAR FOTOS (COM FILTRO)
//////////////////////////////
async function carregarFotos() {
  const { data, error } = await supabaseClient.storage
    .from('fotos-eventos')
    .list();

  if (error) {
    console.error("Erro ao carregar fotos:", error);
    return;
  }

  if (!data || data.length === 0) {
    console.log("Nenhuma foto encontrada no telão.");
    return;
  }

  fotos = data
    // 🔥 IGNORA arquivos inválidos
    .filter(file => file.name && !file.name.startsWith('.'))
    
    // 🔥 FILTRO POR EVENTO (ESSA É A CHAVE)
    .filter(file => file.name.startsWith(evento))
    
    // 🔥 CONVERTE PARA URL
    .map(file => {
      const { data } = supabaseClient.storage
        .from('fotos-eventos')
        .getPublicUrl(file.name);

      return data.publicUrl;
    });

  console.log("Fotos do telão (evento:", evento, "):", fotos);
}

//////////////////////////////
// 🎬 MOSTRAR FOTO
//////////////////////////////
function mostrarFoto() {
  if (fotos.length === 0) return;

  const img = document.getElementById("fotoTelao");
  if (!img) return;

  img.classList.remove("ativa");

  setTimeout(() => {
    img.src = fotos[index];
    img.classList.add("ativa");

    index = (index + 1) % fotos.length;
  }, 300);
}

//////////////////////////////
// 🚀 INICIAR
//////////////////////////////
async function iniciar() {
  await carregarFotos();

  if (fotos.length > 0) {
    mostrarFoto();
  }

  // 🔄 Atualiza fotos novas
  setInterval(async () => {
    await carregarFotos();
  }, 10000);

  // 🎬 Troca automática
  setInterval(() => {
    if (fotos.length > 0) {
      mostrarFoto();
    }
  }, 5000);
}

iniciar();
