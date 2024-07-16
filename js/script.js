document.addEventListener("DOMContentLoaded", () => {
    const ctx = document.querySelector("#myChart");
    const container = document.querySelector(".container");
    const textarea = document.querySelector("#texto");
    const btnGrafico = document.querySelector("#btn_grafico");
    const btnClear = document.querySelector("#btn_clear");
    const btnDownload = document.querySelector("#btn_download");
    const btnAleatorio = document.querySelector("#btn_aleatorio");
    const separadorSelect = document.querySelector("#separador");
    const contagemDiv = document.querySelector("#contagem");
    const progress = document.querySelector("#progress");
    const grafico = document.querySelector("#grafico");
    const numerosNecessarios = 50;
    let chartInstance = null; // Variável para armazenar a instância do gráfico

    //Inicializa o botão de download
    btnDownload.textContent = "Baixar Gráfico";
    btnDownload.id = "btn_download";
    btnDownload.classList.add("btn"); // Add CSS class
    btnDownload.style.display = "none"; // Initially hidden
    container.appendChild(btnDownload); // Append button to body

    //Funções
    function separaString(texto) {
        let numeros;
        const separador = separadorSelect.value;
        numeros =
            separador === "espaco" ? texto.split(/\s+/) : texto.split(/\n+/);
        return numeros.filter((num) => /^[0-9]+$/.test(num.trim())); // Remove entradas vazias e ignora caracteres não numéricos
    }

    function showAlert(message) {
        const alertBox = document.getElementById("customAlert");
        const alertMessage = document.getElementById("customAlertMessage");
        const alertButton = document.getElementById("customAlertButton");
        alertMessage.textContent = message;
        alertBox.style.display = "flex"; // Mostrar a caixa de alerta
        alertButton.onclick = () => (alertBox.style.display = "none"); // Ocultar a caixa de alerta ao clicar em OK
    }

    function contaNumeros() {
        const numeros = separaString(textarea.value);
        const contNumeros = numeros.length;
        contagemDiv.innerHTML = "Números digitados: " + contNumeros; // Atualiza a contagem
        return contNumeros;
    }

    function gerarNumerosAleatorios() {
        const separador = separadorSelect.value;
        const numeros = [];
        for (let i = 0; i < 50; i++) {
            const numeroAleatorio = Math.floor(Math.random() * 50) + 1; // Gera números de 1 a 50
            numeros.push(numeroAleatorio);
        }
        textarea.value = numeros.join(separador === "espaco" ? " " : "\n");
    }

    function showDownloadButton() {
        btnDownload.style.display = "inline-block"; // Exibe o botão de download
    }

    textarea.addEventListener("input", () => {
        let cont = contaNumeros();

        // Calcula a porcentagem de progresso
        let percentage = (cont / numerosNecessarios) * 100;

        // Ajusta a largura da barra de progresso
        progress.style.width = percentage <= 100 ? percentage + "%" : "100%";

        // Ajusta a tela para exibir o gráfico
        grafico.style.border = percentage >= 100 ? "3px solid #77d17a" : "none";
        grafico.style.animation =
            percentage >= 100 ? "border-blink 1s infinite" : "none";

        // Ajusta a cor da barra de progresso
        progress.style.backgroundColor =
            percentage <= 49
                ? "#ed5421"
                : percentage <= 99
                ? "#f5ed05"
                : "#77d17a";
    });

    textarea.addEventListener("input", (event) => {
        const separador = separadorSelect.value;

        // Validação: Remove espaços se o separador for "enter" e vice-versa
        if (separador === "espaco") {
            textarea.value = textarea.value.replace(/\n/g, ""); // Remove quebras de linha
        } else if (separador === "enter") {
            textarea.value = textarea.value.replace(/\s+/g, "\n"); // Substitui espaços por quebras de linha
        }

        // Remove qualquer caractere que não seja um número ou o separador
        if (separador === "espaco") {
            textarea.value = textarea.value.replace(/[^0-9\s]/g, ""); // Remove caracteres inválidos
        } else if (separador === "enter") {
            textarea.value = textarea.value.replace(/[^0-9\n]/g, ""); // Remove caracteres inválidos
        }
    });

    btnGrafico.addEventListener("click", () => {
        if (contaNumeros() < 50) {
            showAlert(
                "Você deve inserir no mínimo 50 números para validar a Lei de Benford."
            );
        } else {
            const lista_contagem = contagem();
            plot(lista_contagem);
            grafico.display = "flex";
            grafico.style.backgroundColor = "#f7f4f2";
            showDownloadButton(); // Exibe o botão de download depois do gráfico
            btnGrafico.scrollIntoView({ behavior: "smooth" }); // Rola para a div do gráfico
        }
    });

    btnClear.addEventListener("click", () => {
        textarea.value = "";
        contagemDiv.innerHTML = "";
        progress.style.width = "0%"; // Reseta a largura da barra de progresso
        if (chartInstance) {
            chartInstance.destroy(); // Destroi o gráfico existente
        }
        grafico.style.backgroundColor = "none";
        grafico.style.border = "none";
        grafico.style.animation = "none";
        btnDownload.style.display = "none";

        window.scrollTo({ top: 0, behavior: "smooth" }); // Rola de volta para o topo
    });

    btnAleatorio.addEventListener("click", () => {
        gerarNumerosAleatorios();
        window.scrollTo({ top: 0, behavior: "smooth" }); // Rola de volta para o topo
    });

    function contagem() {
        let vetor_numeros = separaString(textarea.value);
        let lista = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (var i = 0; i < vetor_numeros.length; i++) {
            let digito = vetor_numeros[i][0];
            lista[digito - 1]++;
        }
        return lista;
    }

    function plot(lista_contagem) {
        if (chartInstance) {
            chartInstance.destroy(); // Destroi o gráfico existente antes de criar um novo
        }
        chartInstance = new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["1", "2", "3", "4", "5", "6", "7", "8", "9"],
                datasets: [
                    {
                        data: lista_contagem,
                        borderWidth: 1,
                        backgroundColor: "#454bc4",
                        borderColor: "#333",
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            font: {
                                size: 14, // Aumenta o tamanho da fonte do eixo Y
                            },
                        },
                    },
                    x: {
                        ticks: {
                            font: {
                                size: 14, // Aumenta o tamanho da fonte do eixo X
                            },
                        },
                    },
                },
                plugins: {
                    title: {
                        display: true,
                        text: "Frequência do primeiro dígito",
                        color: "#0d16bb",
                        font: {
                            size: 24, // Aumenta o tamanho da fonte do título
                        },
                    },
                    legend: {
                        display: false,
                    },
                },
            },
        });
    }

    // Baixar gráfico
    btnDownload.addEventListener("click", () => {
        if (chartInstance) {
            const link = document.createElement("a");
            link.href = chartInstance.toBase64Image(); // Obtém a imagem em base64 do gráfico
            link.download = "grafico.png"; // Nome do arquivo para download
            link.click(); // Simula um clique para iniciar o download
        } else {
            showAlert("Por favor, crie um gráfico antes de tentar baixá-lo."); // Mensagem se não houver gráfico
        }
    });
});
