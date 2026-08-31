/* =========================
   TABELA DO CÓDIGO GENÉTICO
   (códons de RNAm -> aminoácido,
   usada apenas para mostrar o efeito
   da mutação nos 3 primeiros nucleotídeos)
========================= */
const CODON_TABLE = {
    "UUU": "Fenilalanina", "UUC": "Fenilalanina",
    "UUA": "Leucina", "UUG": "Leucina",
    "CUU": "Leucina", "CUC": "Leucina", "CUA": "Leucina", "CUG": "Leucina",
    "AUU": "Isoleucina", "AUC": "Isoleucina", "AUA": "Isoleucina",
    "AUG": "Metionina (início)",
    "GUU": "Valina", "GUC": "Valina", "GUA": "Valina", "GUG": "Valina",
    "UCU": "Serina", "UCC": "Serina", "UCA": "Serina", "UCG": "Serina",
    "CCU": "Prolina", "CCC": "Prolina", "CCA": "Prolina", "CCG": "Prolina",
    "ACU": "Treonina", "ACC": "Treonina", "ACA": "Treonina", "ACG": "Treonina",
    "GCU": "Alanina", "GCC": "Alanina", "GCA": "Alanina", "GCG": "Alanina",
    "UAU": "Tirosina", "UAC": "Tirosina",
    "UAA": "Stop", "UAG": "Stop", "UGA": "Stop",
    "CAU": "Histidina", "CAC": "Histidina",
    "CAA": "Glutamina", "CAG": "Glutamina",
    "AAU": "Asparagina", "AAC": "Asparagina",
    "AAA": "Lisina", "AAG": "Lisina",
    "GAU": "Aspartato", "GAC": "Aspartato",
    "GAA": "Glutamato", "GAG": "Glutamato",
    "UGU": "Cisteína", "UGC": "Cisteína",
    "UGG": "Triptofano",
    "CGU": "Arginina", "CGC": "Arginina", "CGA": "Arginina", "CGG": "Arginina",
    "AGU": "Serina", "AGC": "Serina",
    "AGA": "Arginina", "AGG": "Arginina",
    "GGU": "Glicina", "GGC": "Glicina", "GGA": "Glicina", "GGG": "Glicina"
};

function dnaToCodon(bases3) {
    // SIMPLIFICAÇÃO DIDÁTICA: aplica o complemento base a base
    // (A<->U, T<->A, G<->C, C<->G) na própria ordem do array,
    // tratando-o como a fita molde. Uma transcrição real também
    // inverte o sentido de leitura da fita (5'->3' torna-se
    // complementar em 3'->5'); isso é omitido aqui para manter o
    // simulador simples. Suficiente para ilustrar o conceito de
    // códon e degenerescência do código genético.
    const map = { A: "U", T: "A", G: "C", C: "G" };
    return bases3.map(b => map[b] || "?").join("");
}

function aminoacidFor(bases3) {
    if (bases3.length < 3 || bases3.some(b => !map_ok(b))) return null;
    const codon = dnaToCodon(bases3);
    return CODON_TABLE[codon] || null;
}

function map_ok(base) {
    return ["A", "T", "G", "C"].includes(base);
}


/* =========================
   SIMULADOR DE DNA
========================= */
const originalDNA = [
    "A",
    "T",
    "G",
    "C",
    "A",
    "G",
    "T",
    "C",
    "G",
    "A"
];
let currentDNA = [...originalDNA];

function renderDNA() {
    const container =
        document.getElementById("dna");
    container.innerHTML = "";
    currentDNA.forEach((base, index) => {
        const element =
            document.createElement("div");
        element.className = "base";
        element.setAttribute("role", "listitem");
        element.textContent = base;
        if (index < 3) {
            element.classList.add("codon");
        }
        if (base !== originalDNA[index]) {
            element.classList.add("mutated");
        }
        container.appendChild(element);
    });
    renderCodonReadout();
}

function renderCodonReadout() {
    const readout = document.getElementById("codonReadout");
    if (!readout) return;

    const originalAmino = aminoacidFor(originalDNA.slice(0, 3));
    const currentAmino = aminoacidFor(currentDNA.slice(0, 3));

    if (!currentAmino) {
        readout.innerHTML =
            "Códon incompleto: sem aminoácido correspondente.";
        return;
    }

    if (currentAmino === originalAmino) {
        readout.innerHTML =
            `Aminoácido do 1º códon: <strong>${currentAmino}</strong> (sem alteração)`;
    } else {
        readout.innerHTML =
            `Aminoácido do 1º códon: <strong>${currentAmino}</strong> ` +
            `(era ${originalAmino})`;
    }
}

function mutate(type) {
    currentDNA = [...originalDNA];
    let message = "";
    if (type === "substituicao") {
        const position = 4;
        currentDNA[position] =
            currentDNA[position] === "A"
                ? "T"
                : "A";
        message =
            "🔄 Substituição: uma base foi trocada por outra. " +
            "Dependendo da posição, isso pode não mudar o aminoácido " +
            "(mutação silenciosa), trocá-lo (missense) ou criar um " +
            "códon de parada (nonsense).";
    }
    if (type === "insercao") {
        currentDNA.splice(
            4,
            0,
            "G"
        );
        message =
            "➕ Inserção: uma nova base foi adicionada à sequência. " +
            "A partir desse ponto, todos os códons seguintes mudam " +
            "de leitura (mutação frameshift).";
    }
    if (type === "delecao") {
        currentDNA.splice(
            4,
            1
        );
        message =
            "➖ Deleção: uma base foi removida da sequência. " +
            "Assim como na inserção, isso desloca a leitura dos " +
            "códons seguintes (mutação frameshift).";
    }
    renderDNA();
    document.getElementById(
        "mutationResult"
    ).textContent = message;
}

function resetDNA() {
    currentDNA = [...originalDNA];
    renderDNA();
    document.getElementById(
        "mutationResult"
    ).textContent =
        "Sequência restaurada para o estado original.";
}

renderDNA();


/* =========================
   QUIZ
========================= */
let score = 0;
let answered = 0;
const TOTAL_QUESTIONS =
    document.querySelectorAll(".quiz .question").length;

function answer(button, correct) {
    const questionEl = button.closest(".question");
    const alreadyAnswered =
        questionEl.querySelector(".correct, .wrong");

    if (alreadyAnswered) {
        return;
    }

    answered++;

    if (correct) {
        button.classList.add("correct");
        score++;
    } else {
        button.classList.add("wrong");
        // Revela também qual era a alternativa correta
        const correctButton = Array.from(
            questionEl.querySelectorAll(".answers button")
        ).find(b => b.getAttribute("onclick").includes("true"));
        if (correctButton) {
            correctButton.classList.add("correct");
        }
    }

    // Trava todas as opções da pergunta após responder
    questionEl
        .querySelectorAll(".answers button")
        .forEach(b => b.disabled = true);

    if (answered === TOTAL_QUESTIONS) {
        document.getElementById(
            "quizResult"
        ).textContent =
            `🎯 Resultado: ${score}/${TOTAL_QUESTIONS} respostas corretas!`;
        document.getElementById("quizResetBtn").hidden = false;
    }
}

function resetQuiz() {
    score = 0;
    answered = 0;

    document
        .querySelectorAll(".quiz .answers button")
        .forEach(button => {
            button.classList.remove("correct", "wrong");
            button.disabled = false;
        });

    document.getElementById("quizResult").textContent =
        "Responda às questões.";
    document.getElementById("quizResetBtn").hidden = true;
}


/* =========================
   MITO OU VERDADE
========================= */
function mythAnswer(isMyth) {
    const result =
        document.getElementById(
            "mythResult"
        );
    if (isMyth) {
        result.textContent =
            "✅ Correto! É MITO. As mutações podem ser neutras, prejudiciais ou, em alguns contextos, favorecer determinadas características.";
    } else {
        result.textContent =
            "❌ Não exatamente. É MITO: nem toda mutação é prejudicial.";
    }
}


/* =========================
   CARIÓTIPO INTERATIVO
========================= */
const karyotypeNotes = {
    "21": "Par 21: na maioria dos casos de síndrome de Down, " +
        "existe uma terceira cópia — uma trissomia — em vez das " +
        "duas cópias habituais.",
    "X": "Cromossomo X: presente em duas cópias em pessoas do " +
        "sexo feminino (XX) e em uma cópia em pessoas do sexo " +
        "masculino (XY).",
    "Y": "Cromossomo Y: presente apenas em pessoas do sexo " +
        "masculino, em par com o cromossomo X (XY)."
};

function setupKaryotype() {
    const buttons = document.querySelectorAll(".karyotype-chromosome");
    const info = document.getElementById("karyotypeInfo");
    if (!buttons.length || !info) return;

    buttons.forEach(button => {
        button.addEventListener("click", () => {
            buttons.forEach(b => b.classList.remove("active"));
            button.classList.add("active");

            const pair = button.dataset.pair;
            info.textContent =
                karyotypeNotes[pair] ||
                `Par ${pair}: um dos 23 pares de cromossomos do ` +
                `cariótipo humano típico.`;
        });
    });
}

setupKaryotype();
