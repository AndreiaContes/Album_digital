const SUPABASE_URL = "https://rakktbwnybrsvqpbgaid.supabase.co";
const SUPABASE_KEY = "sb_publishable_tLqbug91hIKbyGJHv4V8kA_HbjCmKiL";

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

async function carregarFotos() {
  const { data, error } = await supabaseClient.storage
    .from('fotos-eventos')
    .list('', { limit: 100 });

  console.log("RESULTADO:", data);
  console.log("ERRO:", error);

  const galeria = document.getElementById('galeria');
  galeria.innerHTML = "";

  if (error) {
    alert("Erro ao buscar fotos!");
    console.error(error);
    return;
  }

  if (!data || data.length === 0) {
    alert("Nenhuma foto encontrada!");
    return;
  }

  data.forEach(file => {
    const { data: publicUrl } = supabaseClient.storage
      .from('fotos-eventos')
      .getPublicUrl(file.name);

    const img = document.createElement("img");
    img.src = publicUrl.publicUrl;

    galeria.appendChild(img);
  });
}

carregarFotos();
setInterval(carregarFotos, 5000);