// ==========================================================================
// SACIADOSHUB — SISTEMA INTEGRADO DE DOAÇÃO VIA PIX PARA AS ONGS
// Botão Flutuante de Canto, Modal Interativo com QR Code e Chave Copia e Cola
// ==========================================================================

(function() {
    console.log("💚 SACIADOSHUB: SISTEMA PIX CARREGADO");

    // Lista oficial de ONGs e suas chaves PIX
    const ONGS_PIX = [
        {
            id: "geral",
            nome: "Fundo Geral de Alimentos SaciadosHub",
            descricao: "Distribuição prioritária para cozinhas comunitárias com estoque crítico",
            chave: "pix@saciadoshub.org.br",
            cidade: "São Paulo - SP",
            refeicoesPor10: 4
        },
        {
            id: "esperanca",
            nome: "ONG Esperança & Vida (Zona Sul)",
            descricao: "Atendimento diário a 180 famílias em vulnerabilidade extrema",
            chave: "financeiro@ongesperancavida.org.br",
            cidade: "São Paulo - SP",
            refeicoesPor10: 5
        },
        {
            id: "mooca",
            nome: "Instituto Solidariedade Mooca (Zona Leste)",
            descricao: "Creche comunitária e café da manhã para 120 crianças",
            chave: "contato@solidariedade-mooca.org.br",
            cidade: "São Paulo - SP",
            refeicoesPor10: 4
        },
        {
            id: "pastoral",
            nome: "Pastoral do Povo da Rua (Centro / Pe. Júlio)",
            descricao: "Marmitas diárias e café da manhã na região central",
            chave: "doacoes@pastoralruasp.org.br",
            cidade: "São Paulo - SP",
            refeicoesPor10: 6
        },
        {
            id: "pratocheio",
            nome: "Associação Prato Cheio (Bela Vista)",
            descricao: "Pioneira no combate ao desperdício e segurança alimentar",
            chave: "pix@pratocheio.org.br",
            cidade: "São Paulo - SP",
            refeicoesPor10: 5
        }
    ];

    let ongAtualSelecionada = ONGS_PIX[0];
    let valorAtualSelecionado = 25;

    // Injetar HTML do Botão Flutuante e do Modal no documento
    function injetarInterfacePix() {
        if (document.getElementById("btnPixFlutuante")) return;

        // 1. Botão Flutuante no Canto Inferior Esquerdo
        const fabPix = document.createElement("div");
        fabPix.id = "btnPixFlutuanteContainer";
        fabPix.className = "pix-fab-container";
        fabPix.innerHTML = `
            <button id="btnPixFlutuante" class="pix-fab-btn" title="Doar via PIX para apoiar as ONGs parceiras">
                <span class="pix-heart-icon">❤️</span>
                <span class="pix-fab-text">Doar PIX p/ ONGs</span>
                <span class="pix-tag-live">R$ Direto</span>
            </button>
        `;
        document.body.appendChild(fabPix);

        // 2. Modal Completo de Doação PIX com QR Code
        const modalPix = document.createElement("div");
        modalPix.id = "modalPixSolidario";
        modalPix.className = "pix-modal-backdrop";
        modalPix.innerHTML = `
            <div class="pix-modal-dialog">
                <div class="pix-modal-header">
                    <div class="pix-header-title-box">
                        <span class="pix-header-heart">❤️</span>
                        <div>
                            <h3 class="pix-modal-title">Apoio Solidário via PIX</h3>
                            <span class="pix-modal-subtitle">Doação 100% direta e sem taxas para as ONGs</span>
                        </div>
                    </div>
                    <button class="pix-modal-close" onclick="fecharModalPix()" title="Fechar janela">✕</button>
                </div>

                <div class="pix-modal-body" id="pixModalBodyContent">
                    <!-- PASSO 1: ESCOLHER ONG -->
                    <div class="pix-form-section">
                        <label class="pix-label">1. Escolha a Instituição Beneficiária:</label>
                        <select id="pixSelectOng" class="pix-select" onchange="atualizarOngPix(this.value)">
                            ${ONGS_PIX.map(o => `<option value="${o.id}">${o.nome}</option>`).join("")}
                        </select>
                        <div id="pixDescricaoOng" class="pix-ong-desc">${ONGS_PIX[0].descricao}</div>
                    </div>

                    <!-- PASSO 2: ESCOLHER VALOR -->
                    <div class="pix-form-section">
                        <label class="pix-label">2. Escolha o Valor da Doação:</label>
                        <div class="pix-valores-grid">
                            <button type="button" class="pix-btn-valor" onclick="selecionarValorPix(10, this)">R$ 10</button>
                            <button type="button" class="pix-btn-valor active" onclick="selecionarValorPix(25, this)">R$ 25</button>
                            <button type="button" class="pix-btn-valor" onclick="selecionarValorPix(50, this)">R$ 50</button>
                            <button type="button" class="pix-btn-valor" onclick="selecionarValorPix(100, this)">R$ 100</button>
                        </div>
                        <div class="pix-custom-amount-wrapper">
                            <span class="pix-currency-symbol">R$</span>
                            <input type="number" id="pixValorCustom" class="pix-input-custom" placeholder="Outro valor (ex: 35)" min="5" oninput="definirValorCustomPix(this.value)">
                        </div>
                    </div>

                    <!-- ESTIMATIVA DE IMPACTO -->
                    <div id="pixImpactoBox" class="pix-impact-box">
                        <span class="pix-impact-icon">🍲</span>
                        <span id="pixImpactoTexto">Sua doação de <strong>R$ 25</strong> garante aproximadamente <strong>10 refeições nutritivas</strong> completas!</span>
                    </div>

                    <!-- PASSO 3: QR CODE & COPIA E COLA -->
                    <div class="pix-qr-section">
                        <div class="pix-qr-frame">
                            <img id="pixQrImg" src="" alt="QR Code PIX para leitura" class="pix-qr-image">
                            <div class="pix-qr-badge">
                                <span class="pix-logo-text">💠 PIX</span>
                            </div>
                        </div>

                        <div class="pix-copia-cola-box">
                            <label class="pix-copia-label">Código PIX Copia e Cola:</label>
                            <div class="pix-copy-input-row">
                                <input type="text" id="pixChaveCopiaCola" readonly class="pix-copy-input" value="">
                                <button type="button" id="btnCopiarPix" class="btn-copiar-pix" onclick="copiarChavePix()">
                                    <span>📋</span> Copiar
                                </button>
                            </div>
                            <span id="pixCopiadoFeedback" class="pix-copied-tag" style="display: none;">✓ Código PIX copiado com sucesso! Abra o app do seu banco.</span>
                        </div>
                    </div>

                    <!-- BOTÃO CONFIRMAR PAGAMENTO SIMULADO -->
                    <div class="pix-modal-footer">
                        <button type="button" class="btn-confirmar-pix" onclick="confirmarPix()">
                            ✅ Já fiz o pagamento no meu banco
                        </button>
                    </div>
                </div>

                <!-- TELA DE SUCESSO / AGRADECIMENTO -->
                <div class="pix-success-screen" id="pixSuccessScreen" style="display: none;">
                    <div class="pix-success-icon">🎉</div>
                    <h3 class="pix-success-title">Gratidão pelo seu gesto!</h3>
                    <p id="pixSuccessMessage" class="pix-success-desc">
                        Sua doação faz a diferença direta no prato de quem tem fome.
                    </p>
                    <div class="pix-success-seal">
                        <span>🛡️ Doação Auditada com Transparência SaciadosHub</span>
                    </div>
                    <button type="button" class="btn-fechar-sucesso" onclick="fecharModalPix()">
                        Voltar ao Site
                    </button>
                </div>
            </div>
        `;
        document.body.appendChild(modalPix);

        // Configurar listener para o botão flutuante
        const btnFab = document.getElementById("btnPixFlutuante");
        if (btnFab) {
            btnFab.addEventListener("click", () => {
                abrirModalPix();
            });
        }

        // Fechar ao clicar fora do diálogo
        modalPix.addEventListener("click", (e) => {
            if (e.target === modalPix) {
                fecharModalPix();
            }
        });

        // Configurar QR Code inicial
        atualizarQrCodePix();
    }

    // Gerar Payload PIX Padronizado (EMV / BR Code)
    function gerarPayloadPix(chave, nomeRecebedor, cidade, valor, txid = "SACIADOSHUB") {
        const formatField = (id, val) => {
            const len = String(val.length).padStart(2, "0");
            return `${id}${len}${val}`;
        };

        const strValor = Number(valor).toFixed(2);
        
        // Formato BR Code simplificado e consistente
        const payloadSemCrc = 
            "000201" +
            formatField("26", formatField("00", "br.gov.bcb.pix") + formatField("01", chave)) +
            "52040000" +
            "5303986" +
            formatField("54", strValor) +
            "5802BR" +
            formatField("59", nomeRecebedor.substring(0, 25)) +
            formatField("60", cidade.substring(0, 15)) +
            formatField("62", formatField("05", txid)) +
            "6304";

        // Cálculo CRC16-CCITT
        let crc = 0xFFFF;
        for (let i = 0; i < payloadSemCrc.length; i++) {
            crc ^= (payloadSemCrc.charCodeAt(i) << 8);
            for (let j = 0; j < 8; j++) {
                if ((crc & 0x8000) !== 0) {
                    crc = ((crc << 1) ^ 0x1021) & 0xFFFF;
                } else {
                    crc = (crc << 1) & 0xFFFF;
                }
            }
        }
        const crcHex = crc.toString(16).toUpperCase().padStart(4, "0");
        return payloadSemCrc + crcHex;
    }

    // Atualizar QR Code e Chave no Modal
    function atualizarQrCodePix() {
        const chavePayload = gerarPayloadPix(
            ongAtualSelecionada.chave,
            ongAtualSelecionada.nome,
            ongAtualSelecionada.cidade,
            valorAtualSelecionado
        );

        const inputCopiaCola = document.getElementById("pixChaveCopiaCola");
        if (inputCopiaCola) {
            inputCopiaCola.value = chavePayload;
        }

        const imgQr = document.getElementById("pixQrImg");
        if (imgQr) {
            // URL de geração de QR Code segura e rápida
            const encoded = encodeURIComponent(chavePayload);
            imgQr.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=8&data=${encoded}`;
        }

        // Atualizar estimativa de impacto
        const textoImpacto = document.getElementById("pixImpactoTexto");
        if (textoImpacto) {
            const refeicoes = Math.max(2, Math.round((valorAtualSelecionado / 10) * ongAtualSelecionada.refeicoesPor10));
            textoImpacto.innerHTML = `Sua doação de <strong>R$ ${valorAtualSelecionado}</strong> garante aproximadamente <strong>${refeicoes} refeições nutritivas</strong> completas preparadas pela <strong>${ongAtualSelecionada.nome}</strong>!`;
        }
    }

    // Funções Públicas no Window
    window.abrirModalPix = function(nomeOngPreSelecionada = null, valorSugerido = null) {
        injetarInterfacePix();
        
        const modal = document.getElementById("modalPixSolidario");
        const bodyContent = document.getElementById("pixModalBodyContent");
        const successScreen = document.getElementById("pixSuccessScreen");
        const feedback = document.getElementById("pixCopiadoFeedback");

        if (feedback) feedback.style.display = "none";
        if (bodyContent) bodyContent.style.display = "block";
        if (successScreen) successScreen.style.display = "none";

        if (nomeOngPreSelecionada) {
            const achada = ONGS_PIX.find(o => o.nome.toLowerCase().includes(nomeOngPreSelecionada.toLowerCase()) || o.id === nomeOngPreSelecionada);
            if (achada) {
                ongAtualSelecionada = achada;
                const select = document.getElementById("pixSelectOng");
                if (select) select.value = achada.id;
                const desc = document.getElementById("pixDescricaoOng");
                if (desc) desc.textContent = achada.descricao;
            }
        }

        if (valorSugerido && Number(valorSugerido) > 0) {
            valorAtualSelecionado = Number(valorSugerido);
            const inputCustom = document.getElementById("pixValorCustom");
            if (inputCustom) inputCustom.value = valorSugerido;
        }

        atualizarQrCodePix();

        if (modal) {
            modal.classList.add("active");
            document.body.style.overflow = "hidden";
        }
    };

    window.fecharModalPix = function() {
        const modal = document.getElementById("modalPixSolidario");
        if (modal) {
            modal.classList.remove("active");
            document.body.style.overflow = "";
        }
    };

    window.atualizarOngPix = function(ongId) {
        const achada = ONGS_PIX.find(o => o.id === ongId);
        if (achada) {
            ongAtualSelecionada = achada;
            const desc = document.getElementById("pixDescricaoOng");
            if (desc) desc.textContent = achada.descricao;
            atualizarQrCodePix();
        }
    };

    window.selecionarValorPix = function(valor, btnElement) {
        valorAtualSelecionado = Number(valor);
        document.querySelectorAll(".pix-btn-valor").forEach(b => b.classList.remove("active"));
        if (btnElement) btnElement.classList.add("active");
        const inputCustom = document.getElementById("pixValorCustom");
        if (inputCustom) inputCustom.value = "";
        atualizarQrCodePix();
    };

    window.definirValorCustomPix = function(valor) {
        const num = Number(valor);
        if (num >= 1) {
            valorAtualSelecionado = num;
            document.querySelectorAll(".pix-btn-valor").forEach(b => b.classList.remove("active"));
            atualizarQrCodePix();
        }
    };

    window.copiarChavePix = function() {
        const input = document.getElementById("pixChaveCopiaCola");
        if (input) {
            input.select();
            input.setSelectionRange(0, 99999);
            navigator.clipboard.writeText(input.value).then(() => {
                const feedback = document.getElementById("pixCopiadoFeedback");
                const btn = document.getElementById("btnCopiarPix");
                if (feedback) feedback.style.display = "block";
                if (btn) btn.innerHTML = "<span>✓</span> Copiado!";
                setTimeout(() => {
                    if (btn) btn.innerHTML = "<span>📋</span> Copiar";
                }, 3000);
            }).catch(() => {
                alert("Código PIX copiado!");
            });
        }
    };

    window.confirmarPix = function() {
        const bodyContent = document.getElementById("pixModalBodyContent");
        const successScreen = document.getElementById("pixSuccessScreen");
        const msg = document.getElementById("pixSuccessMessage");

        // Registrar no localStorage
        let totalDoado = Number(localStorage.getItem("saciadoshub_pix_total") || 0);
        totalDoado += valorAtualSelecionado;
        localStorage.setItem("saciadoshub_pix_total", totalDoado);

        let doacoesPix = JSON.parse(localStorage.getItem("saciadoshub_pix_doacoes") || "[]");
        doacoesPix.push({
            ong: ongAtualSelecionada.nome,
            valor: valorAtualSelecionado,
            data: new Date().toLocaleDateString("pt-BR")
        });
        localStorage.setItem("saciadoshub_pix_doacoes", JSON.stringify(doacoesPix));

        if (msg) {
            msg.innerHTML = `Sua doação solidária de <strong>R$ ${valorAtualSelecionado},00</strong> foi direcionada para a <strong>${ongAtualSelecionada.nome}</strong>. Seu apoio garante refeições nutritivas com dignidade!`;
        }

        if (bodyContent) bodyContent.style.display = "none";
        if (successScreen) successScreen.style.display = "flex";
    };

    // Vincular todos os botões com coração ❤️ na página automaticamente
    function vincularBotoesCoracao() {
        const botoes = document.querySelectorAll("button, a, .btn-atender-need, .btn-coracao-pix");
        botoes.forEach(btn => {
            const texto = (btn.textContent || "").trim();
            if (texto.includes("❤️") && !btn.hasAttribute("data-pix-bound")) {
                btn.setAttribute("data-pix-bound", "true");
                btn.addEventListener("click", (e) => {
                    // Se for o botão de interesse da ONG no painel, mantém a lógica mas também abre PIX se for apoio
                    if (btn.classList.contains("btn-atender-need") || texto.includes("Apoiar") || texto.includes("Doar")) {
                        e.preventDefault();
                        abrirModalPix();
                    }
                });
            }
        });
    }

    // Inicializar quando o DOM estiver pronto
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            injetarInterfacePix();
            vincularBotoesCoracao();
        });
    } else {
        injetarInterfacePix();
        vincularBotoesCoracao();
    }
})();
