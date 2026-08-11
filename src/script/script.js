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

        element.textContent = base;


        if (base !== originalDNA[index]) {

            element.classList.add("mutated");

        }


        container.appendChild(element);

    });

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
            "🔄 Substituição: uma base foi trocada por outra.";

    }


    if (type === "insercao") {

        currentDNA.splice(
            4,
            0,
            "G"
        );


        message =
            "➕ Inserção: uma nova base foi adicionada à sequência.";

    }


    if (type === "delecao") {

        currentDNA.splice(
            4,
            1
        );


        message =
            "➖ Deleção: uma base foi removida da sequência.";

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


function answer(button, correct) {

    if (
        button.classList.contains("correct") ||
        button.classList.contains("wrong")
    ) {

        return;

    }


    answered++;


    if (correct) {

        button.classList.add("correct");

        score++;

    } else {

        button.classList.add("wrong");

    }


    if (answered === 3) {

        document.getElementById(
            "quizResult"
        ).textContent =
            `🎯 Resultado: ${score}/3 respostas corretas!`;

    }

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