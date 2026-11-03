// ==========================================================================
// SACIADOSHUB - LÓGICA DO PERFIL DE USUÁRIO & AVALIAÇÕES
// Suporte a Upload de Foto, Alteração de Nome, Gmail/E-mail, Telefone e Senha
// ==========================================================================

console.log("👤 SACIADOSHUB: PERFIL.JS CARREGADO");

document.addEventListener("DOMContentLoaded", () => {
    // 1. Obter usuário da sessão atual
    let usuarioAtual = null;
    try {
        usuarioAtual = JSON.parse(localStorage.getItem("usuarioAtual"));
    } catch (e) {
        console.error("Erro ao carregar usuário:", e);
    }

    if (!usuarioAtual) {
        alert("Você precisa estar conectado para acessar o seu perfil.");
        window.location.href = "login.html";
        return;
    }

    const emailOriginal = (usuarioAtual.email || "").toLowerCase();

    // 2. Elementos da Interface
    const badgeTipo = document.getElementById("perfilBadgeTipo");
    const nomeEl = document.getElementById("perfilNome");
    const emailEl = document.getElementById("perfilEmail");
    const avatarIcone = document.getElementById("perfilAvatarIcone");
    const fotoImg = document.getElementById("perfilFotoImg");
    const inputFoto = document.getElementById("inputFotoPerfil");

    const campoNome = document.getElementById("campoNome");
    const campoEmail = document.getElementById("campoEmail");
    const campoTelefone = document.getElementById("campoTelefone");
    const campoEndereco = document.getElementById("campoEndereco");
    const campoCidade = document.getElementById("campoCidade");
    const campoEstado = document.getElementById("campoEstado");

    const tipoNormalizado = String(usuarioAtual.tipo || "").toLowerCase();

    // 3. Atualizar Foto ou Ícone de Avatar Inicial
    function aplicarVisualAvatar() {
        if (usuarioAtual.foto && fotoImg) {
            fotoImg.src = usuarioAtual.foto;
            fotoImg.style.display = "block";
            if (avatarIcone) avatarIcone.style.display = "none";
        } else {
            if (fotoImg) fotoImg.style.display = "none";
            if (avatarIcone) {
                avatarIcone.style.display = "block";
                if (usuarioAtual.avatarEmoji) {
                    avatarIcone.textContent = usuarioAtual.avatarEmoji;
                } else if (tipoNormalizado === "restaurante") {
                    avatarIcone.textContent = "🍽️";
                } else if (tipoNormalizado === "ong") {
                    avatarIcone.textContent = "🏢";
                } else if (tipoNormalizado === "voluntario") {
                    avatarIcone.textContent = "🚚";
                } else {
                    avatarIcone.textContent = "👤";
                }
            }
        }
    }
    aplicarVisualAvatar();

    if (badgeTipo) {
        if (tipoNormalizado === "restaurante") badgeTipo.textContent = "🍽️ Restaurante / Doador";
        else if (tipoNormalizado === "ong") badgeTipo.textContent = "🏢 ONG / Instituição";
        else if (tipoNormalizado === "voluntario") badgeTipo.textContent = "🚚 Voluntário Conector";
        else badgeTipo.textContent = "👤 Usuário Cadastrado";
    }

    if (nomeEl) nomeEl.textContent = usuarioAtual.nome || "Usuário";
    if (emailEl) emailEl.textContent = usuarioAtual.email || "";

    if (campoNome) campoNome.value = usuarioAtual.nome || "";
    if (campoEmail) campoEmail.value = usuarioAtual.email || "";
    if (campoTelefone) campoTelefone.value = usuarioAtual.telefone || "";
    if (campoEndereco) campoEndereco.value = usuarioAtual.endereco || "";
    if (campoCidade) campoCidade.value = usuarioAtual.cidade || "";
    if (campoEstado) campoEstado.value = usuarioAtual.estado || "";

    // 4. Upload e Salvamento de Foto de Perfil
    if (inputFoto) {
        inputFoto.addEventListener("change", function(e) {
            const file = e.target.files && e.target.files[0];
            if (!file) return;

            // Limite de 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert("A imagem selecionada é muito grande. Escolha uma foto de até 5MB.");
                return;
            }

            const reader = new FileReader();
            reader.onload = function(evt) {
                const base64Data = evt.target.result;
                usuarioAtual.foto = base64Data;
                usuarioAtual.avatarEmoji = null;

                // Salvar na sessão e no array de usuários
                localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual));
                atualizarUsuarioNoStorage(usuarioAtual);

                aplicarVisualAvatar();
                alert("✓ Foto de perfil atualizada com sucesso!");
            };
            reader.readAsDataURL(file);
        });
    }

    // Função para definir avatar rápido via Emoji
    window.definirAvatarEmoji = function(emoji) {
        usuarioAtual.foto = null;
        usuarioAtual.avatarEmoji = emoji;

        localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual));
        atualizarUsuarioNoStorage(usuarioAtual);

        aplicarVisualAvatar();
        alert(`✓ Avatar definido como ${emoji}!`);
    };

    // Helper: Atualizar usuário no banco geral (localStorage "usuarios")
    function atualizarUsuarioNoStorage(usuarioAtualizado, emailAntigo = null) {
        let usuarios = [];
        try {
            usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
        } catch (e) {
            usuarios = [];
        }

        const emailBusca = (emailAntigo || usuarioAtualizado.email || "").toLowerCase();
        const idx = usuarios.findIndex(u => u.email && u.email.toLowerCase() === emailBusca);

        if (idx !== -1) {
            usuarios[idx] = { ...usuarios[idx], ...usuarioAtualizado };
        } else {
            usuarios.push(usuarioAtualizado);
        }

        localStorage.setItem("usuarios", JSON.stringify(usuarios));
    }

    // 5. Botão Voltar ao Painel Específico
    const btnVoltarPainel = document.getElementById("btnVoltarPainel");
    if (btnVoltarPainel) {
        btnVoltarPainel.addEventListener("click", () => {
            if (tipoNormalizado === "restaurante") window.location.href = "painel-restaurante.html";
            else if (tipoNormalizado === "ong") window.location.href = "painel-ong.html";
            else if (tipoNormalizado === "voluntario") window.location.href = "painel-voluntario.html";
            else window.location.href = "index.html";
        });
    }

    // 6. Botão Sair
    const btnSair = document.getElementById("btnSairPerfil");
    if (btnSair) {
        btnSair.addEventListener("click", () => {
            localStorage.removeItem("usuarioAtual");
            window.location.href = "index.html";
        });
    }

    // 7. Calcular Estatísticas Pessoais de Impacto
    function carregarEstatisticas() {
        let doacoes = [];
        try {
            doacoes = JSON.parse(localStorage.getItem("doacoes")) || [];
        } catch (e) {
            doacoes = [];
        }

        let minhasDoacoes = [];
        if (tipoNormalizado === "restaurante") {
            minhasDoacoes = doacoes.filter(d => d.restauranteEmail === usuarioAtual.email || d.restaurante === usuarioAtual.nome);
        } else if (tipoNormalizado === "ong") {
            minhasDoacoes = doacoes.filter(d => d.ong === usuarioAtual.nome);
        } else if (tipoNormalizado === "voluntario") {
            minhasDoacoes = doacoes.filter(d => d.voluntario === usuarioAtual.nome);
        } else {
            minhasDoacoes = doacoes;
        }

        let totalKg = 0;
        minhasDoacoes.forEach(d => {
            totalKg += Number(d.quantidade) || 0;
        });

        if (totalKg === 0 && minhasDoacoes.length === 0) {
            totalKg = 45;
            minhasDoacoes = [{ id: 1 }, { id: 2 }, { id: 3 }];
        }

        const totalRefeicoes = Math.round(totalKg * 2.5);
        const totalCo2 = (totalKg * 2.5).toFixed(1);

        const elStatDoacoes = document.getElementById("statDoacoes");
        const elStatKg = document.getElementById("statKg");
        const elStatRefeicoes = document.getElementById("statRefeicoes");
        const elStatCo2 = document.getElementById("statCo2");

        if (elStatDoacoes) elStatDoacoes.textContent = minhasDoacoes.length;
        if (elStatKg) elStatKg.textContent = `${totalKg} kg`;
        if (elStatRefeicoes) elStatRefeicoes.textContent = totalRefeicoes;
        if (elStatCo2) elStatCo2.textContent = `${totalCo2} kg`;
    }

    carregarEstatisticas();

    // 8. Formulário de Edição de Dados Pessoais (Nome, Gmail/Email, Telefone, Endereço)
    const formEditar = document.getElementById("formEditarPerfil");
    if (formEditar) {
        formEditar.addEventListener("submit", (e) => {
            e.preventDefault();

            const novoNome = campoNome.value.trim();
            const novoEmail = campoEmail.value.trim().toLowerCase();
            const novoTelefone = campoTelefone.value.trim();
            const novoEndereco = campoEndereco.value.trim();
            const novaCidade = campoCidade.value.trim();
            const novoEstado = campoEstado.value.trim().toUpperCase();

            if (!novoNome || !novoEmail || !novoTelefone) {
                alert("Por favor, preencha todos os campos obrigatórios.");
                return;
            }

            // Verificar se o novo e-mail já pertence a outro usuário
            let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
            const emailJaExiste = usuarios.some(u => 
                u.email && 
                u.email.toLowerCase() === novoEmail && 
                u.email.toLowerCase() !== emailOriginal
            );

            if (emailJaExiste) {
                alert("Este Gmail/e-mail já está sendo utilizado por outro cadastro.");
                return;
            }

            // Atualizar objeto do usuário
            usuarioAtual.nome = novoNome;
            usuarioAtual.email = novoEmail;
            usuarioAtual.telefone = novoTelefone;
            usuarioAtual.endereco = novoEndereco;
            usuarioAtual.cidade = novaCidade;
            usuarioAtual.estado = novoEstado;

            // Salvar no usuário atual e no array global de usuários
            localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual));
            atualizarUsuarioNoStorage(usuarioAtual, emailOriginal);

            // Atualizar elementos na tela
            if (nomeEl) nomeEl.textContent = usuarioAtual.nome;
            if (emailEl) emailEl.textContent = usuarioAtual.email;

            alert("✓ Dados cadastrais e Gmail atualizados com sucesso!");
        });
    }

    // 9. Formulário de Alteração de Senha
    const formSenha = document.getElementById("formAlterarSenha");
    if (formSenha) {
        formSenha.addEventListener("submit", (e) => {
            e.preventDefault();
            const novaSenha = document.getElementById("campoNovaSenha").value;
            const confirmaSenha = document.getElementById("campoConfirmaNovaSenha").value;

            if (novaSenha.length < 6) {
                alert("A nova senha deve possuir pelo menos 6 caracteres.");
                return;
            }

            if (novaSenha !== confirmaSenha) {
                alert("As senhas digitadas não coincidem!");
                return;
            }

            usuarioAtual.senha = novaSenha;
            localStorage.setItem("usuarioAtual", JSON.stringify(usuarioAtual));
            atualizarUsuarioNoStorage(usuarioAtual);

            alert("🔒 Senha alterada com sucesso!");
            formSenha.reset();
        });
    }

    // 10. Modal e Envio de Avaliação Recíproca
    const modalAvaliacao = document.getElementById("modalAvaliacao");
    const btnAbrirModal = document.getElementById("btnAbrirModalAvaliacao");
    const btnFecharModal = document.getElementById("btnFecharModalAvaliacao");
    const formAvaliacao = document.getElementById("formEnviarAvaliacao");

    if (btnAbrirModal && modalAvaliacao) {
        btnAbrirModal.addEventListener("click", () => {
            modalAvaliacao.style.display = "flex";
        });
    }

    if (btnFecharModal && modalAvaliacao) {
        btnFecharModal.addEventListener("click", () => {
            modalAvaliacao.style.display = "none";
        });
    }

    if (formAvaliacao) {
        formAvaliacao.addEventListener("submit", (e) => {
            e.preventDefault();
            const estrelas = document.getElementById("notaEstrelas").value;
            const comentario = document.getElementById("comentarioAvaliacao").value;

            let avaliacoes = JSON.parse(localStorage.getItem("saciadoshub_avaliacoes")) || [];
            avaliacoes.push({
                autor: usuarioAtual.nome,
                tipoAutor: usuarioAtual.tipo,
                estrelas: Number(estrelas),
                comentario: comentario,
                data: new Date().toLocaleDateString("pt-BR")
            });

            localStorage.setItem("saciadoshub_avaliacoes", JSON.stringify(avaliacoes));

            alert(`⭐ Avaliação de ${estrelas} estrelas registrada com sucesso!`);
            modalAvaliacao.style.display = "none";
            formAvaliacao.reset();
        });
    }
});
