const { hasOnlyKeys, isRecord } = require("./http.js");

const MAX_TEXT_CHARS = 500;
const CLASSIFICATIONS = ["good", "warn", "bad", "unclear"];
const CLASSIFICATION_SET = new Set(CLASSIFICATIONS);

const QUESTION_META = {
  paz: { chapter: 1, question: "Esta relação te traz mais paz do que dúvidas?", themes: ["paz"] },
  admira: { chapter: 1, question: "Você admira quem essa pessoa é hoje. ou está esperando que ela vire quem prometeu ser?", themes: ["admiracao", "potencial"] },
  amigo: { chapter: 1, question: "Se uma pessoa amiga estivesse numa relação igual à sua, você torceria para o casal ficar junto?", themes: ["escolha"] },
  hoje: { chapter: 1, question: "Se você conhecesse essa pessoa hoje, sabendo tudo o que sabe… ainda puxaria assunto?", themes: ["escolha"] },
  sozinho: { chapter: 1, question: "Você quer realmente estar nesta relação. ou tem mais medo de ficar sozinho?", themes: ["escolha", "apego"] },
  potencial: { chapter: 1, question: "Você está apaixonado pela pessoa real ou pelo potencial dela?", themes: ["potencial"] },
  afeto: { chapter: 1, question: "Vocês têm momentos genuínos de afeto e carinho que não envolvem sexo?", themes: ["afeto"] },
  carregar: { chapter: 2, question: "Essa pessoa está crescendo junto com você. ou você a está carregando nas costas?", themes: ["reciprocidade"] },
  curiosidade: { chapter: 2, question: "Essa pessoa demonstra curiosidade pelos seus interesses?", themes: ["reciprocidade"] },
  atencao: { chapter: 2, question: "Essa pessoa presta atenção no que você diz. ou esquece as histórias que você já contou?", themes: ["comunicacao"] },
  conquistas: { chapter: 2, question: "Essa pessoa celebra suas conquistas individuais. ou só anima quando faz parte da equação?", themes: ["reciprocidade"] },
  sonhos: { chapter: 2, question: "Suas ideias e seus sonhos são bem-recebidos. ou constantemente questionados?", themes: ["identidade"] },
  explicar: { chapter: 2, question: "Você se sente compreendido. ou precisa se explicar o tempo todo?", themes: ["comunicacao"] },
  decifrar: { chapter: 2, question: "Essa pessoa consegue comunicar o que sente. ou você precisa decifrar o que ela pensa?", themes: ["comunicacao"] },
  facil: { chapter: 3, question: "Esta relação tem deixado sua vida mais fácil ou mais difícil?", themes: ["impacto"] },
  saudade: { chapter: 3, question: "Quando você está longe dessa pessoa, sente saudade de verdade. ou principalmente apego?", themes: ["apego"] },
  alivio: { chapter: 3, question: "Nos dias em que vocês ficam separados, você se sente mais descansado?", themes: ["alivio"] },
  corpo: { chapter: 3, question: "Desde que essa relação começou, você percebeu mudanças persistentes no sono, na ansiedade, na energia ou no bem-estar que parecem ligadas à dinâmica entre vocês?", themes: ["nervoso"] },
  dinheiro: { chapter: 3, question: "Sua vida financeira e a sua relação com o dinheiro mudaram, nesta relação, de um jeito que te preocupa?", themes: ["dinheiro"] },
  provar: { chapter: 3, question: "Você se sente amado por quem é. ou precisa fazer alguma coisa para receber amor?", themes: ["valor"] },
  gostos: { chapter: 4, question: "Você ainda sabe quais livros, músicas, séries e filmes gosta sozinho. ou só reconhece o que compartilham?", themes: ["identidade"] },
  investigar: { chapter: 4, question: "Essa pessoa te instiga a investigar quem você é. ou a provar quem você é?", themes: ["identidade"] },
  familia: { chapter: 4, question: "Passar tempo com familiares e amigos dessa pessoa te traz principalmente alegria. ou obrigação?", themes: ["identidade"] },
  decidir: { chapter: 4, question: "Você toma suas decisões a partir de respeito por si. ou do medo de perder essa pessoa?", themes: ["limites"] },
  emergencia: { chapter: 5, question: "Você colocaria essa pessoa como seu contato de emergência?", themes: ["confianca"] },
  confiar: { chapter: 5, question: "Você confiaria nessa pessoa para cuidar de alguém extremamente importante para você. quando você não pudesse supervisionar?", themes: ["confianca"] },
  intimidade: { chapter: 5, question: "Se uma pessoa importante para você soubesse como é a intimidade de vocês, ficaria feliz com o seu futuro?", themes: ["confianca"] },
  seamar: { chapter: 5, question: "Você se ama o suficiente para reconhecer se esta relação te faz bem?", themes: ["limites"] }
};

function validText(value, max = MAX_TEXT_CHARS) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= max &&
    !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(value);
}

function sameStrings(left, right) {
  if (!Array.isArray(left) || left.length !== right.length || !left.every((value) => typeof value === "string")) {
    return false;
  }
  const expected = [...right].sort();
  return [...left].sort().every((value, index) => value === expected[index]);
}

function validAnswer(answer) {
  if (!hasOnlyKeys(answer, ["id", "chapter", "question", "text", "themes"])) return false;
  const meta = QUESTION_META[answer.id];
  return Boolean(meta) && answer.chapter === meta.chapter &&
    answer.question === meta.question && validText(answer.text) && sameStrings(answer.themes, meta.themes);
}

function validatePayload(payload) {
  const maxAnswers = Object.keys(QUESTION_META).length;
  if (!hasOnlyKeys(payload, ["answers"]) || !Array.isArray(payload.answers) ||
      payload.answers.length < 1 || payload.answers.length > maxAnswers ||
      !payload.answers.every(validAnswer)) {
    return { ok: false, error: "invalid_payload" };
  }
  const ids = payload.answers.map((answer) => answer.id);
  if (new Set(ids).size !== ids.length) return { ok: false, error: "invalid_payload" };
  return { ok: true, value: payload };
}

function configuredThreshold(env) {
  const raw = env.SNEUB_JEV_MIN_CONFIDENCE;
  if (raw == null || String(raw).trim() === "") return null;
  const threshold = Number(raw);
  if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
    throw Object.assign(new Error("invalid_threshold"), { code: "invalid_configuration" });
  }
  return threshold;
}

function validProbabilities(value) {
  if (!isRecord(value) || Object.keys(value).sort().join(",") !== "bad,good,unclear,warn") return false;
  const probabilities = CLASSIFICATIONS.map((key) => value[key]);
  return probabilities.every((number) => Number.isFinite(number) && number >= 0 && number <= 1) &&
    Math.abs(probabilities.reduce((sum, number) => sum + number, 0) - 1) <= 0.001;
}

function normalizeProviderResponse(body, sentAnswers, threshold) {
  if (!isRecord(body) || !isRecord(body.answers)) return null;
  const expectedIds = sentAnswers.map((answer) => answer.id).sort();
  if (Object.keys(body.answers).sort().join(",") !== expectedIds.join(",")) return null;
  const analysis = {};
  for (const id of expectedIds) {
    const answer = body.answers[id];
    if (!hasOnlyKeys(answer, ["type", "choice", "probabilities", "confidence"]) ||
        answer.type !== "choice" || !CLASSIFICATION_SET.has(answer.choice) ||
        !Number.isFinite(answer.confidence) || answer.confidence < 0 || answer.confidence > 1 ||
        !validProbabilities(answer.probabilities)) return null;
    const state = answer.choice !== "unclear" && (threshold == null || answer.confidence < threshold)
      ? "unclear"
      : answer.choice;
    analysis[id] = {
      state,
      confidence: answer.confidence,
      probabilities: Object.fromEntries(CLASSIFICATIONS.map((key) => [key, answer.probabilities[key]]))
    };
  }
  return { analysis };
}

module.exports = {
  CLASSIFICATIONS,
  MAX_TEXT_CHARS,
  QUESTION_META,
  configuredThreshold,
  normalizeProviderResponse,
  validatePayload,
  validProbabilities,
  validText
};
