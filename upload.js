document.addEventListener("DOMContentLoaded", () => {

  console.log("JS carregado");

  const SUPABASE_URL = "https://rakktbwnybrsvqpbgaid.supabase.co";
  const SUPABASE_KEY = "sb_publishable_tLqbug91hIKbyGJHv4V8kA_HbjCmKiL";

  const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

  const botao = document.getElementById("btnEnviar");

  if (!botao) {
    console.error("Botão não encontrado!");
    return;
  }

  botao.addEventListener("click", async () => {

    console.log("clicou");

    const input = document.getElementById('foto');
    const mensagem = document.getElementById('mensagem');

    if (!input.files.length) {
      alert('Escolha uma foto!');
      return;
    }

    const arquivo = input.files[0];
    const nomeArquivo = Date.now() + "-" + arquivo.name;

    mensagem.innerText = "Enviando...";

    const { error } = await supabaseClient.storage
      .from('fotos-eventos')
      .upload(nomeArquivo, arquivo);

    if (error) {
      mensagem.innerText = "Erro ao enviar!";
      console.error(error);
    } else {
      mensagem.innerText = "Foto enviada com sucesso! 🎉";
    }
  });

});