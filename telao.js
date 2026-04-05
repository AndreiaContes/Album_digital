const SUPABASE_URL = "https://rakktbwnybrsvqpbgaid.supabase.co";
const SUPABASE_KEY = "sb_publishable_tLqbug91hIKbyGJHv4V8kA_HbjCmKiL";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

let fotos = [];
let index = 0;

// 🔄 Carrega fotos do Supabase
async function carregarFotos() {
  const { data, error } = await supabaseClient.storage
    .from('fotos-eventos')
    .list('', { limit: 100 });

  if (error) {
    console.error("Erro ao carregar fotos:", error);
    return;
  }

  fotos = data.map(file => {
    const { data: publicUrl } = supabaseClient.storage
      .from('fotos-eventos')
      .getPublicUrl(file.name);

    return publicUrl.publicUrl;
  });
}

// 🎬 Mostra foto com efeito
function mostrarFoto() {
  if (fotos.length === 0) return;

  const img = document.getElementById("fotoTelao");

  // Remove efeito
  img.classList.remove("ativa");

  setTimeout(() => {
    img.src = fotos[index];

    // Aplica efeito
    img.classList.add("ativa");

    index = (index + 1) % fotos.length;
  }, 500);
}

// 🚀 Inicialização
async function iniciar() {
  await carregarFotos();

  // Atualiza lista de fotos (novas fotos entrando)
  setInterval(async () => {
    await carregarFotos();
  }, 10000);

  // Troca de imagens com efeito
  setInterval(mostrarFoto, 5000);
}

iniciar();